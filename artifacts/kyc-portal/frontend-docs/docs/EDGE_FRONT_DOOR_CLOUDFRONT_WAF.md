# Edge Front Door (CloudFront + WAF) — Notes

## Why this exists
- AWS WAF cannot attach directly to API Gateway **HTTP API**. This stack places **CloudFront** in front of the HTTP API and attaches **WAFv2 (scope=CLOUDFRONT)** to CloudFront.
- To prevent bypassing WAF by calling the API Gateway invoke URL directly, the API Gateway **Lambda REQUEST authorizer** enforces an origin verification header.

## How it works (dev stack)
- CloudFront origin = HTTP API endpoint (`cdktf/src/stacks/dev.ts`).
- CloudFront sends a fixed custom origin header: `x-origin-verify: <secret>`.
- The authorizer requires `x-origin-verify` to match `ORIGIN_VERIFY_SECRET` **before** doing any Argon2 verification (`cdktf/src/backend/auth/authorizer.ts`).
- The secret is stored in SSM Parameter Store as a SecureString; stack outputs the parameter name.

## Outputs / retrieval
- Primary endpoint: stack output `cloudfront_url`.
- Debug endpoint: stack output `api_url` (direct HTTP API invoke URL; should be blocked without the secret).
- Secret parameter name: stack output `origin_verify_secret_ssm_param`.

Retrieve the secret:
```bash
aws ssm get-parameter --with-decryption --name <origin_verify_secret_ssm_param>
```

## Secret rotation
Rotation requires updating the SSM parameter and redeploying so both CloudFront and the authorizer pick up the new value.

1) Generate a new secret value
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

2) Update SSM (replace name/value)
```bash
aws ssm put-parameter --overwrite --type SecureString --name <origin_verify_secret_ssm_param> --value <NEW_SECRET>
```

3) Redeploy stack so CloudFront origin header + authorizer env update
```bash
cd kyc-infra-main/cdktf
cmd /c yarn.cmd deploy:dev
```

## Bypass expectations
- CloudFront calls succeed (it injects `x-origin-verify` automatically).
- Direct API Gateway calls fail with 401 unless you add the correct `x-origin-verify` header.

## WAF notes
- Managed rule groups are attached in **COUNT** mode by default; set `WAF_MANAGED_RULES_BLOCK_MODE=1` to let managed rule groups use their native actions (typically BLOCK).
- The rate-based rule is COUNT by default; set `WAF_BLOCK_MODE=1` at deploy time to switch it to BLOCK.
- Optional managed rule groups (feature flags; default off):
  - `WAF_ENABLE_KNOWN_BAD_INPUTS=1` enables `AWSManagedRulesKnownBadInputsRuleSet`
  - `WAF_ENABLE_SQLI=1` enables `AWSManagedRulesSQLiRuleSet`
  - `WAF_ENABLE_ANONYMOUS_IP=1` enables `AWSManagedRulesAnonymousIpList`
  - `WAF_ENABLE_BOT_CONTROL=1` enables `AWSManagedRulesBotControlRuleSet` (paid/opt-in AWS WAF feature)
    - `WAF_BOT_CONTROL_INSPECTION_LEVEL` controls inspection level (`COMMON` default; can be set to `TARGETED`)
- Rate limit is configurable via `WAF_RATE_LIMIT_PER_5MIN` (default 2000).
- Optional admin/control-plane IP allowlist (belt-and-suspenders on top of `admin:write` + `x-admin-token`):
  - `WAF_ADMIN_ALLOWLIST_CIDRS` = comma-separated IPv4 CIDRs (e.g., `203.0.113.0/24,198.51.100.10/32`)
  - `WAF_ADMIN_ALLOWLIST_ENFORCE=1` blocks matching admin/control-plane paths if the caller IP is not allowlisted (otherwise COUNT mode).

## Troubleshooting
- If you see **403** with `x-cache: Error from cloudfront`, it is likely **WAF** or CloudFront policy/rules.
- If you see **401** from the API with `auth.*` metrics incrementing, it is likely the **authorizer** (bad token, expired key, origin header mismatch, etc.).
- Verify origin bypass protection by calling `<api_url>` directly:
  - Without `x-origin-verify` it should be denied.
  - With `x-origin-verify: <SECRET>` (and a valid Authorization token) it should succeed.
