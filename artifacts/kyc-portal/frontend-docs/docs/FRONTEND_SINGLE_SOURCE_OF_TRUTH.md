# Frontend Single Source Of Truth

**Audience:** frontend engineers building the customer console and internal admin console for `kyc-infra`.

**Purpose:** this document consolidates the frontend-relevant contract scattered across `docs/` and the checked-in CDKTF/backend code. It is the handoff document frontend should use first.

## 1. How to read this document

Use the following precedence order:

1. This document for product behavior, page scope, recommended UI states, and derived values.
2. `docs/openapi/public-api.yaml` for route names and request/response intent.
3. The billing, onboarding, webhook, and control-plane docs for workflow semantics.
4. The checked-in `cdktf/src/backend/*` and `cdktf/src/stacks/dev.ts` code for what is actually wired in the current dev stack.

Important repo reality:

- The docs describe a broader platform contract than the currently wired `dev` stack.
- The checked-in `dev` stack currently wires only:
  - `POST /jobs`
  - `GET /jobs/{jobId}`
  - `POST /uploads/presign`
  - `GET /billing/balance`
  - `GET /billing/ledger`
- The repo-local OpenAPI and implementation docs describe the intended public/customer/admin/webhook surface beyond those five routes.

Frontend should therefore treat this as a **contract + gap map**:

- Build customer/admin IA and data models against the documented platform contract.
- Feature-flag screens/actions that depend on routes not yet wired in the deployed environment.
- Do not infer product rules from temporary shortcuts in the current controller when they conflict with the documented platform model.

## 2. Platform summary

This platform is a multi-tenant KYC verification system with:

- two environments: `SANDBOX` and `PROD`
- customer-facing job submission and artifact upload
- wallet-based billing with usage rating, caps, penalties, and lock states
- webhook endpoint management and delivery inspection
- admin/control-plane flows for onboarding, KYB, plans, API keys, billing top-ups, risk, notifications, and control-plane audit history

Frontend should assume two primary surfaces:

- **Customer Console**
  - onboarding and activation
  - API keys
  - jobs and uploads
  - billing and wallet
  - webhooks
  - compliance holds
- **Internal Admin Console**
  - tenant onboarding and lifecycle
  - KYB/risk
  - plan snapshots and overrides
  - billing top-ups and adjustments
  - API key lifecycle
  - notifications
  - control-plane event review
  - ops visibility for webhook and billing issues

## 3. Canonical entities

These entities should drive frontend state and naming:

- **Tenant**
  - one B2B customer organization
- **Environment**
  - `SANDBOX`
  - `PROD`
- **Job**
  - one KYC verification request
- **PlanSnapshot**
  - immutable pricing/limits config effective from a timestamp
- **TenantBalance**
  - hot-path wallet and billing status snapshot
- **LedgerEntry**
  - append-only money/unit journal
- **TenantDailyUsage**
  - daily production usage counter
- **WebhookEndpoint**
  - customer-configured destination for outbound webhook deliveries
- **WebhookDelivery**
  - per-event per-endpoint delivery attempt log
- **ControlPlaneEvent**
  - durable admin/control-plane audit record

## 4. Canonical statuses and frontend meaning

These enums are the source of truth for user-visible account state.

### Tenant lifecycle and access

`kyb_status`

- `PENDING`
- `APPROVED`
- `REJECTED`

`ops_status`

- `ACTIVE`
- `SUSPENDED`

`env_access`

- `NONE`
- `SANDBOX_ONLY`
- `SANDBOX_AND_PROD`

`risk_tier`

- `LOW`
- `MEDIUM`
- `HIGH`
- `PROHIBITED`

### Billing

`billing_status`

- `NOT_READY`
- `HEALTHY`
- `LOW_BALANCE`
- `ON_CREDIT`
- `OVERDUE`
- `LOCKED`

Recommended user-facing meaning:

| Status | Meaning in UI | Should block new PROD jobs? |
| --- | --- | --- |
| `NOT_READY` | Billing not configured | Yes |
| `HEALTHY` | Balance comfortably above threshold | No |
| `LOW_BALANCE` | Balance below soft threshold but non-negative | No |
| `ON_CREDIT` | Balance negative but still within allowed overage | Usually no |
| `OVERDUE` | Negative beyond grace rules; penalties may accrue | Plan-dependent |
| `LOCKED` | Billing lock active | Yes |

### Jobs

Observed/documented job statuses across repo:

- `SUBMITTED`
- `COMPLETED`
- `FAILED`

