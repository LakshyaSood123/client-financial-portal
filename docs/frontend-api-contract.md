# Frontend API Contract

Status: evidence-based. All endpoints and shapes sourced from code; unknowns flagged.

## Table of Contents
1. Auth Header Recipes
2. Portal Endpoints (Cognito)
3. Admin/Compliance Endpoints (Admin Token)
4. Data-Plane Endpoints (API Key)
5. Common Error Patterns
6. Idempotency and Retries
7. Webhook Signature Verification

---

## 1. Auth Header Recipes

### 1.1 Portal (Cognito)
- Header: `Authorization: Bearer <Cognito ID token>`
- Token type: ID token (`tokenUse: "id"`). Source: `kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:12`.
- Origin verification: `x-origin-verify` is injected by CloudFront when using the API CloudFront URL. Source: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:174`.
- Direct API Gateway usage (dev only): must include `x-origin-verify` with SSM secret. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:46`.

### 1.2 Admin/Compliance
- Header: `x-admin-token: <ADMIN_TOKEN>`
- Scope required: `admin:write`. Source: `kyc-infra-main/cdktf/src/backend/controller/context.ts:94`.

### 1.3 Data Plane (API Key)
- Header: `Authorization: Bearer <api_key_id>.<secret>`
- Origin verification: `x-origin-verify` required when calling API Gateway directly. Source: `kyc-infra-main/cdktf/src/backend/auth/authorizer.ts:213`.

---

## 2. Portal Endpoints (Cognito)

Each endpoint below is routed through the portal authorizer. Source: `kyc-infra-main/cdktf/src/constructs/api/index.ts:381`.

### 2.1 GET /portal/me
- Response:
  ```json
  {
    "identity": { "id": "<principalId>", "email": "user@example.com" },
    "tenant": {
      "id": "<tenant_id>",
      "role": "OWNER",
      "name": "<company_name>",
      "kyb_status": "PENDING|APPROVED|REJECTED",
      "ops_status": "ACTIVE|SUSPENDED|BLOCKED",
      "risk_tier": "LOW|MEDIUM|HIGH",
      "plan": "FREE_TIER|..."
    }
  }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:117`.

### 2.2 POST /portal/onboarding
- Request:
  ```json
  { "company_name": "Acme Corp" }
  ```
- Response:
  ```json
  {
    "message": "Tenant created successfully",
    "tenant": { "id": "tn_...", "name": "Acme Corp", "plan": "FREE_TIER" }
  }
  ```
- Errors: 400 missing company_name, 409 already has tenant. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:30`.

### 2.3 POST /portal/onboarding/upload-url
- Request:
  ```json
  { "filename": "doc.pdf", "content_type": "application/pdf" }
  ```
- Response:
  ```json
  { "upload_url": "https://...", "key": "kyb/...", "expires_in": 300 }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:101`.

### 2.4 GET /portal/stats
- Response:
  ```json
  {
    "stats": {
      "jobs_today": 0,
      "jobs_total_30d": 0,
      "environment": "SANDBOX|PROD",
      "history": { "YYYY-MM-DD": 123 }
    }
  }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/stats.ts:48`.

### 2.5 GET /portal/billing/balance
- Response:
  ```json
  { "balance": { "tenant_id": "...", "current_balance": 0, "billing_status": "..." } }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/billing.ts:86`.

### 2.6 GET /portal/billing/ledger
- Response:
  ```json
  { "transactions": [ { "kind": "TOP_UP|USAGE|PENALTY", "created_at": "..." } ] }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/billing.ts:91`.

### 2.7 GET /portal/apikeys
- Response:
  ```json
  { "keys": [ { "id": "key_...", "name": "Default Key", "prefix": "key_...", "status": "ACTIVE|REVOKED" } ] }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/apikeys.ts:12`.

### 2.8 POST /portal/apikeys
- Request:
  ```json
  { "name": "New API Key" }
  ```
- Response:
  ```json
  {
    "message": "API Key created. Save this secret, it will not be shown again.",
    "key": { "id": "key_...", "secret": "key_...<secret>", "name": "New API Key", "created_at": "..." }
  }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/apikeys.ts:43`.

### 2.9 DELETE /portal/apikeys/{keyId}
- Response:
  ```json
  { "message": "Key revoked successfully" }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/apikeys.ts:85`.

### 2.10 GET /portal/audit-logs
- Response:
  ```json
  { "logs": [ { "id": "...", "event": "...", "occurred_at": "...", "actor": "...", "status": "..." } ] }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/audit.ts:9`.

### 2.11 Webhooks (Portal)
All endpoints below share validation:
- `target_url` must be public HTTPS; `event_types` must be non-empty array. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/webhooks.ts:60` and `kyc-infra-main/cdktf/src/backend/shared/ssrf.ts:82`.

