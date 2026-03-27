# Notifications dispatcher (vendor-neutral skeleton)

The control-plane includes a minimal notifications path that is “real” enough for ops testing, without requiring email/SMS vendor integrations.

## Components

- Controller enqueue endpoint: `POST /notify` (`cdktf/src/backend/controller/index.ts`)
  - Enqueues a message onto the notifications SQS queue.
  - Records an admin audit entry (best-effort) and a durable control-plane event record (idempotent).
- Notifications queue (SQS): `${prefix}-notifications` (`cdktf/src/stacks/dev.ts`)
- Dispatcher Lambda: `${prefix}-notifications-dispatcher` (`cdktf/src/backend/notifications/dispatcher.ts`)
  - Trigger: Lambda event source mapping from the notifications queue (`cdktf/src/stacks/dev.ts`)
  - Default behavior: structured log + durable control-plane event write (no external delivery).
  - Optional behavior (flagged): publish a summary message to an SNS topic.
- Notifications topic (SNS): `${prefix}-notifications-topic` (`cdktf/src/stacks/dev.ts`)

## Message shape (internal)

Enqueued by controller:

- `environment` (`SANDBOX`/`PROD`) (server-authoritative)
- `tenant_id`
- `kind` (free-form string, used only for logging; dispatcher normalizes to a bounded category for metrics)
- `payload` (object; not persisted by dispatcher; may contain operator-provided context)
- `actor`
- `created_at` (ISO timestamp)

## Flags

Dispatcher Lambda env vars:

- `NOTIFICATIONS_ENABLE_SNS=1` to enable SNS publish
- `NOTIFICATIONS_SNS_TOPIC_ARN` is wired by infra to `${prefix}-notifications-topic`

## Metrics (low-cardinality)

Dispatcher emits EMF metrics in namespace `kyc`:

- `notifications.dispatch_total {env,outcome,kind}`

Control-plane durable event writer metrics (shared name with controller):

- `controlplane.event_write_total {env,outcome}`
- `controlplane.event_write_error_total {env}`

All metric dimensions are bounded enums; no `tenant_id`/URL/event payload in dimensions.