Use these as minimum display states until the backend publishes a richer job-state contract.

### Webhook delivery

Documented delivery log statuses:

- `PENDING`
- `IN_PROGRESS`
- `DELIVERED`
- `FAILED_PERMANENT`

## 5. Auth and edge contract

Frontend must follow these auth rules:

- HTTP API auth format:
  - `Authorization: Bearer <api_key_id>.<secret>`
- Split bearer on the **first** dot only.
- Environment is **server-authoritative** from the API key record.
- Frontend should **not** send environment-selection headers to decide auth context.
- CloudFront is the primary frontend-facing endpoint.
- Direct API Gateway access requires `x-origin-verify`, but the browser app should normally call CloudFront and never handle that header directly.
- Admin routes additionally require:
  - scope `admin:write`
  - header `x-admin-token`

Frontend implications:

- support environment switching in UI only where the authenticated key is permitted
- treat API key creation/rotation responses as one-time secret reveal flows
- provide clear copy for "secret shown once"

## 6. Customer console information architecture

Recommended customer navigation:

1. Overview
2. Onboarding
3. API Keys
4. Jobs
5. Uploads
6. Billing
7. Webhooks
8. Compliance
9. Settings

### 6.1 Overview page

Show:

- environment access badge
- KYB status badge
- billing status badge
- current balance
- soft threshold
- hard negative limit
- remaining daily PROD cap
- sandbox usage today
- recent jobs
- recent webhook failures
- next recommended action

Recommended banners:

- `kyb_status = PENDING`
  - "Complete KYB to unlock SANDBOX."
- `kyb_status = APPROVED` and `billing_status = NOT_READY`
  - "Add billing and top up wallet to activate SANDBOX."
- `env_access = SANDBOX_ONLY`
  - "Configure webhooks and complete go-live checklist to unlock PROD."
- `billing_status = LOW_BALANCE`
  - "Balance is below threshold."
- `billing_status = ON_CREDIT`
  - "Account is using controlled overage."
- `billing_status = OVERDUE`
  - "Balance overdue. Penalties may accrue."
- `billing_status = LOCKED`
  - "Account locked for new production verifications."

### 6.2 Onboarding page

Show stepper:

1. Sign-up complete
2. KYB submitted
3. KYB approved
4. Plan selected
5. Wallet funded
6. SANDBOX active
7. Webhooks verified
8. PROD approved

### 6.3 API Keys page

Support:

- create API key
- rotate API key
- revoke API key
- view non-secret metadata
- filter by environment and status

Important UX rule:

- newly created or rotated bearer secret is shown once only

### 6.4 Jobs page

Support:

- create job
- upload inputs through presign flow
- list/review recent jobs
- poll job status or reconcile via webhook outcomes

Recommended columns:

- `job_id`
- environment
- submission time
- current status
- tool mix inferred from inputs
- latest webhook outcome if available

### 6.5 Billing page

Support:

- balance summary
- plan/limits summary
- ledger table
- exports
- usage charts
- status transition history if available

### 6.6 Webhooks page

Support:

- create endpoint
- edit endpoint
- rotate secret
- send test event
- inspect deliveries
- replay delivery

Recommended tabs:

- Endpoints
- Deliveries
- Health

### 6.7 Compliance page

Support:

- create/update legal hold
- remove legal hold
- list holds

## 7. Internal admin console information architecture

Recommended admin navigation:

1. Tenants
2. KYB
3. Risk
4. Plans and Overrides
5. Billing Ops
6. API Keys
7. Webhooks Ops
8. Notifications
9. Control Plane Events
10. Platform Ops

Admin views should expose the four canonical gating fields together on one row:

- `kyb_status`
- `billing_status`
- `ops_status`
- `env_access`

## 8. HTTP API contract for frontend

### 8.1 Public/customer routes

| Route | Purpose | Frontend use | Contract state |
| --- | --- | --- | --- |
| `GET /health` | health check | optional status probe | documented |
| `POST /jobs` | create job | submit verification | documented and wired, but current code returns `202` with simplified body |
| `GET /jobs/{jobId}` | get job | poll status/details | documented, but current code is placeholder only |
| `POST /uploads/presign` | create presigned upload URL | direct browser upload | documented and wired, but current code response shape differs |
| `GET /billing/balance` | balance snapshot | billing summary cards | documented and wired |
| `GET /billing/ledger` | recent ledger | transaction list | documented and wired |
| `POST /compliance/holds` | create/update hold | compliance screen | documented |
| `DELETE /compliance/holds` | remove hold | compliance screen | documented |
| `GET /compliance/holds` | list holds | compliance screen | documented |

