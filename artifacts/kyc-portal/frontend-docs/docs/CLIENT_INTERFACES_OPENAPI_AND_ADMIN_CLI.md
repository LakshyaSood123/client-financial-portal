# Client interfaces (repo-local)

This repo intentionally keeps “client interface” artifacts lightweight and vendor-neutral:

- OpenAPI spec: `docs/openapi/public-api.yaml`
- Admin CLI: `tools/admin_cli/` (Node.js; no external deps)

## Auth + edge notes (important)

- Public/admin HTTP API auth is: `Authorization: Bearer <api_key_id>.<secret>`
  - Parsing contract: split on the **first** dot; secrets may contain dots.
- Environment is **server-authoritative** from the API key record. Do not send `env` headers/query params.
- CloudFront injects `x-origin-verify` and the authorizer verifies it.
  - If you call the API Gateway invoke URL directly (not via CloudFront), you must supply the correct `x-origin-verify`.
- Admin/control-plane routes require both:
  - scope `admin:write`
  - header `x-admin-token` matching controller `ADMIN_TOKEN`

## OpenAPI usage

- Open `docs/openapi/public-api.yaml` in Swagger UI / Postman / your editor.
- Treat the spec as “evidence-based”: it aims to describe the endpoints as implemented in `cdktf/src/backend/controller/index.ts`.

## Admin CLI usage

From `tools/admin_cli/`:

- Set:
  - `KYC_API_BASE_URL` (CloudFront URL recommended)
  - `KYC_BEARER` (admin API key bearer)
  - `KYC_ADMIN_TOKEN`
  - (optional) `KYC_ORIGIN_VERIFY` if bypassing CloudFront
- Run: `node kyc-admin.mjs --help`

