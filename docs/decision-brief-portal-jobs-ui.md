# Decision Brief: Client Portal Jobs UI

Status: PENDING decision. Evidence-based where possible; missing endpoints are PROPOSED.

## Option A: Portal Jobs UI (jobs visible in portal)

### Scope: screens and routes
- Job List (PROPOSED route: `/portal/jobs`)
- Job Detail (PROPOSED route: `/portal/jobs/:jobId`)
- Optional Resubmit/Reupload (PROPOSED)
- Optional Webhook Deliveries view (existing portal endpoints)

### Roles and access
- Portal users (tenant OWNER) only. Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:50`.
- Must enforce tenant isolation (BOLA prevention).

### Required endpoints
- Existing data-plane endpoints (API key auth):
  - `GET /jobs/{jobId}` (data-plane). Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:204` and `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:145`.
- Missing portal endpoints (PROPOSED):
  - `GET /portal/jobs` (list)
  - `GET /portal/jobs/{jobId}` (detail, portal auth)
  - Optional `POST /portal/jobs/{jobId}/reupload` if resubmit supported

### Required authz checks
- Enforce tenant match on job records (BOLA prevention). Evidence exists in `GET /jobs/{jobId}`: `if (metadata.tenantId !== ctx.tenantId) return 403`. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:171`.
- Portal routes must use Cognito authorizer and tenant resolution (portal context).

### Audit/logging
- Control-plane events should log portal job views if required (PROPOSED).
- Ensure job access logs include tenant_id and request_id.

### PII masking
- Mask subject_id and artifact URIs in UI unless explicit permission granted.
- Do not expose raw artifact content in UI.

### Pagination and exports
- List endpoint must include pagination cursor and filter params (PROPOSED).
- Export: CSV (PROPOSED) with redacted fields.

## Option B: API-only portal (no jobs UI)

### Scope: minimal portal
- Usage stats, webhooks, billing, API keys, audit logs.
- No job list/detail in portal.

### Endpoints used
- `GET /portal/stats`
- `GET /portal/webhooks/*`
- `GET /portal/billing/*`
- `GET /portal/apikeys`
- `GET /portal/audit-logs`

## Delta table (backend requirements)
| Capability | Option A (Portal Jobs UI) | Option B (API-only) |
| --- | --- | --- |
| Job list endpoint | PROPOSED `GET /portal/jobs` | Not required |
| Portal job detail | PROPOSED `GET /portal/jobs/{jobId}` | Not required |
| Job results schema for portal | PROPOSED | Not required |
| Portal authz for jobs | Required | Not required |
| Dashboard metrics for jobs | Likely required | Optional |

## Recommendation criteria checklist
- Do customers need self-serve job visibility? 
- Expected support load without UI? 
- Compliance/audit expectations for decision review? 
- Security posture: can portal safely show job artifacts and results?

## Security requirements (must apply if Option A)
- Object-level authorization (BOLA prevention): tenant_id match.
- Least-privilege scopes for job data access.
- No raw PII or biometric artifacts shown by default.
