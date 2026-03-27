# Frontend Dashboard Endpoints Spec

Status: evidence-based for existing endpoints; missing endpoints are PROPOSED with suggested handler locations.

## 1) Client Portal dashboards

### 1.1 Overview / Usage
- Existing endpoint: `GET /portal/stats`
- Handler: `kyc-infra-main/cdktf/src/backend/controller/routes/stats.ts:7`
- Response (evidence-based shape):
```json
{
  "stats": {
    "jobs_today": 0,
    "jobs_total_30d": 0,
    "environment": "PROD",
    "history": { "YYYY-MM-DD": 0 }
  }
}
```
- Filters: none (fixed last 30 days). Source: `kyc-infra-main/cdktf/src/backend/controller/routes/stats.ts:12`.
- Export: PROPOSED CSV generated in FE (no export endpoint).

### 1.2 Webhooks Health
- Existing endpoints:
  - `GET /portal/webhooks/endpoints`
  - `GET /portal/webhooks/endpoints/{endpointId}`
  - `GET /portal/webhooks/deliveries`
  - `GET /portal/webhooks/deliveries/{deliveryId}`
- Handlers: `kyc-infra-main/cdktf/src/backend/controller/index.ts:135`.
- Notes: listEndpoints masks signing secret server-side. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/webhooks.ts:199`.
- Filters: PROPOSED query params (status, endpoint_id, time range).

### 1.3 Billing / Usage
- Existing endpoints:
  - `GET /portal/billing/balance`
  - `GET /portal/billing/ledger`
- Handlers: `kyc-infra-main/cdktf/src/backend/controller/index.ts:131`.
- Filters: PROPOSED (time range).

### 1.4 Submissions / Jobs Status (PROPOSED)
- Missing endpoints for portal job listing.
- PROPOSED endpoints:
  - `GET /portal/jobs` (list)
  - `GET /portal/jobs/{jobId}` (detail)
- Suggested handler location: new module `kyc-infra-main/cdktf/src/backend/controller/routes/portal-jobs.ts` or extend `routes/jobs.ts` with portal context.
- Suggested response schema:
```json
{
  "jobs": [
    {
      "job_id": "JOB_123",
      "status": "COMPLETED",
      "created_at": "2024-01-01T00:00:00Z",
      "environment": "PROD"
    }
  ],
  "next_cursor": "..."
}
```

### 1.5 Verification Results / Decision History (PROPOSED)
- Missing consolidated results endpoint for portal.
- PROPOSED endpoint: `GET /portal/jobs/{jobId}/results`.
- Suggested response schema:
```json
{
  "job_id": "JOB_123",
  "decision": "PASS",
  "signals": [
    { "tool": "image-facematch", "status": "ok", "score": 0.91 }
  ],
  "completed_at": "2024-01-01T00:00:00Z"
}
```

## 2) Admin Console dashboards

### 2.1 Ops Overview (PROPOSED)
- Missing admin metrics endpoint.
- PROPOSED endpoint: `GET /admin/metrics/ops`
- Suggested handler location: `kyc-infra-main/cdktf/src/backend/controller/routes/admin-metrics.ts`.
- Suggested response schema:
```json
{
  "window": "30d",
  "jobs_total": 0,
  "jobs_failed": 0,
  "p95_latency_ms": 0,
  "webhook_failures": 0,
  "queue_backlog": [
    { "queue": "image", "depth": 0 }
  ]
}
```

### 2.2 Risk & KYB Overview (PROPOSED/PARTIAL)
- Actions exist (KYB start/complete, risk recompute/override).
- Missing list endpoints for tenants, KYB status distribution, risk history.
- PROPOSED endpoints:
  - `GET /admin/tenants` (list with kyb_status, risk_tier)
  - `GET /admin/risk/overrides` (history)
- Suggested handler location: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts`.

### 2.3 Audit & Security (PARTIAL)
- Existing endpoint: `GET /control-plane-events`. Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:246`.
- PROPOSED filters: `action_type`, `start_time`, `end_time`.
- PROPOSED export: `GET /control-plane-events/export`.

### 2.4 Retention & Legal Holds (PARTIAL)
- Existing endpoint: `GET /compliance/holds`. Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:241`.
- PROPOSED metrics endpoint: `GET /admin/metrics/retention` (deleted_artifacts_total, subjects_scrubbed_total, legal_hold_skips_total).
- Suggested handler location: new `routes/retention-metrics.ts` or extend `routes/compliance.ts`.

### 2.5 Webhook Management (PARTIAL)
- Existing endpoints:
  - `GET /webhooks/endpoints`
  - `GET /webhooks/deliveries`
- PROPOSED metrics endpoint: `GET /admin/metrics/webhooks` (failures by reason, p95 delivery latency).

## 3) MVP endpoints required for dashboards

### Client Portal MVP
- `GET /portal/stats` (exists)
- `GET /portal/webhooks/endpoints` (exists)
- `GET /portal/webhooks/deliveries` (exists)
- `GET /portal/billing/balance` and `GET /portal/billing/ledger` (exists)
- `GET /portal/jobs` (PROPOSED)

### Admin Console MVP
- `GET /control-plane-events` (exists)
- `GET /compliance/holds` (exists)
- `GET /admin/metrics/ops` (PROPOSED)
- `GET /admin/metrics/webhooks` (PROPOSED)
- `GET /admin/tenants` (PROPOSED)

## 4) Export support (PROPOSED)
- Add `?format=csv` or separate `/export` endpoints for tables.
- Ensure exports omit PII and secrets (webhook signing secrets already masked).