- POST `/portal/webhooks/endpoints`
  - Response: `{ "endpoint_id": "WH_...", "signing_secret": "whsec_***" }`
- GET `/portal/webhooks/endpoints`
  - Response: `{ "endpoints": [ ... ] }`
- GET `/portal/webhooks/endpoints/{endpointId}`
  - Response: endpoint record (secret omitted)
- PATCH `/portal/webhooks/endpoints/{endpointId}`
  - Response: updated endpoint
- POST `/portal/webhooks/endpoints/{endpointId}/rotate-secret`
  - Response: `{ "endpoint_id": "...", "signing_secret": "whsec_***" }`
- POST `/portal/webhooks/endpoints/{endpointId}/test`
  - Response: `{ "test_delivery_id": "EVT_...#WH_...", "event_id": "EVT_..." }`
- GET `/portal/webhooks/deliveries`
  - Query: `from`, `to`, `status`, `endpoint_id`, `event_type`, `limit`, `cursor`
  - Response: `{ "items": [ ... ], "cursor": "..." }`
- GET `/portal/webhooks/deliveries/{deliveryId}`
  - Response: delivery log record
- POST `/portal/webhooks/deliveries/{deliveryId}/replay`
  - Response: `{ "replayed": true }`

Sources: `kyc-infra-main/cdktf/src/backend/controller/index.ts:135` and `kyc-infra-main/cdktf/src/backend/controller/routes/webhooks.ts:60`.

---

## 3. Admin/Compliance Endpoints (Admin Token)

These endpoints are unauthenticated at API Gateway but enforce `x-admin-token` and admin scope in the controller. Source: `kyc-infra-main/cdktf/src/constructs/api/index.ts:405`.

### 3.1 POST /tenants
- Request: `tenant_id`, `kyb_status`, `ops_status`, `env_access`, `plan_snapshot` with required fields.
- Response: `{ "ok": true, "tenant_id": "...", "plan_effective_from": "..." }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:33`.

### 3.2 POST /apikeys
- Request: `tenant_id`, `environment`, `scopes`, `expires_at`.
- Response: `{ "ok": true, "api_key_id": "...", "secret": "...", "bearer": "Bearer ..." }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:97`.

### 3.3 POST /apikeys/rotate
- Request: `api_key_id`, `rotation_grace_seconds?`, `reason?`.
- Response: new bearer token.
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:123`.

### 3.4 POST /apikeys/revoke
- Request: `api_key_id`, `reason?`.
- Response: `{ "ok": true, "revoked_at": <epoch> }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:180`.

### 3.5 POST /kyb/start
- Request: `tenant_id`, `actor?`.
- Response: `{ "ok": true, "tenant_id": "...", "kyb_status": "PENDING", "submitted_at": "..." }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:221`.

### 3.6 POST /kyb/complete
- Request: `tenant_id`, `kyb_status` (APPROVED/REJECTED), `vendor_ref?`, `reason?`.
- Response: `{ "ok": true, "tenant_id": "...", "kyb_status": "...", "completed_at": "..." }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:246`.

### 3.7 POST /risk/recompute
- Request: `tenant_id`.
- Response: `{ "ok": true, "tenant_id": "...", "risk_tier": "...", "computed_at": "..." }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:276`.

### 3.8 POST /risk/override
- Request: `tenant_id`, `risk_tier`, `reason?`.
- Response: `{ "ok": true, "tenant_id": "...", "risk_tier": "...", "overridden_at": "..." }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:308`.

### 3.9 POST /billing/topup
- Request: `tenant_id`, `amount`, `environment?`.
- Response: `{ "ok": true, "tenant_id": "...", "amount": <number>, "balance_after": <number> }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/billing.ts:97`.

### 3.10 POST /plans/snapshot
- Request: `tenant_id`, `plan_snapshot`.
- Response: `{ "ok": true, "tenant_id": "...", "effective_from": "..." }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/billing.ts:145`.

### 3.11 POST /plans/overrides
- Request: `tenant_id`, `field_name`, `override_value`, `effective_from?`, `effective_to?`.
- Response: `{ "ok": true, "tenant_id": "...", "override_id": "..." }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/billing.ts:192`.

### 3.12 Compliance holds
- `POST /compliance/holds` create
- `GET /compliance/holds` list (requires `tenant_id` query)
- `DELETE /compliance/holds` delete
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/compliance.ts:29`.

