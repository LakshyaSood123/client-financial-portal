# Dev Proxy Spec

Status: specification only (no code implementation).

## 1) Purpose
Provide a local reverse proxy that:
- Reads `x-origin-verify` from SSM SecureString.
- Injects the header into API calls.
- Prevents the browser from seeing the secret.

## 2) Requirements
- Must read SSM SecureString `/${prefix}/origin-verify-secret`. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:46`.
- Must inject `x-origin-verify` into upstream API requests. Source: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:174`.
- Must support per-environment API base URLs (`api_endpoint` or `api_origin`). Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:291`.
- Must not log secret values.
- Must run locally and expose a single port for the FE to call.

## 3) Suggested interface (PROPOSED)
- Env vars:
  - `DEV_PROXY_PORT` (default 8787)
  - `API_BASE_URL` (default: `api_endpoint`)
  - `AWS_REGION`
  - `SSM_ORIGIN_VERIFY_PARAM` (default: `/${prefix}/origin-verify-secret`)
- Routes:
  - Proxy all `/` requests to `API_BASE_URL`.

## 4) Behavior
- On startup, read SSM SecureString via AWS SDK.
- Cache secret in memory; refresh on interval (e.g., every 10 minutes).
- For each request:
  - Copy incoming headers.
  - Add `x-origin-verify` header.
  - Forward request to `API_BASE_URL`.
- Redact or omit headers in logs; never log the secret.

## 5) Threat notes
- The browser must never read the secret.
- Local proxy should be developer-only and not exposed publicly.
- Keep AWS credentials scoped to read-only access for the SSM parameter.
