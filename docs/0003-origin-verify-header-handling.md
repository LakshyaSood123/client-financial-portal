# ADR 0003: Origin-Verify Header Handling

## Context
- API authorizers require `x-origin-verify` matching SSM secret. Source: `kyc-infra-main/cdktf/src/backend/auth/authorizer.ts:213`.
- CloudFront injects the header for production edge requests. Source: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:174`.

## Decision
- Do not expose `x-origin-verify` in the browser.
- Use a local dev proxy and production edge/BFF to inject `x-origin-verify` server-side.

## Alternatives
- Fetch SSM secret in browser (rejected; exposes secret).
- Disable origin verification in dev (weakens security model).

## Consequences
- Requires a local proxy and production BFF/gateway layer.
- FE only sends standard auth headers; proxy adds `x-origin-verify`.

## Follow-ups
- Implement dev proxy per `docs/dev-proxy-spec.md`.
- Update local dev workflow to route API calls through proxy.
