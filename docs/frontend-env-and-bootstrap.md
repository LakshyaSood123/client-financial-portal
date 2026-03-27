# Frontend Env and Bootstrap

Status: evidence-based where possible. Any missing implementation details are marked PROPOSED or DECISION NEEDED.

## 1) Evidence: Known outputs and where they are defined

### 1.1 API and UI endpoints
- `api_endpoint` (CloudFront front door for API): `edge.cloudfrontUrl`. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:291` and `kyc-infra-main/cdktf/src/constructs/edge/index.ts:185`.
- `api_origin` (direct API Gateway endpoint): `api.endpoint`. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:292`.
- `ui_url` (CloudFront UI distribution for portal UI): `edge.uiUrl`. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:297` and `kyc-infra-main/cdktf/src/constructs/edge/index.ts:229`.

### 1.2 Cognito IDs
- Cognito User Pool ID output: `cognito_user_pool_id`. Source: `kyc-infra-main/cdktf/src/constructs/auth/index.ts:83`.
- Cognito App Client ID output: `cognito_client_id`. Source: `kyc-infra-main/cdktf/src/constructs/auth/index.ts:87`.

### 1.3 Origin verification secret (for direct API access)
- Secret stored in SSM: `/${prefix}/origin-verify-secret`. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:46`.
- CloudFront injects `x-origin-verify` on API origin requests. Source: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:174`.

## 2) How FE gets values (current state)

### 2.1 Terraform/CDKTF outputs
These values are defined as `TerraformOutput` in `dev.ts`. A deployment pipeline or a local CDKTF apply must surface them to FE build/runtime configuration.

- `api_endpoint`
- `api_origin`
- `ui_url`
- `cognito_user_pool_id`
- `cognito_client_id`

Decision: Use a build-time config file (JSON) generated from CDKTF outputs (recommended default). See ADRs:
- `docs/adr/0001-frontend-framework.md`
- `docs/adr/0002-auth-flow-cognito-pkce.md`

## 3) Local development bootstrap (PROPOSED)

Because outputs are not committed in repo, devs need a standard local bootstrap flow.

PROPOSED flow:
1) Apply or access an existing stack (dev/staging/prod) that emits outputs above.
2) Export outputs into a local `config.json` used by the FE build.
3) Set `API_BASE_URL` to `api_endpoint` (CloudFront URL) for normal usage.
4) Route API calls through the local dev proxy so `x-origin-verify` is injected server-side.

## 4) Direct API access and x-origin-verify (development)

Evidence:
- API Gateway requires `x-origin-verify` header to match SSM secret. Source: `kyc-infra-main/cdktf/src/backend/auth/authorizer.ts:213`.
- Secret is stored in SSM and not exposed to FE by default. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:46`.

Decision: Use a local dev proxy to read the SSM secret and inject `x-origin-verify` server-side. See `docs/dev-proxy-spec.md` and ADR `docs/adr/0003-origin-verify-header-handling.md`.

### 4.1 Local dev proxy setup (PROPOSED)
- Run proxy on `http://localhost:8787` (default).
- FE points `API_BASE_URL` to `http://localhost:8787`.
- Proxy reads SSM SecureString on startup and injects `x-origin-verify` into upstream requests.
- Proxy never logs secrets.

Env vars (suggested):
- `DEV_PROXY_PORT=8787`
- `API_BASE_URL=<api_endpoint>`
- `AWS_REGION=<region>`
- `SSM_ORIGIN_VERIFY_PARAM=/<prefix>/origin-verify-secret`

## 5) Environment variable schema (PROPOSED)

Suggested FE runtime config (names are illustrative):
- `API_BASE_URL` (use `api_endpoint`)
- `API_ORIGIN_URL` (optional, `api_origin` for debug only)
- `COGNITO_USER_POOL_ID`
- `COGNITO_CLIENT_ID`
- `PORTAL_UI_URL` (use `ui_url`)

Decision required: finalize variable names and config load strategy.
