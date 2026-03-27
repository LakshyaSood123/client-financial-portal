# TODO Resolution Report

Status definitions:
- RESOLVED: Evidence found and documented.
- PROPOSED: Missing in repo; proposed implementation included.
- DECISION NEEDED: Requires a choice or policy before implementation.

| # | TODO | Status | Evidence / Notes | Next steps |
| --- | --- | --- | --- | --- |
| 1 | FE framework/routing not specified | RESOLVED (decision) | ADR default: Vite SPA with Next.js alternative. See `docs/adr/0001-frontend-framework.md`. | Create FE repo and build pipeline. |
| 2 | Secure dev workflow for x-origin-verify | RESOLVED (decision) | ADR: local dev proxy injects header. See `docs/adr/0003-origin-verify-header-handling.md` and `docs/dev-proxy-spec.md`. | Implement dev proxy and document usage. |
| 3 | Enforce data-plane scope checks | PROPOSED | `requireScope` exists but only admin uses it. Source: `kyc-infra-main/cdktf/src/backend/controller/context.ts:81`. | Add per-route scope checks for `/jobs` and `/jobs/{jobId}`. |
| 4 | Cookie vs header token strategy / CSRF | RESOLVED (decision) | ADR: Hosted UI + PKCE with header tokens. See `docs/adr/0002-auth-flow-cognito-pkce.md`. | Revisit only if moving to cookie sessions. |
| 5 | Hosted UI not configured | RESOLVED (decision) | ADR: Hosted UI + PKCE. See `docs/adr/0002-auth-flow-cognito-pkce.md`. | Add Cognito UserPoolDomain. |
| 6 | Admin console access model | RESOLVED (decision) | ADR: Admin BFF injects `x-admin-token`. See `docs/adr/0004-admin-bff-and-x-admin-token.md`. | Implement BFF service. |
| 7 | Portal exposes data-plane UI | DECISION NEEDED | See `docs/decision-brief-portal-jobs-ui.md` and `docs/portal-jobs-ui-spec.md`. | Owner: Product. Decide Option A vs B. |
| 8 | Analytics endpoints for jobs/funnel/SLA | PROPOSED | No metrics endpoints beyond `/portal/stats`. | Add admin/portal metrics endpoints. |
| 9 | Third portal (partner/auditor/support) | DECISION NEEDED | See `docs/decision-brief-third-portal.md`. | Owner: Product/Ops. Decide if separate portal needed. |
| 10 | Admin metrics endpoints for Ops Overview | PROPOSED | No admin metrics endpoints found. | Add `GET /admin/metrics/ops`. |
| 11 | Tenant/risk listing endpoints | PROPOSED | Only actions exist (`/risk/*`, `/kyb/*`), no list endpoints. | Add admin tenant list and risk history endpoints. |
| 12 | Export/filters for dashboards | PROPOSED | No export endpoints or query params in routes. | Add `?start/end`, `status`, and CSV export endpoints. |
| 13 | IAM provider and admin user management | RESOLVED (decision) | ADR: Cognito groups -> roles/scopes. See `docs/adr/0005-iam-groups-and-roles.md`. | Implement group-to-scope mapping and admin user management tooling. |
| 14 | Document API base URL and Cognito IDs | RESOLVED | Terraform outputs in dev stack and auth construct. Sources: `kyc-infra-main/cdktf/src/stacks/dev.ts:291` and `kyc-infra-main/cdktf/src/constructs/auth/index.ts:83`. | Ensure outputs are surfaced to FE build process. |