### 8.2 Webhook routes

| Route | Purpose | Frontend use | Contract state |
| --- | --- | --- | --- |
| `POST /webhooks/endpoints` | create endpoint | add endpoint modal | documented |
| `GET /webhooks/endpoints` | list endpoints | endpoints table | documented |
| `GET /webhooks/endpoints/{endpointId}` | endpoint detail | endpoint drawer/page | documented |
| `PATCH /webhooks/endpoints/{endpointId}` | update endpoint | edit endpoint | documented |
| `POST /webhooks/endpoints/{endpointId}/rotate-secret` | rotate signing secret | rotation flow | documented |
| `POST /webhooks/endpoints/{endpointId}/test` | send test event | verification UX | documented |
| `GET /webhooks/deliveries` | list deliveries | delivery logs table | documented |
| `GET /webhooks/deliveries/{deliveryId}` | inspect delivery | detail drawer/page | documented |
| `POST /webhooks/deliveries/{deliveryId}/replay` | replay delivery | retry action | documented |

### 8.3 Admin/control-plane routes

| Route | Purpose | Frontend use | Contract state |
| --- | --- | --- | --- |
| `POST /tenants` | create tenant and initial plan snapshot | admin onboarding | documented |
| `POST /apikeys` | create key | admin/API keys | documented |
| `POST /apikeys/rotate` | rotate key | admin/API keys | documented |
| `POST /apikeys/revoke` | revoke key | admin/API keys | documented |
| `GET /apikeys/{apiKeyId}` | key metadata | admin/API keys | documented |
| `POST /billing/topup` | wallet top-up | billing ops | documented |
| `POST /kyb/start` | KYB started | KYB ops | documented |
| `POST /kyb/complete` | KYB approved/rejected | KYB ops | documented |
| `POST /risk/recompute` | recompute risk | risk ops | documented |
| `POST /risk/override` | override risk | risk ops | documented |
| `POST /plans/snapshot` | create immutable plan snapshot | pricing ops | documented |
| `POST /plans/overrides` | create override | pricing ops | documented |
| `POST /notify` | enqueue notification | support/ops tooling | documented |
| `GET /control-plane-events` | list durable admin events | audit timeline | documented |

### 8.4 Known contract gaps in current checked-in dev code

Frontend should explicitly account for these mismatches:

- `POST /jobs`
  - OpenAPI says `200` with `{ ok, job_id, request_id }`
  - current code returns `202` with `{ jobId, status: "SUBMITTED" }`
- `GET /jobs/{jobId}`
  - documented as real job status
  - current code returns placeholder text
- `POST /uploads/presign`
  - OpenAPI says `{ ok, url, requiredHeaders }`
  - current code returns `{ uploadUrl, s3Key }`
- `GET /billing/balance`
  - current code fallback uses `billing_status: "NEW_ACCOUNT"` which is **not** part of canonical billing enums
- the current checked-in controller still reads tenant/environment from request headers or query params, while the documented contract says identity is authorizer-derived and server-authoritative

Frontend recommendation:

- use feature flags for screens depending on unimplemented routes
- do not hardcode temporary response shapes as the long-term contract
- treat canonical enums from this document as the product model

## 9. Webhook contract

### 9.1 Supported event types

- `kyc.job.completed`
- `kyc.job.failed`
- `system.webhook.test`

### 9.2 Canonical webhook event shape

```json
{
  "event_id": "EVT#TENANT#123#PROD#JOB#456#kyc.job.completed",
  "event_type": "kyc.job.completed",
  "version": "v1",
  "tenant_id": "TENANT#123",
  "environment": "PROD",
  "job_id": "JOB#456",
  "correlation_id": "optional-correlation-id",
  "created_at": "2025-12-24T10:00:00Z",
  "data": {
    "status": "COMPLETED"
  }
}
```

Failed job example:

```json
{
  "event_id": "EVT#TENANT#123#PROD#JOB#456#kyc.job.failed",
  "event_type": "kyc.job.failed",
  "version": "v1",
  "tenant_id": "TENANT#123",
  "environment": "PROD",
  "job_id": "JOB#456",
  "created_at": "2025-12-24T10:00:00Z",
  "data": {
    "status": "FAILED",
    "error": "AgentFailure",
    "cause": "image-facematch timeout"
  }
}
```

### 9.3 Webhook endpoint fields frontend should model

