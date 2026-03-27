# Frontend Build Backlog

Each entry includes title, description, owner, dependencies, acceptance criteria, related files/endpoints, and security/compliance notes.

## 1) Establish Frontend Repo and CI
- Owner: FE
- Description: Create portal/admin UI codebase and deployment pipeline targeting S3 UI bucket + CloudFront.
- Dependencies: UI bucket and CloudFront `ui_url` output. Source: `kyc-infra-main/cdktf/src/constructs/storage/index.ts:102` and `kyc-infra-main/cdktf/src/stacks/dev.ts:297`.
- Acceptance criteria: Build artifacts deployed to `${prefix}-portal-ui`; SPA routes resolve via CloudFront.
- Related files: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:208`.
- Security notes: Ensure CSP and secure headers at CloudFront/S3.

## 2) Decide Cognito Login UX (Hosted UI vs Custom)
- Owner: FE
- Description: Choose login UX; Hosted UI not configured in infra.
- Dependencies: Cognito configuration. Source: `kyc-infra-main/cdktf/src/constructs/auth/index.ts:50`.
- Acceptance criteria: Auth flow documented and implemented; ID token used for API.
- Related files: `kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:12`.
- Security notes: Do not store admin tokens in FE.

## 3) Implement Token Storage and Refresh
- Owner: FE
- Description: Implement refresh token handling and ID token renewal.
- Dependencies: Cognito `ALLOW_REFRESH_TOKEN_AUTH`. Source: `kyc-infra-main/cdktf/src/constructs/auth/index.ts:57`.
- Acceptance criteria: Tokens renewed without user disruption; ID token used in API calls.
- Related files: `docs/frontend-api-contract.md`.
- Security notes: Avoid localStorage for refresh tokens if possible.

## 4) Origin-Verify Dev Workflow
- Owner: Backend
- Description: Provide a secure method for developers to obtain `x-origin-verify` secret for local API testing.
- Dependencies: SSM parameter `/${prefix}/origin-verify-secret`. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:46`.
- Acceptance criteria: Documented dev flow; secret not shipped to FE builds.
- Related files: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:174`.
- Security notes: Protect secret, rotate as needed.

## 5) Portal Screens Implementation
- Owner: FE
- Description: Implement portal screens: onboarding, KYB upload, stats, billing, API keys, audit logs, webhooks.
- Dependencies: Portal endpoints. Source: `kyc-infra-main/cdktf/src/constructs/api/index.ts:381`.
- Acceptance criteria: All portal endpoints integrated; blocked/suspended UX handled.
- Related files: `docs/frontend-api-contract.md`.
- Security notes: Mask secrets; avoid logging PII.

## 6) Admin Console Access Model
- Owner: Backend
- Description: Provide secure admin access mechanism (server-side console or internal proxy) to avoid exposing `x-admin-token` in FE.
- Dependencies: Admin token requirement. Source: `kyc-infra-main/cdktf/src/backend/controller/context.ts:94`.
- Acceptance criteria: Admin UI does not embed token; admin API calls proxied securely.
- Related files: `docs/frontend-rbac-matrix.md`.
- Security notes: Enforce IP allowlist and MFA for admins.

## 7) Portal Job List and Funnel Metrics (API)
- Owner: Backend
- Description: Add endpoints to support dashboards (job list, funnel stats, SLA metrics).
- Dependencies: Jobs table status updates. Source: `kyc-infra-main/cdktf/src/constructs/orchestrator/index.ts:145`.
- Acceptance criteria: New endpoints documented with OpenAPI-like contract; FE can render funnel/SLA.
- Related files: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts`.
- Security notes: Ensure tenant scoping and RBAC checks.

## 8) Webhook Signature Verification Guidance UI
- Owner: FE
- Description: Add UI guidance for customers on verifying webhook signatures.
- Dependencies: Webhook signature algorithm. Source: `kyc-infra-main/cdktf/src/backend/webhooks/delivery-worker.ts:366`.
- Acceptance criteria: Instructions match actual signing behavior.
- Related files: `docs/frontend-sequence-diagrams.md`.
- Security notes: Do not reveal signing secrets.
