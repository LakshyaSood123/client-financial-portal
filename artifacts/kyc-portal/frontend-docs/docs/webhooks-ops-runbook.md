# Webhook Delivery System v1 Ops Runbook

## Endpoint lifecycle
- **Create**: call `POST /webhooks/endpoints` with target URL, event types, and optional rate limits. Secrets are auto-generated and encrypted under the webhook KMS key.
- **Rotate secret**: use `POST /webhooks/endpoints/{endpointId}/rotate-secret`. The masked secret in the response is the only copy; store it securely.
- **Test**: `POST /webhooks/endpoints/{endpointId}/test` enqueues a synthetic event through the delivery worker so you can verify signature handling.
- **Internal enqueue**: `POST /webhooks/events/enqueue` requires the `x-internal-webhook-token` header matching `WEBHOOK_INTERNAL_ENQUEUE_TOKEN`; missing/mismatched tokens are rejected.

## Monitoring deliveries
- **List deliveries**: `GET /webhooks/deliveries` (query params: `from`, `to`, `status`, `endpoint_id`, `event_type`, `limit`, `cursor`). Results are served from `GSI_TenantDeliveries` ordered by `created_at`.
- **Inspect a delivery**: `GET /webhooks/deliveries/{deliveryId}` returns the log record including attempts, errors, and last request/response snippets.
- **Replay**: `POST /webhooks/deliveries/{deliveryId}/replay` optionally accepts `{ "reason": "...", "max_retries": 8 }`. Replay sets `status=PENDING`, bumps `replay_count`, and re-enqueues the delivery into the FIFO queue. Default limit is 5 replays per delivery per rolling hour; 429 is returned if exceeded unless `x-webhooks-admin-replay` matches `WEBHOOK_ADMIN_REPLAY_TOKEN`.

## Logs & metrics
- **Fanout worker** logs `FanoutResolvedEndpoints`, `FanoutEnqueuedDeliveries`, and `FanoutNoEndpoints` metrics per Environment/EventType plus structured JSON logs (`tenant_id`, `event_id`, `endpoint_id`, `delivery_id`).
- **Delivery worker** logs metrics for `DeliveryAttempt`, `DeliverySuccess`, `DeliveryRetryScheduled`, `DeliveryFailedPermanent`, and `DeliveryLatencyMs`. Structured logs include tenant, endpoint, event, delivery ID, status, attempts, and retry delays.
- Use CloudWatch insights on the `/aws/lambda/kyc-*-webhook-*` log groups to search by `delivery_id` or `endpoint_id`.

## Safety & semantics
- **Idempotency**: `event_id` is stable (`event_id#endpoint_id` → `delivery_id`). Replay preserves the same delivery log and simply re-queues with a new attempt.
- **Rate limiting**: per-endpoint `rate_limit_per_min` throttles deliveries. When throttled, the log remains `PENDING`, `next_attempt_at` is updated, and the message is re-enqueued with an automatic delay. No attempt counters are incremented until an actual HTTP call is made.
- **KMS**: endpoint secrets are encrypted with the dedicated webhook key whose policy grants the controller and delivery lambdas `Encrypt/Decrypt/GenerateDataKey`.
- **Payload caps**: enqueue API rejects bodies >200 KB; delivery worker enforces `MAX_BODY_BYTES` (256 KB) and truncates response snippets to 1 KB to avoid log bloat.
- **Redirect/DNS hardening**:
  - SSRF/URL validation is centralized in `cdktf/src/backend/shared/ssrf.ts` and used both at endpoint registration time and at delivery time.
  - Delivery rejects HTTP redirects (uses `redirect: "manual"` and treats 3xx + `Location` as a permanent failure).
  - DNS resolution checks all A/AAAA answers; private/reserved ranges and common internal hostnames are blocked.
- **Deterministic payloads**: JSON bodies are serialized via `stableStringify()` so signatures are computed over deterministic key ordering (payload semantics unchanged).
- **Supported event types**: `kyc.job.completed`, `kyc.job.failed`, `system.webhook.test`; other event types are blocked by the schema validator.

## Troubleshooting
1. **Endpoint disabled/missing**: deliveries automatically become `FAILED_PERMANENT` with `last_error_message="Endpoint missing or disabled"`.
2. **HTTP failures**: check `last_status_code`, `last_error_message`, and `last_response_body_snippet` in the delivery log. Use `replay` after fixing the downstream system.
3. **Stuck deliveries**: list deliveries filtered by `status=PENDING` and inspect `next_attempt_at`. If `replay_count` is high, consider raising `max_retries` or disabling the endpoint temporarily.
4. **Signature validation issues**: use the test endpoint or inspect the structured logs which include `x-kyc-signature` metadata.

Keep this runbook in version control and update it whenever delivery semantics change.