- `endpoint_id`
- `environment`
  - `SANDBOX`
  - `PROD`
  - `BOTH`
- `target_url`
- `event_types[]`
- `status`
- `description`
- `signing_secret`
  - shown once on create/rotate
- optional delivery controls from docs
  - `max_retries`
  - `rate_limit_per_min`

### 9.4 Webhook delivery fields frontend should model

- `delivery_id`
- `event_id`
- `endpoint_id`
- `tenant_id`
- `created_at`
- `status`
- `attempt_count`
- `max_retries`
- `next_attempt_at`
- `replay_count`
- `last_replay_at`
- `last_replay_reason`
- `last_status_code`
- `last_error_message`
- `last_response_body_snippet`

### 9.5 Webhook UX recommendations

- endpoint table should show:
  - environment
  - subscribed events
  - last delivery status
  - last success time
  - last failure time
- delivery table should support filters:
  - date range
  - status
  - endpoint
  - event type
- detail view should expose:
  - attempts
  - retry schedule
  - replay count
  - request/response snippets
  - signature verification help

## 10. Billing and usage contract

### 10.1 Canonical plan fields

Frontend should treat these as the primary pricing/limits fields:

- `plan_id`
- `price_per_unit`
- `hard_negative_limit`
- `soft_balance_threshold`
- `grace_period_days`
- `penalty_rate_per_day`
- `penalty_cap_ratio`
- `max_daily_vu_cap`
- optional:
  - `sandbox_max_daily_vu_cap`
  - `block_on_overdue`
  - `allow_negative`

### 10.2 Canonical balance fields

- `tenant_id`
- `current_balance`
- `billing_status`
- `last_txn_id`
- `version`
- `updated_at`

### 10.3 Canonical ledger fields

- `tenant_id`
- `txn_id`
- `txn_type`
  - `TOP_UP`
  - `PAYMENT`
  - `USAGE`
  - `PENALTY`
  - `REFUND`
  - `CHARGEBACK`
  - `ADJUSTMENT`
- `timestamp`
- `dollar_value`
- `verification_units`
- `job_id`
- `usage_id`
- `agent_type`
- `environment`
- `balance_before`
- `balance_after`
- `billing_status_after`

### 10.4 Usage/rating model

Frontend should assume:

- SANDBOX usage produces VUs for analytics but `$0` charge
- PROD usage produces both VUs and spend
- daily production caps are enforced on `vu_consumed`
- sandbox caps are enforced separately on sandbox usage counters

## 11. Recommended frontend values and formulas

These values should be computed either in frontend selectors or a backend-for-frontend layer.

### 11.1 Customer overview cards

- **Current balance**
  - `current_balance`
- **Soft threshold**
  - `soft_balance_threshold`
- **Hard negative limit**
  - `hard_negative_limit`
- **Headroom before lock**
  - `max(0, current_balance - hard_negative_limit)`
- **Headroom before low-balance threshold**
  - `current_balance - soft_balance_threshold`
- **PROD daily cap remaining**
  - `max(0, max_daily_vu_cap - vu_consumed_today)`
- **PROD daily cap used %**
  - `vu_consumed_today / max_daily_vu_cap`
- **SANDBOX usage remaining**
  - `max(0, sandbox_cap - sandbox_requests_today)`
- **Shadow cost**
  - `sandbox_vus * price_per_unit`
- **Last top-up amount**
  - latest ledger item where `txn_type in {TOP_UP, PAYMENT}`

### 11.2 Webhook health values

- **Delivery success rate 24h**
  - `delivered_24h / attempted_24h`
- **Failure rate 24h**
  - `failed_permanent_24h / attempted_24h`
- **Endpoints with failures**
  - count of endpoints with at least one failed delivery in selected window
- **Average attempts per successful delivery**
  - `sum(attempt_count for delivered) / delivered_count`
- **Replay pressure**
  - sum of `replay_count` in selected window

### 11.3 Admin values

- **Tenants by KYB status**
- **Tenants by billing status**
- **Tenants by env access**
- **Total balance at risk**
  - sum absolute negative balances
- **Overdue tenants**
  - count where `billing_status = OVERDUE`
- **Locked tenants**
  - count where `billing_status = LOCKED`
- **Keys expiring soon**
  - keys with `expires_at` inside next 7/30 days

## 12. Recommended charts and widgets

### 12.1 Customer console

Recommended graphs:

- **Balance over time**
  - line chart from ledger `balance_after`
- **Daily verification units**
  - stacked bar by environment
