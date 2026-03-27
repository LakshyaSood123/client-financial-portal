# ADR 0002: Cognito Hosted UI with Authorization Code + PKCE

## Context
- Cognito User Pool and App Client exist with OAuth code flow enabled. Source: `kyc-infra-main/cdktf/src/constructs/auth/index.ts:52`.
- Hosted UI domain is not configured in infra. Source: search for `UserPoolDomain` returned none.

## Decision
- Use **Cognito Hosted UI with Authorization Code + PKCE** for portal authentication.
- Add Cognito User Pool Domain configuration as part of infra changes.

## Alternatives
- Custom auth UI with direct Cognito Auth APIs.
- API key-only access for all flows (not suitable for portal users).

## Consequences
- Requires configuration of Cognito domain and callback/logout URLs.
- Frontend uses standard OAuth code + PKCE flow to obtain ID token.

## Follow-ups
- Add Cognito UserPoolDomain resource in infra.
- Verify callback and logout URLs per environment.
- Document token storage strategy (header-based, no cookies).
