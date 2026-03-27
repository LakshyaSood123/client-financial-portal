# Compliance Build Backlog

## 1) Define Sanctions/PEP/Adverse Media Policy
- Owner: Compliance
- Description: Establish screening requirements and provider selection.
- Dependencies: None in repo (no integration).
- Acceptance criteria: Policy document and integration requirements approved.
- Related files: `docs/complete-compliance.md`.
- Security notes: Ensure vendor data handling aligns with privacy requirements.

## 2) Implement Screening Integration (Backend)
- Owner: Backend
- Description: Add screening service integration with audit logs and decision outcomes.
- Dependencies: Policy definition (Item 1).
- Acceptance criteria: API endpoints + audit logging + data retention rules implemented.
- Related files: `kyc-infra-main/cdktf/src/backend/controller`.
- Security notes: PII handling and access controls.

## 3) Case Management Workflow (PROPOSED)
- Owner: Backend
- Description: Implement case entity and reviewer assignment for manual review.
- Dependencies: Compliance workflow definition.
- Acceptance criteria: Case states and reviewer attribution; audit logs captured.
- Related files: new controller routes.
- Security notes: least-privilege access for reviewers.

## 4) Retention Matrix by Data Class
- Owner: Compliance
- Description: Define retention durations for PII/BIOMETRIC/KYC_PII/DERIVED_CONTENT.
- Dependencies: Legal requirements by jurisdiction.
- Acceptance criteria: Documented matrix and backend config updates.
- Related files: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:85`.
- Security notes: ensure legal hold overrides documented.

## 5) Audit Export Procedure
- Owner: Compliance
- Description: Define audit export package (fields, format, retention).
- Dependencies: Audit tables in DDB. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:45`.
- Acceptance criteria: Export SOP and tooling plan.
- Related files: `docs/compliance-sop-pack.md`.
- Security notes: redact secrets and limit access.

## 6) Incident Response Playbook
- Owner: Compliance
- Description: Define breach response actions and notification channels.
- Dependencies: Org security policy.
- Acceptance criteria: Playbook approved and linked to monitoring alerts.
- Related files: `docs/compliance-sop-pack.md`.
- Security notes: preserve forensic evidence.

## 7) Data Residency Policy
- Owner: Compliance
- Description: Define regions and data residency constraints.
- Dependencies: Deployment regions. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:29`.
- Acceptance criteria: Policy approved and enforced in infra.
- Related files: `kyc-infra-main/cdktf/src/stacks/dev.ts`.
- Security notes: ensure replication and backups are compliant.