- **Spend over time**
  - bar or area chart from PROD `USAGE` ledger debits
- **Spend by agent type**
  - stacked bar or donut using ledger `agent_type`
- **Sandbox shadow cost**
  - line or bar chart
- **Webhook delivery outcomes**
  - stacked bar by day with `DELIVERED`, `PENDING`, `FAILED_PERMANENT`
- **Recent job outcomes**
  - bar by status over trailing 7/30 days

Recommended tables:

- recent jobs
- recent ledger entries
- webhook endpoints
- recent webhook deliveries

### 12.2 Internal admin console

Recommended graphs:

- **Tenants by billing status**
  - bar or stacked bar
- **Tenants by KYB status**
  - bar
- **Negative balance exposure**
  - line over time
- **Top tenants by daily VUs**
  - ranked bar
- **Webhook failures over time**
  - line/stacked bar
- **Control-plane events by action type**
  - stacked bar
- **Edge/API health**
  - p50/p99 latency, 4xx, 5xx if ops dashboard is included in frontend
- **Queue/DLQ health**
  - backlog and age for agent queues/webhook queues if internal-only ops views are in scope

Recommended operational widgets from the docs:

- WAF allowed/blocked/counted requests
- authorizer throttles
- authorizer cache hit/miss counters
- webhook delivery latency
- DLQ depth
- rating/admission failures

## 13. Page-by-page minimum payload needs

### Overview page

Needs:

- tenant core record
- balance snapshot
- current plan snapshot
- daily usage
- recent jobs
- recent webhooks summary

### Billing page

Needs:

- balance snapshot
- ledger entries
- plan snapshot
- daily usage time series

### Webhooks page

Needs:

- webhook endpoints
- deliveries list
- delivery detail
- replay/test actions

### Admin tenant detail page

Needs:

- tenant core
- plan snapshot
- overrides
- balance snapshot
- recent ledger
- API keys metadata
- webhook health
- control-plane event timeline

## 14. Frontend implementation guidance

- Build around canonical enums in this document, not around temporary string values in current dev-only fallbacks.
- Treat create/rotate secret flows as "copy once" modals.
- Use optimistic UI only for non-financial settings changes; billing and control-plane mutations should confirm server success before committing UI state.
- Preserve auditability in admin UX:
  - require reason fields for revoke, override, adjustment, and replay actions
- Prefer timeline/event views for admin actions and status transitions.
- Add feature flags for:
  - compliance holds
  - full webhook management
  - control-plane events
  - notifications
  - admin plan overrides

## 15. Open gaps and backend follow-ups

These should be resolved before frontend relies on them in production:

- wire the documented admin, webhook, compliance, and control-plane routes in `cdktf/src/stacks/dev.ts`
- align current controller response shapes with `docs/openapi/public-api.yaml`
- publish a real `GET /jobs/{jobId}` response schema
- expose daily usage and plan snapshot read APIs if frontend is expected to render billing/usage dashboards without direct table access
- expose aggregated webhook health/read models if the frontend should avoid client-side rollups
- remove temporary controller behavior that trusts caller-supplied tenant/environment

## 16. Source references

Primary sources used for this handoff:

- `docs/openapi/public-api.yaml`
- `docs/ONBOARDING_BILLING_COST_LIMITING_ADMISSION_GUARD.md`
- `docs/PIPELINE_AND_WEBHOOKS_V1_IMPLEMENTATION.txt`
- `docs/webhooks-ops-runbook.md`
- `docs/CONTROL_PLANE_SKELETON_ADMIN_APIS.md`
- `docs/API_KEY_ROTATION_AND_REVOCATION.md`
- `docs/NOTIFICATIONS_DISPATCHER.md`
- `docs/EDGE_FRONT_DOOR_CLOUDFRONT_WAF.md`
- `docs/OBSERVABILITY_RELIABILITY_V1_UPDATES.txt`
- `cdktf/src/backend/controller/index.ts`
- `cdktf/src/backend/admission/index.ts`
- `cdktf/src/backend/rating/index.ts`
- `cdktf/src/backend/penalty/index.ts`
- `cdktf/src/constructs/billing/index.ts`
- `cdktf/src/constructs/storage/index.ts`
- `cdktf/src/constructs/compute/index.ts`
- `cdktf/src/stacks/dev.ts`

## 17. Update policy

Any backend change affecting:

- route shapes
- auth semantics
- canonical enums
- billing state logic
- webhook events or delivery semantics
- onboarding/go-live flow
- control-plane actions

must update this document in the same change set.
