# Onboarding, Billing, Rating Engine, and Cost Controls (Prepaid + Controlled Overage)

**Doc purpose:** End-to-end design for onboarding + billing + cost limiting for a multi-tenant B2B KYC API.  
**Assumed stack:** AWS (DynamoDB, Lambda, API Gateway, CloudWatch/EMF, EventBridge, Step Functions/ECS).  
**Billing model:** Prepaid wallet with controlled overage (no unbounded postpaid).

---

## 0. Goals & Scope

### Goals
- **Multi-tenant onboarding** with KYB + risk scoring + environment access control (SANDBOX/PROD).
- **Prepaid wallet** with controlled overage and deterministic lock states.
- **Rating Engine** turns usage into **Verification Units (VUs)** and **$**.
- **Atomic ledger + balance updates** (no race conditions, no double-charging).
- **Daily caps**, penalties, dunning, and **clear gating logic**.
- **Operational clarity:** what runs where, retries/backoff, observability/metrics, and safe defaults.

### Non-goals (v1)
- Complex invoice generation (monthly invoices, tax/VAT) beyond basic statements/export.
- Metered postpaid without prepaid cap.
- Killing in-flight jobs mid-execution after lock (explicitly not done; see §10.3).

---

## 1. Core Domain Model

### 1.1 Entities
- **Tenant**: one customer organization (B2B customer).
- **Environment**: `SANDBOX`, `PROD`.
- **KYC Job**: a single verification request (e.g., ID + selfie).
- **Agent**: worker type (ImageAgent, VideoAgent, future).
- **Verification Unit (VU)**: abstract unit produced by rating rules; used for pricing and caps.
- **Rating Engine**: service that:
  - ingests usage events,
  - calculates VUs + $,
  - writes ledger entries,
  - updates balance and daily usage atomically.
- **Admission Guard**: pre-flight gating and limit enforcement for incoming job requests.
- **VerificationUnitLedger**: append-only journal for money/unit movements.
- **TenantBalance**: hot snapshot per tenant (balance + billing status + version).
- **TenantDailyUsage**: per-tenant per-day VU counter (caps).

> **Important platform consistency note:** authenticated request handling should treat `tenant_id` and `environment` as **server-authoritative** (injected from auth context before request normalization), never caller-authoritative.

### 1.3 Current Implementation Hooks (Dec 2025)
- **Edge auth (authoritative tenant/env/scopes):** API Gateway HTTP API Lambda authorizer (simple response) verifies `Authorization: Bearer api_key_id.secret` against DynamoDB API key table using Argon2 (`cdktf/src/backend/auth/authorizer.ts`, `cdktf/src/stacks/dev.ts`).
- **Controller identity source:** controller reads `tenant_id`, `environment`, and `scopes` from `event.requestContext.authorizer.lambda` and rejects requests missing authorizer context; it does not trust (or use) `x-tenant-id` / `x-env` headers (`cdktf/src/backend/controller/index.ts`).
- **Admission Guard enforcement:** `POST /jobs` invokes `checkAdmission` before starting Step Functions; admission reads `TenantCore`, `TenantBalance`, and daily usage with strongly consistent reads (`cdktf/src/backend/admission/index.ts`, `cdktf/src/backend/controller/index.ts`).
- **Canonical rating engine runtime:** Billing Lambda at `cdktf/src/backend/billing/index.ts` is the single source of truth. Rating events are delivered via FIFO SQS -> Lambda event source mapping (`cdktf/src/constructs/billing/index.ts`).
- **Schema reality:** `TenantBalance` is keyed by `tenant_id` only (no `(tenant_id, environment)` composite key). Ledger statement views should be built via `Query` on the tenant PK + time-ordered SK, not via a non-existent “tenant ledger” GSI (`cdktf/src/backend/controller/index.ts`, `cdktf/src/constructs/billing/index.ts`).
- **Sandbox policy reality:** SANDBOX usage is tracked in a separate daily usage table field (`requests_today`) and does not decrement balance in billing; PROD uses `vu_consumed` and updates balances/ledger (`cdktf/src/backend/billing/index.ts`, `cdktf/src/backend/admission/index.ts`).

### 1.2 Canonical status fields (orthogonal; do not overload one field)
**kyb_status**
- `PENDING`, `APPROVED`, `REJECTED`

**billing_status**
- `NOT_READY` – no payment/top-up yet
- `HEALTHY` – balance ≥ soft threshold
- `LOW_BALANCE` – 0 ≤ balance < soft threshold
- `ON_CREDIT` – balance < 0 but within grace + within hard negative limit
- `OVERDUE` – negative beyond grace; penalties accruing
- `LOCKED` – billing locked; PROD usage blocked (SANDBOX may remain allowed with separate caps)

