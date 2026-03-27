# Frontend Auth and Session Decisions

Status: evidence-based for current backend expectations; decisions required for FE session strategy.

## 1) Evidence: What backend expects today

### 1.1 Portal (Cognito) auth
- Portal authorizer requires `Authorization: Bearer <ID token>`. Source: `kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:24`.
- Token use is `id` (ID token). Source: `kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:12`.
- Authorizer context includes `email`. Source: `kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:40`.

### 1.2 API key auth (data plane)
- Authorization format: `Bearer <api_key_id>.<secret>`. Source: `kyc-infra-main/cdktf/src/backend/auth/authorizer.ts:119`.
- Scope list passed through authorizer context (`scopes_json`). Source: `kyc-infra-main/cdktf/src/backend/auth/authorizer.ts:206`.

### 1.3 Admin auth (control plane)
- Admin routes require header `x-admin-token` and scope `admin:write`. Source: `kyc-infra-main/cdktf/src/backend/controller/context.ts:63` and `kyc-infra-main/cdktf/src/backend/controller/context.ts:96`.
- CloudFront forwards `x-admin-token` header. Source: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:57`.

### 1.4 Origin verification
- `x-origin-verify` header is injected by CloudFront for API requests. Source: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:174`.
- Portal authorizer also requires the origin header. Source: `kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:21`.

### 1.5 Cookies and CSRF (evidence)
- CloudFront cache policy forwards **no cookies** for API origin. Source: `kyc-infra-main/cdktf/src/constructs/edge/index.ts:34`.
- No `Set-Cookie` handling or CSRF logic found in backend. Where searched: `rg -n "Set-Cookie|csrf|SameSite|cookie" kyc-infra-main/cdktf/src`.

## 2) Decision: FE session storage strategy

Decision: Use Hosted UI Authorization Code + PKCE with header-based tokens (no cookies). See `docs/adr/0002-auth-flow-cognito-pkce.md`.

### Option A (recommended with current backend): Header-based tokens only
- Store Cognito ID token in memory or browser storage.
- Send `Authorization: Bearer <id_token>` for portal routes.
- For data-plane client UI (if any), send `Authorization: Bearer <api_key_id>.<secret>`.
- No CSRF required (no cookies). 

### Option B (PROPOSED): Cookie-based session
Requires backend changes and CSRF protection.
- Backend must issue `Set-Cookie` with HttpOnly, Secure, and SameSite.
- FE must include CSRF token (double-submit or synchronized token).
- Update CloudFront cache policy to forward cookies.

## 3) Security requirements
- Do not rely solely on FE for authorization; backend must enforce route and scope checks.
- Never expose `ADMIN_TOKEN` or API keys in browser if the admin console is public.

## 4) Required headers summary
- Portal: `Authorization: Bearer <Cognito ID token>` + `x-origin-verify` (injected by CloudFront).
- Data-plane: `Authorization: Bearer <api_key_id>.<secret>` + `x-origin-verify`.
- Admin: `x-admin-token` + `admin:write` scope (server-side only; do not expose in browser).
