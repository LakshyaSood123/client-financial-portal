# Frontend RBAC Matrix

Status: evidence-based. Gaps clearly marked.

## Table of Contents
1. Roles and Scopes
2. Screens to Roles Matrix
3. Actions to Endpoints Matrix
4. FE Route Guards and Non-Goals

---

## 1. Roles and Scopes

| Role/Scope | Evidence | Notes |
| --- | --- | --- |
| Portal user (`portal:admin`) | `kyc-infra-main/cdktf/src/backend/controller/index.ts:69` | Assigned to portal context, no other portal roles found. |
| Admin (`admin:write`) | `kyc-infra-main/cdktf/src/backend/controller/context.ts:94` | Required for control-plane routes + `x-admin-token`. |
| API key scopes (`kyc:verify`, `kyc:read`) | `kyc-infra-main/cdktf/src/backend/controller/routes/apikeys.ts:67` | No enforcement in controller routes (gap). |

TODO/UNKNOWN: Additional roles (reviewer/compliance) are not defined in code.

---

## 2. Screens to Roles Matrix

| Screen | Portal user | Admin | API key user |
| --- | --- | --- | --- |
| Login | Yes | Yes (if admin UI uses Cognito) | No |
| Portal Home / Status | Yes | No | No |
| Onboarding | Yes | No | No |
| KYB Upload | Yes | No | No |
| Portal Stats | Yes | No | No |
| Billing Balance/Ledger (Portal) | Yes | No | No |
| API Keys (Portal) | Yes | No | No |
| Audit Logs | Yes | No | No |
| Webhooks (Portal) | Yes | No | No |
| Admin Tenant Mgmt | No | Yes | No |
| Admin KYB Review | No | Yes | No |
| Admin Risk | No | Yes | No |
| Admin Compliance Holds | No | Yes | No |
| Admin Billing Topup | No | Yes | No |
| Admin Plans | No | Yes | No |
| Admin Control-Plane Events | No | Yes | No |
| API Client Jobs (optional UI) | No | No | Yes |

Evidence for admin routes: `kyc-infra-main/cdktf/src/constructs/api/index.ts:405`.
Evidence for portal routes: `kyc-infra-main/cdktf/src/constructs/api/index.ts:381`.

---

## 3. Actions to Endpoints Matrix

| Action | Role/Scope | Endpoint | Evidence |
| --- | --- | --- | --- |
| View tenant profile | Portal user | `GET /portal/me` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:117` |
| Complete onboarding | Portal user | `POST /portal/onboarding` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:93` |
| Upload KYB docs | Portal user | `POST /portal/onboarding/upload-url` | `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:101` |
| View stats | Portal user | `GET /portal/stats` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:127` |
| View billing | Portal user | `GET /portal/billing/balance`, `GET /portal/billing/ledger` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:131` |
| Manage API keys (self) | Portal user | `GET/POST/DELETE /portal/apikeys` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:122` |
| View audit logs | Portal user | `GET /portal/audit-logs` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:128` |
| Manage webhooks | Portal user | `/portal/webhooks/*` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:135` |
| Create tenant | Admin | `POST /tenants` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:227` |
| Issue API key | Admin | `POST /apikeys` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:228` |
| KYB start/complete | Admin | `POST /kyb/start`, `POST /kyb/complete` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:234` |
| Risk recompute/override | Admin | `POST /risk/recompute`, `POST /risk/override` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:236` |
| Compliance hold | Admin | `POST/GET/DELETE /compliance/holds` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:240` |
| Billing topup | Admin | `POST /billing/topup` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:210` |
| Plan management | Admin | `POST /plans/snapshot`, `POST /plans/overrides` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:211` |
| Control-plane events | Admin | `GET /control-plane-events` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:246` |
| Create job (data-plane) | API key user | `POST /jobs` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:203` |
| Get job | API key user | `GET /jobs/{jobId}` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:204` |
| Presign upload | API key user | `POST /uploads/presign` | `kyc-infra-main/cdktf/src/backend/controller/index.ts:205` |

---

## 4. FE Route Guards and Non-Goals

### 4.1 FE route guards
- Portal routes must enforce Cognito auth; block if `ops_status` is BLOCKED/SUSPENDED, except allow `/portal/me`. Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:102`.
- Admin routes must never embed admin token in the browser; admin console should be server-side or use secure proxy.

### 4.2 Must NOT be done in FE
- Do not expose `x-admin-token` or `x-origin-verify` secrets in client builds. Source: `kyc-infra-main/cdktf/src/backend/controller/context.ts:17` and `kyc-infra-main/cdktf/src/stacks/dev.ts:46`.
- Do not bypass portal authorizer by calling API Gateway without CloudFront unless you can supply the secret header.
