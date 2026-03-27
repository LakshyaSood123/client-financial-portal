# Decision Brief: Third Portal (Partner/Auditor/Support)

Status: PENDING decision.

## Personas and minimum capabilities

### Partner portal (PROPOSED)
- Multi-tenant aggregation view for partners managing multiple client tenants.
- View usage metrics, webhook health, and billing across linked tenants.

### Auditor portal (PROPOSED)
- Read-only access to audit logs, compliance holds, and job decisions.
- Exportable reports for compliance reviews.

### Support portal (PROPOSED)
- Limited access to tenant status, KYB status, and webhook deliveries.
- No access to raw artifacts or secrets.

## Security boundaries
- Separate portal reduces risk of privilege escalation in primary client/admin UI.
- Enforce read-only scopes for auditors and limited scopes for support.

## PROPOSED RBAC model
- Auditor: read-only access to audit logs, control-plane events, compliance holds.
- Support: read-only access to tenant status, webhook health, billing status.
- Partner: aggregated read access across linked tenants (requires explicit mapping).

## Minimal endpoint requirements (PROPOSED)
- Tenant list and metadata (`GET /admin/tenants`) for partners/support.
- Audit logs export endpoint for auditors.
- Compliance holds list for auditors.
- Webhook deliveries list for support.

## Logging and audit requirements
- Record access by auditor/support in control-plane events.
- Ensure all read access is traceable by user and tenant.

## Recommendation criteria checklist
- Are there external auditors who require direct system access?
- Is support access currently handled via manual logs or API access?
- Do partners manage multiple tenants that require aggregated views?
- Does compliance require read-only, segregated access?
