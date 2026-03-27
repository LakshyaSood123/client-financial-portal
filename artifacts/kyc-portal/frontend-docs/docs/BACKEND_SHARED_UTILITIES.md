# Backend shared utilities (cdktf/src/backend/shared)

This folder exists to keep security- and correctness-sensitive helpers as a single source of truth across Lambda entrypoints.

## Modules
- `cdktf/src/backend/shared/ssrf.ts`: SSRF/URL validation (`validatePublicHttpsUrl`) with typed `UrlValidationError`.
- `cdktf/src/backend/shared/http.ts`: fetch helpers (`postJsonWithTimeout`) with timeout + streaming response-snippet capture.
- `cdktf/src/backend/shared/json.ts`: deterministic JSON (`stableStringify`) for stable hashing/signature inputs.
- `cdktf/src/backend/shared/time.ts`: time helpers (`isoNow`, `nowIso`, `todayUTC`, `unixEpochSeconds`).

## Where used
- Webhook endpoint validation (registration/update): `cdktf/src/backend/controller/index.ts` uses shared SSRF validation.
- Webhook delivery: `cdktf/src/backend/webhooks/delivery-worker.ts` uses shared SSRF + shared HTTP post helper.
- Webhook signatures: `cdktf/src/backend/webhooks/delivery-worker.ts` uses `stableStringify()` for deterministic serialization.
- Timestamps: controller, billing, video submitter, and webhook workers import from `cdktf/src/backend/shared/time.ts`.

## Operational constraints
- Do not add high-cardinality metric dimensions (no tenant_id/api_key_id).
- Do not accept caller-controlled env/tenant headers; env remains derived from ApiKeyRecord.environment.

