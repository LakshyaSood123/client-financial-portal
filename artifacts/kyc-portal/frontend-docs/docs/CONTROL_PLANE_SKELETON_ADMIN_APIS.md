# Control Plane Skeleton (Admin APIs)

This repo includes a vendor-neutral “control plane skeleton” to unblock onboarding and basic governance without building a full dashboard or integrating external KYB/payment/email providers.

All routes are implemented in `cdktf/src/backend/controller/index.ts` and wired in `cdktf/src/stacks/dev.ts`.

## AuthZ (admin-gated)

All admin routes require BOTH:
- `admin:write` in the authorizer context scopes (`event.requestContext.authorizer.lambda.scopes_json`)
- header `x-admin-token` equals `ADMIN_TOKEN`

## Durable admin audit

All admin actions write an entry to the DynamoDB admin audit table:
- Table: `${prefix}-admin-audit`
- PK: `tenantId`
- SK: `timestamp`

See `cdktf/src/constructs/storage/index.ts` and `cdktf/src/backend/controller/index.ts`.

## Durable control-plane event log (idempotent)

In addition to the admin audit table, control-plane actions also write a **durable, append-only event record** to a dedicated DynamoDB table:

- Table: `${prefix}-controlplane-events`
- PK: `idempotency_key` (one record per request)
- GSI: `GSI_EnvOccurredAt` (`env`, `occurred_at`) for time-ordered ops/audit review
- Lambda env var: `CONTROL_PLANE_EVENTS_TABLE`

Idempotency:
- Provide `x-idempotency-key` for safe retries; the controller namespaces it per action (`<action_type>#<key>`).
- If no header is provided, the controller falls back to API Gateway `requestId` (best-effort; retries may not share the same requestId).

Security:
- No secrets are persisted (API key secrets, webhook signing secrets, origin secret, etc).
- Webhook URLs are not stored in the event payload summary; only a SHA-256 prefix is recorded for correlation.

## Endpoints

### Tenant onboarding
- `POST /tenants`
  - Creates a TenantCore record + initializes TenantBalance + writes an initial PlanSnapshot in a single DynamoDB transaction.

### API keys
- `POST /apikeys`
  - Creates an API key record and returns a Bearer token once.
- `POST /apikeys/rotate`
  - Writes NEXT-secret rotation fields and returns the new secret once.
- `POST /apikeys/revoke`
  - Sets `status=REVOKED` and records revoke metadata.
- `GET /apikeys/{apiKeyId}`
  - Returns metadata only (no secret hashes).

### Billing
- `POST /billing/topup`
  - Transactionally appends a TOP_UP ledger entry and updates the tenant balance.

### KYB lifecycle (skeleton)
- `POST /kyb/start`
  - Sets `kyb_status=PENDING` and timestamps submission.
- `POST /kyb/complete`
  - Sets `kyb_status=APPROVED|REJECTED` and stores vendor_ref/reason placeholders.

### Risk tier (skeleton)
- `POST /risk/recompute`
  - Deterministic placeholder risk policy based on current tenant fields.
- `POST /risk/override`
  - Admin override of risk_tier with reason/actor recorded.

### Notifications (skeleton)
- `POST /notify`
  - Enqueues a notification event to `NOTIFICATIONS_QUEUE_URL` (SQS). Consumers are out of scope.

### Plans (pricing/caps)
- `POST /plans/snapshot`
  - Creates an immutable PlanSnapshot record effective at a given time.
- `POST /plans/overrides`
  - Creates a time-bounded tenant override record for a single plan field.
