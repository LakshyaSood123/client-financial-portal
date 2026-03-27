# ADR 0001: Frontend Framework

## Context
- No frontend repo exists in workspace; infra hosts a static SPA via CloudFront/S3 with SPA routing. Source: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:196`.
- Frontend needs to implement portal and admin console UIs.

## Decision
- Provide two supported options: **Next.js** (SSR/SSG) and **Vite SPA**.
- **Recommended default: Vite SPA** to align with existing SPA routing and S3/CloudFront static hosting model.

## Alternatives
- Next.js (SSR) with a separate hosting layer (requires server runtime).
- Other SPA frameworks (Angular/Vue) not evaluated here.

## Consequences
- Vite SPA keeps deployment aligned with existing CloudFront/S3 UI distribution.
- Next.js introduces a backend runtime requirement (not currently provisioned in infra).

## Follow-ups
- Confirm if SSR is a requirement; if yes, add server hosting plan.
- Define FE repo structure and build pipeline.
