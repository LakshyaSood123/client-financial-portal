# ADR 0005: IAM Groups and Roles (Cognito Groups)

## Context
- Portal uses Cognito for authentication. Source: `kyc-infra-main/cdktf/src/constructs/auth/index.ts:2`.
- No admin IAM endpoints exist in repo.

## Decision
- Use **Cognito groups** to map users to roles/scopes for both portal and admin access.
- FE enforces UI visibility based on group/role claims; backend remains authoritative.

## Alternatives
- Custom IAM service.
- External IdP without Cognito groups (requires more integration work).

## Consequences
- Requires Cognito group setup and mapping rules.
- Backend must map groups to scopes and enforce authorization server-side.

## Follow-ups
- Implement group-to-scope mapping in authorizer or middleware.
- Add admin user management tooling or scripts.
