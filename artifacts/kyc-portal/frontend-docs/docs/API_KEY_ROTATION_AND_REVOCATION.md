# API Key Rotation & Revocation (Edge Authorizer)

This document describes operationally safe API key rotation and revocation while preserving the public auth contract:

- Clients send `Authorization: Bearer <api_key_id>.<secret>` (secret may contain `.`).
- The edge Lambda REQUEST authorizer loads the API key record by `api_key_id` (ConsistentRead), verifies secrets using Argon2id, and derives tenant/env/scopes from the record (never from caller headers).

## Data model (DynamoDB `api-keys`)

- CURRENT secret hash: `hashed_secret`
- NEXT secret hash (optional): `hashed_secret_next`
- Rotation window:
  - `next_active_from` (ISO string or epoch)
  - `rotation_grace_seconds` (max 7 days)
- Revocation:
  - `status` set to `REVOKED`
  - `revoked_at`, `revoked_by`, `revoke_reason`

Source of truth: `cdktf/src/backend/auth/authorizer.ts`.

## Authorizer behavior

1) Always enforce origin verification header (CloudFront → API) before any DynamoDB/Argon2 work.
2) Verify CURRENT secret first (`hashed_secret`).
3) If CURRENT fails and NEXT exists and the current time is within the rotation window, verify NEXT (`hashed_secret_next`).
4) If NEXT matches, the request is allowed and metrics/audit mark `secret_version=NEXT`.
5) If `status != ACTIVE` (including `REVOKED`) or `expires_at` has passed, the request is denied.

Metrics (low-cardinality; no tenant/api_key dimensions):
- Cache: `kyc.api_key_cache_hit_total`, `kyc.api_key_cache_miss_total`, `kyc.api_key_cache_singleflight_wait_total`
- Rotation: `kyc.api_key_next_secret_used_total`
- Revocation denies: `kyc.api_key_revoked_deny_total`
- Admin lifecycle (emitted by controller):
  - `key.rotate_total` with dims `{env,outcome}`
  - `key.revoke_total` with dims `{env,outcome}`

Audit writes (best-effort):
- Writes to `api-key-audit` with `secret_version=CURRENT|NEXT` when applicable.

Operational visibility (recommended)
- Ops dashboard includes key lifecycle widgets (rotate/revoke + next-secret usage) to help validate propagation.
- Alarm: authorizer throttles (`AWS/Lambda Throttles` > 0) indicates edge/auth capacity pressure or upstream bursts.

## Admin APIs (controller)

Admin APIs are gated by BOTH:
- `admin:write` scope in authorizer context
- header `x-admin-token` equals `ADMIN_TOKEN`

### Rotate key

Route: `POST /apikeys/rotate`

Input (JSON):
- `api_key_id` (required)
- `next_active_from` (optional; default now)
- `rotation_grace_seconds` (optional; default 86400; max 604800)
- `reason` (optional)
- `actor` / `rotated_by` (optional)

Output:
- `bearer`: `Bearer <api_key_id>.<new_secret>` (returned once; never stored)

### Revoke key

Route: `POST /apikeys/revoke`

Input (JSON):
- `api_key_id` (required)
- `reason` (optional)
- `actor` / `revoked_by` (optional)

Effect:
- Sets `status=REVOKED` and records revoke metadata.

### Inspect key metadata

Route: `GET /apikeys/{apiKeyId}`

Output:
- Metadata only; excludes `hashed_secret` and `hashed_secret_next`.

Source of truth: `cdktf/src/backend/controller/index.ts`.

## Verification playbook (rotation/revoke “confidence”)

Rotation
1) Rotate: call `POST /apikeys/rotate` and distribute the new bearer secret securely.
2) Confirm mixed-mode window works: watch `kyc.api_key_next_secret_used_total` increase after clients begin using the new secret.
3) After grace period, ensure clients are fully migrated (no unexpected denies).

Revocation
1) Revoke: call `POST /apikeys/revoke`.
2) Confirm denies: watch `kyc.api_key_revoked_deny_total` and authorizer `auth.denied_total` increase for attempted use of the revoked key.
3) Confirm no lingering “allow” decisions beyond cache TTL (cache TTL is clamped server-side).