**ops_status**
- `ACTIVE`
- `SUSPENDED` (manual ops action: fraud, abuse, legal issue)

**env_access**
- `NONE`
- `SANDBOX_ONLY`
- `SANDBOX_AND_PROD`

These four fields are the **source of truth** for gating.

---

## 2. Tenant Lifecycle Overview

### High-level lifecycle
1. **Sign-up**
2. **KYB + Risk**
3. **Plan selection + Billing setup (wallet seeded)**
4. **Sandbox activation**
5. **Production go-live**
6. **Runtime rating + gating**
7. **Overdraft + penalties + dunning**
8. **Plan changes + overrides + KYB re-checks**

---

## 3. Phase 1 – Sign-up

### 3.1 User actions
- Work email (verified via OTP/magic link)
- Full name
- Company name, website, country
- Accept ToS
- Password + 2FA (recommended default)

### 3.2 System actions
Create Tenant (example logical record):
```json
{
  "tenant_id": "TENANT#123",
  "kyb_status": "PENDING",
  "billing_status": "NOT_READY",
  "ops_status": "ACTIVE",
  "env_access": "NONE",
  "risk_tier": null
}


- Create owner user.

Provision dashboard shell (no API keys yet).

- Banner: **Complete KYB + billing to unlock SANDBOX.**

## 4. Phase 2 — KYB & Risk

### 4.1 KYB data collection

Tenant submits:

- Legal entity info + registration numbers
- Incorporation docs + directors/UBO IDs
- Business profile (vertical, target countries, expected monthly verifications)

### 4.2 Risk scoring & KYB decision

Risk engine/manual review sets `risk_tier ∈ {LOW, MEDIUM, HIGH, PROHIBITED}`.

Decision:

- **If PROHIBITED**
  - `kyb_status = REJECTED`
  - `env_access = NONE`
  - Account effectively closed (subject to legal retention obligations).
- **Else**
  - `kyb_status = APPROVED`
  - Compute defaults (can be overridden later):
    - `price_per_unit`
    - `hard_negative_limit`
    - `soft_balance_threshold`
    - `grace_period_days`
    - `penalty_rate_per_day`
    - `penalty_cap_ratio`
    - `max_daily_vu_cap`

Dashboard message: **“KYB Approved — connect a payment method to activate SANDBOX.”**

## 5. Phase 3 — Plan Selection & Billing Setup

### 5.1 Plan selection + immutable PlanSnapshot

Tenant selects a plan (Starter/Growth/Enterprise). Create immutable plan snapshot:

{
  "tenant_id": "TENANT#123",
  "plan_snapshot": {
    "plan_id": "starter-v1",
    "price_per_unit": 0.50,
    "hard_negative_limit": -10.0,
    "soft_balance_threshold": 20.0,
    "grace_period_days": 7,
    "penalty_rate_per_day": 0.005,
    "penalty_cap_ratio": 0.5,
    "max_daily_vu_cap": 1000
  },
  "effective_from": "2025-11-28T00:00:00Z"
}


Immutability rule: new pricing/plan = new snapshot with new `effective_from`. No retroactive edits.

### 5.2 Payment methods, top-ups & failures

First top-up (≥ minimum):

- **Success**
  - Write `TOP_UP` ledger entry.
  - Atomically update `TenantBalance`.
  - Set `billing_status = HEALTHY` (or `LOW_BALANCE`) and `env_access = SANDBOX_ONLY`.
- **Soft failure (declined/timeout)**
  - No ledger entry.
  - `billing_status` remains `NOT_READY`.
- **Fraud/mismatch**
  - Ops may set `ops_status = SUSPENDED` or `kyb_status = REJECTED`.

### 5.3 Refunds, chargebacks, manual corrections

Ledger supports reversal movements:

- `REFUND` (negative `dollar_value`; reduces balance)
- `CHARGEBACK` (negative `dollar_value`; reduces balance)
- `ADJUSTMENT` (ops corrections; must record reason + actor; audited)

These can push tenants into `ON_CREDIT`/`OVERDUE`/`LOCKED` via the same atomic update path.

## 6. Phase 4 — Sandbox Activation (Policy Locked)

### 6.1 Sandbox billing policy (v1)

No real billing in SANDBOX:

- Rating computes VUs for analytics.
- `dollar_value = 0` for SANDBOX.

Sandbox cannot go negative:

- No penalties.
- No overdraft states from SANDBOX usage.

Anti-abuse safeguards:

- Sandbox daily cap (e.g., 1,000 VUs/day).
- RPS caps per API key.
- Optionally disallow expensive ops (e.g., long videos).

### 6.2 Provisioning SANDBOX

On successful first top-up:

- Generate SANDBOX API keys.
- Set `env_access = SANDBOX_ONLY`.
- Dashboard shows:
  - Getting Started (SDKs, test data).
  - Usage chart (VUs + “shadow cost”).

## 7. Phase 5 — Production Go-Live

### 7.1 Checklist

Tenant must:

- Run successful sandbox verifications.
- Configure + verify webhooks.
- Explicitly acknowledge pricing + overage + penalties (with examples).
- Accept MSA + pricing appendix containing:
  - `price_per_unit`
  - `hard_negative_limit`
  - `grace_period_days`
  - `penalty_rate_per_day`
  - `penalty_cap_ratio`

### 7.2 Unlock PROD

After checklist + internal approval:

- Generate PROD API keys.
- Set `env_access = SANDBOX_AND_PROD`.
- `billing_status` continues to follow balance (not changed here).

8. Data Stores for Billing & Usage (DynamoDB)
8.1 VerificationUnitLedger (append-only)

Primary design: ledger is the system of record; balance is derived but stored as hot snapshot.

Recommended Dynamo schema (ledger table):

PK: tenant_id

SK: txn_id = "TXN#<timestamp>#<uuid>"

LedgerEntry shape:

interface LedgerEntry {
  tenant_id: string;
  txn_id: string;

  txn_type: "TOP_UP" | "PAYMENT" | "USAGE" | "PENALTY" | "REFUND" | "CHARGEBACK" | "ADJUSTMENT";

  timestamp: string;        // ISO8601
  dollar_value: number;     // + for credits, - for debits

  verification_units?: number;    // for usage-like entries
  job_id?: string;               // internal job identifier (no PII)
  usage_id?: string;             // idempotency key
  agent_type?: string;
  environment?: "SANDBOX" | "PROD";

  balance_before: number;
  balance_after: number;
  billing_status_after?: string;

  metadata?: Record<string, string | number | boolean>;
}


PII rule: ledger stores tenant IDs and internal job IDs only. End-user PII never goes into billing tables.

Statement/export support:

Optional GSI by tenant + date for statement queries.

Idempotency (IMPORTANT update):

Do not rely solely on querying a GSI to detect duplicates under concurrency (GSIs are eventually consistent).

Preferred patterns:

Dedicated idempotency table: UsageDedup(tenant_id, usage_id) with conditional Put.

Or: enforce a unique ledger key per usage_id by encoding usage_id into the ledger keyspace you condition on (e.g., write a companion item PK=tenant_id, SK="USAGE#<usage_id>" with attribute_not_exists), inside the same transaction.

8.2 TenantBalance (hot-path snapshot)

One row per tenant:

interface TenantBalance {
  tenant_id: string;

  current_balance: number;   // e.g. 23.42
  billing_status: string;    // HEALTHY / LOW_BALANCE / ON_CREDIT / OVERDUE / LOCKED
  last_txn_id: string;

  version: number;           // optimistic concurrency
  updated_at: string;        // ISO8601
}


This is the hot-path read for Admission Guard.

8.3 TenantDailyUsage (daily cap source of truth)

PK: tenant_id

SK: date = "YYYY-MM-DD" (UTC date)

interface TenantDailyUsage {
  tenant_id: string;
  date: string;
  vu_consumed: number;
  last_updated_at: string;
}


Correctness requirement: update daily usage in the same DynamoDB transaction as ledger + balance to keep caps consistent.

8.4 Plan snapshots + overrides

Store:

active plan snapshots (immutable)

overrides (audited; expiring)

9. Phase 7 – Rating Engine Runtime
9.1 RatingEvent input
interface RatingEvent {
  timestamp: string;
  tenant_id: string;
  job_id: string;
  usage_id: string;     // idempotency key (deterministic per job+agent+env+attempt)
  agent_type: string;
  environment: "SANDBOX" | "PROD";
  metrics: {
    taskDurationSeconds?: number;
    s3BytesIn?: number;
    s3BytesOut?: number;
  };
}


Events can be derived from:

workflow completions (Step Functions),

agent completion events,

EMF -> EventBridge conversions,

explicit “usage finalized” events.

9.2 RateCard + plan inputs

RateCard defines VU formula per AgentType:

interface RateRule {
  baseUnits: number;
  perSecond?: number;
  perMB?: number;
  minUnits?: number;
  maxUnits?: number;
}
type RateCard = Record<string, RateRule>;

Implementation note (current):
- RateCard is stored in DynamoDB (not hardcoded) and resolved at runtime per `(agent_type, environment, effective_from)` (`cdktf/src/constructs/billing/index.ts`, `cdktf/src/backend/billing/index.ts`).
- Table: `${prefix}-ratecards` with GSI `GSI_RateCardEnv` on `agent_env = "${agent_type}#${environment}"` and sort key `effective_from`.
- Minimal DEFAULT ratecard rows are provisioned at deploy-time so rating does not fail on an empty table; customize by inserting additional agent-specific rows.

Plan snapshot provides:

price_per_unit, hard_negative_limit, soft_balance_threshold, max_daily_vu_cap, etc.

9.3 Algorithm per usage event

Idempotency gate

Use conditional write (preferred) rather than only GSI-query.

If already processed, no-op.

Load balance + plan (strongly consistent reads)

Read TenantBalance with consistent read.

Resolve effective plan snapshot at event.timestamp (plus active overrides).

Compute VUs

apply RateRule(agent_type):

baseUnits + perSecond + perMB

clamp to minUnits/maxUnits

Compute dollar_value

If SANDBOX: dollar_value = 0

If PROD: dollar_value = round(units * price_per_unit, 2)

Compute next billing_status

balance_after = current_balance - dollar_value

status:

if balance_after >= soft_balance_threshold → HEALTHY

else if 0 <= balance_after < soft_balance_threshold → LOW_BALANCE

else if hard_negative_limit <= balance_after < 0 → ON_CREDIT

else → LOCKED

Daily usage delta

If PROD: delta_vu = units

If SANDBOX: usage is tracked separately (sandbox daily usage table increments `requests_today` and `vu_consumed`) so Admission Guard sandbox caps can be enforced.

Atomic TransactWriteItems
Transaction includes (minimum):

Put ledger entry (USAGE)

Update TenantBalance with optimistic concurrency:

ConditionExpression: version = :expected_version

set new balance/status, version++, updated_at

Update TenantDailyUsage:

ADD vu_consumed :delta_vu

SET last_updated_at = :now

with if_not_exists(vu_consumed, :zero)

DynamoDB transactions are all-or-nothing across up to 100 actions, enabling atomic ledger+balance updates. (See AWS TransactWriteItems.)
References: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html

Retry on version conflict
If conditional fails:

re-read TenantBalance (+ usage row if needed)

recompute and retry with bounded attempts + exponential backoff

10. Phase 8 – Admission Guard (Gating & Blocking Rules)
10.1 Where it runs

API Gateway Lambda Authorizer or

pre-step Lambda before Step Functions/ECS

It must run before any expensive compute.

10.2 Single source of truth for blocking (explicit)

Admission Guard always denies if:

ops_status = SUSPENDED

kyb_status = REJECTED

billing_status = LOCKED (for PROD)

env_access = NONE

If those pass:

environment access:

request for PROD requires env_access = SANDBOX_AND_PROD

request for SANDBOX requires env_access != NONE

load TenantBalance and today’s TenantDailyUsage with consistent reads

evaluate:

if PROD and current_balance < hard_negative_limit → deny (402_HARD_NEGATIVE_LIMIT)

if daily cap reached → deny (429_DAILY_CAP_REACHED)

else allow

Auth/tenant/env authority rule (explicit):

Tenant/environment identity is derived from authentication context, not client payload.

Request normalization must treat injected tenant_id + environment as immutable.

10.3 In-flight job policy (explicit)

Edge case:

Job A admitted, then tenant later becomes LOCKED due to other jobs.

Policy:

In-flight jobs continue and will be rated/billed when they complete.

Locking blocks new admissions only.

Do not attempt to kill running workflows or rollback ledger.

11. Phase 9 – Overdraft, Penalties & Dunning
11.1 Status transitions

HEALTHY → LOW_BALANCE: drops below soft threshold

LOW_BALANCE → ON_CREDIT: drops below 0 but above hard limit

ON_CREDIT → OVERDUE: negative beyond grace period

OVERDUE → LOCKED: beyond max overdue days or below hard negative limit

Transitions are driven by:

Rating Engine (usage)

Penalty Engine (penalties)

11.2 Penalty model (daily engine)

For tenants where:

billing_status in {ON_CREDIT, OVERDUE, LOCKED} and balance < 0

Compute:

overage = abs(balance)

days_since_overage_start

if within grace: no penalty

else:

candidate_penalty = overage * penalty_rate_per_day

enforce cap: penalties ≤ overage * penalty_cap_ratio

write PENALTY ledger entry + update balance atomically (transaction)

UX: trigger banners/emails on status transitions, not per request.

11.3 Settlements (top-ups/payments)

PAYMENT/TOP_UP ledger entries increase balance atomically

recompute billing_status after settlement

unlock from LOCKED when balance recovers (policy-defined)

12. Phase 10 – Plan Changes, Overrides, KYB Re-checks
12.1 Plan changes

New plan = new PlanSnapshot with effective_from

Rating Engine picks snapshot with effective_from ≤ event.timestamp

No retroactive changes; historical ledger remains immutable

12.2 Overrides (ops/support)
interface TenantOverride {
  tenant_id: string;
  key: string; // e.g. "hard_negative_limit", "max_daily_vu_cap"
  value: number | string;
  effective_from: string;
  expires_at: string;
  reason: string;
  actor_user_id: string;
}


Resolution:

effective_value = plan_value + active_overrides(key)

overrides must be audited and visible in admin tools

12.3 KYB re-checks after go-live

If risk becomes PROHIBITED:

set kyb_status = REJECTED

set env_access = NONE

optionally refund remaining positive balance per policy

ledger/job history retained for audit

13. Phase 11 – UX & Notifications
13.1 Tenant dashboard

Overview: balance + badges (Healthy/Low/On Credit/Overdue/Locked)

Usage & Spend:

VUs per day/week

spend by environment and agent type

sandbox “shadow cost”

Billing & Wallet:

ledger list with filters/export

Settings:

plan, pricing, limits, grace, penalties (with examples)

Notification rule: send email/banner on status transitions only.

13.2 Internal admin UX

Ops/finance:

view kyb_status/billing_status/ops_status/env_access

balances, penalties, overrides

actions:

suspend/reactivate (ops_status)

change plan

add override

create ADJUSTMENT (optionally dual-control)

Legal/compliance:

review/approve changes to penalty_rate, penalty_cap, hard_negative_limit

14. Security & Privacy Notes

Ledger and billing tables never store end-user PII.

Join to KYC domain data only via internal IDs (tenant_id, job_id, usage_id).

Billing access is tightly controlled and audited.

Use encryption at rest and least-privilege IAM for billing/rating components.

15. Operational Notes
Observability (EMF / CloudWatch)

Emit counters for:

rated events, idempotency drops, transaction retries, lock denials

daily cap denials

penalty applied totals, penalty cap hits

Avoid high-cardinality metric dimensions (e.g., per-tenant) for always-on metrics.

Prefer env, status, agent_type, plan_id, and coarse buckets.

CloudWatch metrics are grouped by dimension combinations; each dimension combination effectively creates distinct metric series and can increase cost/volume.
References:

https://docs.aws.amazon.com/pdfs/mediapackage/latest/ug/mediapackage-guide.pdf
 (metrics grouped by dimension combinations)

https://docs.aws.amazon.com/pdfs/streams/latest/dev/kinesis-dg.pdf
 (each metric dimension creates CloudWatch metrics; cost implications)

DynamoDB pagination and correctness

Any DynamoDB Scan must be paginated using LastEvaluatedKey / ExclusiveStartKey due to 1MB page limit.

Prefer Query (indexed access) over Scan for production hot paths.
References:

https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html

Legal holds + retention interaction (platform-aligned)

Destructive operations (retention scrubs, tenant offboarding) must respect legal holds.

To block deletes immediately after a hold is written, use strongly consistent reads on the base table keys.
References:

https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html

16. Testing Strategy (Minimum Bar)
Unit tests

Rating:

idempotency enforced under concurrency

correct VU calculation and rounding

transaction retry logic on version conflicts

Admission Guard:

gating matrix (ops/kyb/billing/env_access)

daily cap enforcement

Penalties:

grace behavior

penalty cap behavior

status transitions

Integration tests

Simulate multiple concurrent jobs: ensure no lost updates, no double charges.

End-to-end: sandbox → prod enablement → balance drain → lock → recovery via top-up.

17. Appendix – Suggested Error Codes

401_UNAUTHENTICATED

403_KYB_REJECTED

403_OPS_SUSPENDED

403_ENV_NOT_ALLOWED

402_HARD_NEGATIVE_LIMIT

403_BILLING_LOCKED

429_DAILY_CAP_REACHED