### 3.13 GET /control-plane-events
- Query: `env`, `from`, `to`, `limit`
- Response: `{ "events": [ ... ] }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:358`.

---

## 4. Data-Plane Endpoints (API Key)

### 4.1 POST /jobs
- Request:
  ```json
  {
    "jobId": "optional",
    "userId": "optional",
    "inputs": { "images": ["s3://..."], "audio": ["s3://..."], "video": ["s3://..."] },
    "subject_id": "optional",
    "data_class": "optional",
    "expires_at": 1700000000
  }
  ```
- Response: `{ "jobId": "...", "status": "SUBMITTED", "plan": [ ... ] }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:66`.

### 4.2 GET /jobs/{jobId}
- Response: `{ jobId, status, created_at, updated_at, inputs, results?, report? }`
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:231`.

### 4.3 POST /uploads/presign
- Request:
  ```json
  { "filename": "file.ext", "jobId": "...", "subjectId": "...", "dataClass": "PII" }
  ```
- Response:
  ```json
  { "uploadUrl": "https://...", "s3Key": "s3://...", "requiredHeaders": { "x-amz-server-side-encryption": "AES256" }, "expires_at": 1700000000 }
  ```
- Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:242`.

---

## 5. Common Error Patterns

### 5.1 Auth errors (API key)
- `missing_authorization`, `invalid_authorization_scheme`, `invalid_token_format`, `key_not_found`, `invalid_environment`, `key_revoked`, `key_inactive`, `key_expired`, `bad_secret`. Source: `kyc-infra-main/cdktf/src/backend/auth/authorizer.ts:74`.

### 5.2 Admission errors
- `403_TENANT_SUSPENDED`, `403_TENANT_REJECTED`, `403_ENV_ACCESS_DENIED`, `403_ACCOUNT_NOT_READY`, `403_ACCOUNT_LOCKED`, `402_INSUFFICIENT_BALANCE`, `402_HARD_NEGATIVE_LIMIT`, `429_DAILY_CAP_REACHED`. Source: `kyc-infra-main/cdktf/src/backend/admission/index.ts:60`.

### 5.3 Webhook delivery errors
- Signature and URL validation errors are returned in delivery logs; targets must be https, public IP, no redirects. Source: `kyc-infra-main/cdktf/src/backend/webhooks/delivery-worker.ts:101`.

---

## 6. Idempotency and Retries
- Control-plane events: `x-idempotency-key` is used to generate control-plane idempotency key. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:26`.
- Webhook delivery retries with exponential backoff; permanent failures after max retries. Source: `kyc-infra-main/cdktf/src/backend/webhooks/delivery-worker.ts:470`.
- Data-plane: job creation uses Step Functions; no explicit idempotency on `/jobs` beyond client-specified `jobId`.

---

## 7. Webhook Signature Verification

Outgoing webhook headers:
- `x-kyc-timestamp`: epoch seconds as string.
- `x-kyc-signature`: `v1=<hex-hmac>`.
Source: `kyc-infra-main/cdktf/src/backend/webhooks/delivery-worker.ts:366`.

Signature algorithm:
- Build payload JSON using stable key ordering (`stableStringify`). Source: `kyc-infra-main/cdktf/src/backend/shared/json.ts:5`.
- String to sign: `${timestamp}.${payloadJson}`. Source: `kyc-infra-main/cdktf/src/backend/webhooks/delivery-worker.ts:366`.
- HMAC SHA256 with endpoint secret. Source: `kyc-infra-main/cdktf/src/backend/shared/crypto.ts:35`.

Verification steps:
1) Read raw request body as bytes.
2) Recompute `payloadJson` using stable key ordering.
3) Build `${timestamp}.${payloadJson}`.
4) Compute HMAC SHA256 (hex) and compare to signature value after `v1=`.

TODO/UNKNOWN: Client guidance for replay protection (nonce/time skew) is not specified; recommend rejecting timestamps older than 5 minutes.
