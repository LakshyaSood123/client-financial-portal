# ADR 0004: Admin BFF and x-admin-token Handling

## Context
- Admin routes require `x-admin-token` and scope `admin:write`. Source: `kyc-infra-main/cdktf/src/backend/controller/context.ts:63` and `kyc-infra-main/cdktf/src/backend/controller/context.ts:96`.
- Browser apps must not embed long-lived secrets.

## Decision
- Use an **Admin BFF** that authenticates admins and injects `x-admin-token` server-side.
- Admin UI talks only to the BFF.

## Alternatives
- Direct browser calls to API with `x-admin-token` (rejected).
- Internal VPN-only admin console with static token (risky, limited auditability).

## Consequences
- Requires a BFF service and deployment.
- Centralizes audit logging and authorization enforcement.

## Follow-ups
- Implement Admin BFF authentication (SSO/IdP).
- Add audit logging for admin actions in BFF.
