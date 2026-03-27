# Working Notes

## Key Findings / Gaps (from prior message)
- [ ] Key finding: Portal auth uses Cognito ID tokens plus origin verify header `x-origin-verify` (`kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:21`).
- [ ] Key finding: API key auth requires `Bearer api_key_id.secret` with rotation support (`kyc-infra-main/cdktf/src/backend/auth/authorizer.ts:119`).
- [ ] Key finding: Admin actions require `admin:write` scope plus `x-admin-token` header (`kyc-infra-main/cdktf/src/backend/controller/context.ts:94`).
- [ ] Key finding: Portal access blocked when ops_status is BLOCKED/SUSPENDED except `/portal/me` (`kyc-infra-main/cdktf/src/backend/controller/index.ts:102`).
- [ ] Key finding: KYB status drives risk tier (LOW/MEDIUM/HIGH) with recompute/override endpoints (`kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:290`).
- [ ] Key finding: Presigned uploads enforce SSE AES256 and data_class PII rules (`kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:249`).
- [ ] Key finding: Webhook target URLs are SSRF-validated (public HTTPS only) (`kyc-infra-main/cdktf/src/backend/shared/ssrf.ts:82`).
- [ ] Key finding: Webhook secrets are KMS-encrypted (`kyc-infra-main/cdktf/src/backend/controller/routes/webhooks.ts:33`).
- [ ] Key finding: Control-plane and admin audit logs are persisted with idempotency keys (`kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:45`).
- [ ] Key finding: Retention worker deletes artifacts and scrubs subjects unless legal holds exist (`kyc-infra-main/cdktf/src/backend/retention/job.ts:181`).
- [ ] Key finding: Portal stats endpoint provides last-30-days usage history (`kyc-infra-main/cdktf/src/backend/controller/routes/stats.ts:9`).
- [ ] Key finding: CORS allowlist set in API and CloudFront (`kyc-infra-main/cdktf/src/constructs/api/index.ts:299`).
- [ ] Key finding: WAF managed rules and rate limiting applied at CloudFront (`kyc-infra-main/cdktf/src/constructs/edge/index.ts:141`).
- [ ] Key finding: Agent `/process` body size capped at 256KB (`kyc-agents-main/common/http.py:39`).
- [ ] Key finding: No frontend code in workspace; UI must be built against API/infra evidence.

- [ ] TODO/Gap: No frontend repo found; confirm if UI exists elsewhere and align routes/assets.
- [ ] TODO/Gap: Login UX (Hosted UI vs custom) not specified; confirm Cognito auth flow ownership.
- [ ] TODO/Gap: No explicit session/refresh handling in FE; define token storage and refresh policy.
- [ ] TODO/Gap: No explicit per-route scope checks beyond admin; confirm intended RBAC granularity.
- [ ] TODO/Gap: No KYC funnel or SLA endpoints; define reporting data sources or add API.
- [ ] TODO/Gap: No manual review/case management endpoints; define case entity and workflow.
- [ ] TODO/Gap: Sanctions/PEP/adverse media screening not present; confirm integrations.
- [ ] TODO/Gap: No SAR/STR reporting or compliance exports; define required reports.
- [ ] TODO/Gap: No incident response hooks; define alerting/breach workflows.
- [ ] TODO/Gap: Data residency policy not defined; confirm region constraints.
- [ ] TODO/Gap: UI environment variables (API base URL, Cognito IDs) not exposed in repo outputs.
- [ ] TODO/Gap: Confirm whether `x-origin-verify` is required for local dev and how FE gets it.
- [ ] TODO/Gap: Confirm whether portal should show job creation screens (data-plane) or only admin views.
- [ ] TODO/Gap: Confirm KYB document review process and reviewer roles (none in code).
- [ ] TODO/Gap: Define retention matrix, define legal hold policy, define sanctions screening SOP, define case management flow.
- [ ] TODO/Gap: Define data_class taxonomy beyond PII/BIOMETRIC/KYC_PII.
- [ ] TODO/Gap: Define webhook signing verification instructions for customers (not in repo).
- [ ] TODO/Gap: Define API error handling contract for FE (no OpenAPI spec found).
- [ ] TODO/Gap: Define UI access model for admin token handling (avoid FE embedding secret).
- [ ] TODO/Gap: Confirm if API client console is required vs API-only integration.
