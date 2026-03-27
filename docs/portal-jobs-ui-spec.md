# Portal Jobs UI Spec (Option A)

Status: PROPOSED where endpoints are missing. Evidence-based for existing data-plane job detail endpoint.

## 1) Job List

### Screen
- Route: `/portal/jobs` (PROPOSED)
- Audience: Portal tenant OWNER

### Required endpoints
- PROPOSED `GET /portal/jobs`
  - Suggested handler location: `kyc-infra-main/cdktf/src/backend/controller/routes/portal-jobs.ts`
  - Suggested response schema:
```json
{
  "jobs": [
    {
      "job_id": "JOB_123",
      "status": "SUBMITTED",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:05:00Z",
      "environment": "PROD"
    }
  ],
  "next_cursor": "..."
}
```

### Filters (PROPOSED)
- `start_time`, `end_time`
- `status`
- `endpoint_id` (if webhook view is linked)

### PII handling
- Do not show subject_id by default.
- Mask any artifact identifiers.

### Export
- CSV export (PROPOSED) with redaction.

## 2) Job Detail

### Screen
- Route: `/portal/jobs/:jobId` (PROPOSED)
- Audience: Portal tenant OWNER

### Evidence-based endpoint (data-plane)
- `GET /jobs/{jobId}` exists for API key auth. Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:204` and `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:145`.
- Security check verifies tenant match. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:171`.

### PROPOSED portal endpoint
- `GET /portal/jobs/{jobId}` to reuse the same response but with portal auth.

### Response shape (from data-plane)
```json
{
  "jobId": "JOB_123",
  "status": "COMPLETED",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:05:00Z",
  "inputs": { "images": ["s3://..."] },
  "results": [
    { "type": "image-deepfake", "decision": "PASS", "status": "ok", "data": {} }
  ],
  "report": {}
}
```

### UI components
- Status timeline
- Decision summary (PASS/FAIL + tool results)
- Artifacts list (masked)

## 3) Resubmit/Reupload (PROPOSED)

### Screen
- Action within Job Detail

### Required endpoint
- PROPOSED `POST /portal/jobs/{jobId}/resubmit`
- Suggested behavior: requeue job with same inputs, new job_id

## 4) Webhook deliveries view (optional)
- Use existing portal webhooks endpoints:
  - `GET /portal/webhooks/deliveries`
  - `GET /portal/webhooks/deliveries/{deliveryId}`

## 5) Authorization and auditing
- Enforce tenant_id match for any job data (BOLA prevention).
- Log access to job details (PROPOSED control-plane event).
