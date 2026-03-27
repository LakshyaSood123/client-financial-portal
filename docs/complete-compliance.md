# Complete Compliance Spec (KYC Multimodal)

Status: evidence-based, repo-only. All unknowns are flagged with TODO/UNKNOWN and include where to confirm.

## Table of Contents
1. Compliance Scope and Regulatory Baseline
2. KYC/CDD/KYB Workflow (End-to-End)
3. Screening and Risk (If Present)
4. Manual Review, Case Management, Escalations
5. Recordkeeping, Audit Trails, Data Retention
6. Privacy and Security Controls (Operational)
7. Reporting and Monitoring
8. Appendices
9. Related Handoff Docs

---

## 1. Compliance Scope and Regulatory Baseline

### 1.1 Evidence-based scope
- **Customer types:** Tenant entities (KYB) and end-user verification jobs (KYC-like checks via image/audio/video). Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:45` and `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:104`.
- **Jurisdictions:** No explicit jurisdictions in code. Deployment region in dev stack is `ap-south-1` with WAF in `us-east-1`. Source: `kyc-infra-main/cdktf/src/stacks/dev.ts:29` and `kyc-infra-main/cdktf/src/stacks/dev.ts:39`.
  TODO/UNKNOWN: define supported jurisdictions and data residency policy. Where searched: `rg -n "jurisdiction|residency|region" kyc-infra-main kyc-agents-main`. Next files to check: policy docs or environment-specific stack files not in repo. Decision required: publish jurisdiction list + data residency constraints. Recommendation: align jurisdiction list with deployment regions and cross-region data flows (CloudFront/WAF in us-east-1).
- **Risk tiers:** `risk_tier` computed from KYB status (LOW/MEDIUM/HIGH). Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:290`.
- **KYB status values:** PENDING/APPROVED/REJECTED. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:253`.
- **Ops status values:** ACTIVE/SUSPENDED/BLOCKED. Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:102`.

### 1.2 Mapping to FATF-style controls (evidence-based)
- **CDD/KYC data collection:** Job inputs (images/audio/video), subject identifiers, data_class (PII/BIOMETRIC/KYC_PII). Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:83` and `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:36`.
- **Recordkeeping:** Control plane events and admin audit logs stored in DynamoDB. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:45`.
- **Retention:** Automated retention job for artifacts and subject/tenant records with legal hold overrides. Source: `kyc-infra-main/cdktf/src/backend/retention/job.ts:174`.

TODO/UNKNOWN: AML/PEP/sanctions/adverse media are not present in code. Where searched: `rg -n "sanction|pep|adverse" kyc-infra-main kyc-agents-main`. Next files to check: policy docs or vendor integration modules not in repo. Decision required: define screening requirements and providers. Recommendation: add a screening service with audit-log writes and result persistence per subject.

---

## 2. KYC/CDD/KYB Workflow (End-to-End)

### 2.1 Workflow diagram (evidence-based)
```mermaid
flowchart TD
  A[Portal User Auth via Cognito] --> B[Onboarding: Create Tenant]
  B --> C[KYB Document Upload]
  C --> D[Admin: KYB Start]
  D --> E[Admin: KYB Complete]
  E --> F[Risk Recompute/Override]
  F --> G[API Key Created]
  G --> H[KYC Job Created]
  H --> I[Step Function Orchestration]
  I --> J[Agents: image/audio/video checks]
  I --> K[SageMaker Video Liveness]
  J --> L[Results stored in DDB]
  I --> M[Webhook Events (job completed/failed)]
```
Evidence for steps:
- Onboarding + tenant creation: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:15`.
- KYB upload: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:101`.
- KYB start/complete: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:221` and `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:246`.
- Risk recompute/override: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:276`.
- API key issuance: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:97` and portal self-service `kyc-infra-main/cdktf/src/backend/controller/routes/apikeys.ts:43`.
- Job creation and orchestration: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:66` and Step Functions start `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:165`.
- Job completion updates: jobs table metadata status set to COMPLETED in orchestration. Source: `kyc-infra-main/cdktf/src/constructs/orchestrator/index.ts:145`.
- Agent processing: `kyc-agents-main/common/sqs_runner.py:113` and agent handlers in `kyc-agents-main/image/*/main.py`.
- Video liveness via SageMaker async: `kyc-infra-main/cdktf/src/backend/video/submit.ts:23` and callback `kyc-infra-main/cdktf/src/backend/video/callback.ts:23`.
- Webhook events for job completion/failure: `kyc-infra-main/cdktf/src/constructs/orchestrator/index.ts:167` and schema validation `kyc-infra-main/cdktf/src/backend/webhooks/schema.ts:13`.

### 2.2 Data collected and validation rules
- **Tenant onboarding:** `company_name` required. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:30`.
- **KYB upload:** filename required; content_type defaults application/pdf; SSE AES256 enforced. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:109`.
- **KYC job inputs:** at least one of images/audio/video required. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:80`.
- **Subject ID requirement for PII-class artifacts:** if data_class is PII/BIOMETRIC/KYC_PII, subject_id required. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:36` and `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:249`.

### 2.3 Evidence artifacts stored
- **Job inputs:** stored in S3 via presigned uploads. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:265`.
- **Agent results:** stored in DDB with pk=JOB#<id>. Source: `kyc-agents-main/common/sqs_runner.py:65`.
- **KYB documents:** stored in KYB bucket. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:119`.
- **Webhook delivery logs:** stored in DynamoDB. Source: `kyc-infra-main/cdktf/src/backend/webhooks/store.ts:180`.

TODO/UNKNOWN: No consolidated KYC decision report schema beyond agent outputs. Where searched: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts` and `kyc-agents-main/common/models.py`. Next files to check: report templates or compliance exports outside repo. Decision required: define final report format and storage location. Recommendation: store a normalized JSON report per job with decision, evidence references, and timestamps.

---

## 3. Screening and Risk (If Present)

### 3.1 Sanctions/PEP/adverse media
No evidence of sanctions, PEP, or adverse media screening in codebase.

TODO/UNKNOWN:
- Define screening policy and providers. Where searched: `rg -n "sanction|pep|adverse" kyc-infra-main kyc-agents-main`. Next files to check: vendor integrations or ops runbooks outside repo. Decision required: select providers and trigger points. Recommendation: integrate screening as separate service with audit log writes.

### 3.2 Risk scoring model
- Risk tier derived from KYB status only:
  - APPROVED -> LOW
  - REJECTED -> HIGH
  - otherwise -> MEDIUM
  Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:290`.
- Manual override exists via `/risk/override`. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:308`.

TODO/UNKNOWN: No configurable model or explainability outputs found. Where searched: `rg -n "risk|score|threshold|model" kyc-infra-main/cdktf/src kyc-agents-main`. Next files to check: analytics/risk service not in repo. Decision required: introduce external risk engine or in-house model. Recommendation: store model version, inputs, and explanation artifacts alongside job results.

---

## 4. Manual Review, Case Management, Escalations

No explicit case management or manual review workflow is present in code (no case entities, queues, or reviewer roles).

TODO/UNKNOWN:
- No case management entities or routes found. Where searched: `rg -n "case|review|escalat" kyc-infra-main/cdktf/src kyc-agents-main`. Next files to check: ops tooling or CRM integration not in repo. Decision required: implement case management. Recommendation: add case entity (OPEN/IN_REVIEW/ESCALATED/RESOLVED) with reviewer assignment and SLA fields.

---

## 5. Recordkeeping, Audit Trails, Data Retention

### 5.1 Audit logging
- **Control plane events:** `CONTROL_PLANE_EVENTS_TABLE` records actions with payload_summary, outcome, error_code. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:85`.
- **Admin audits:** `ADMIN_AUDIT_TABLE` stores admin actions. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:45`.
- **API key auth audit:** optional `API_KEY_AUDIT_TABLE_NAME` in authorizer. Source: `kyc-infra-main/cdktf/src/backend/auth/authorizer.ts:31`.

### 5.2 Retention and deletion
- Default artifact retention: `DEFAULT_ARTIFACT_RETENTION_DAYS` set to 30 in API env. Source: `kyc-infra-main/cdktf/src/constructs/api/index.ts:261`.
- Retention pointers written on job creation and presign uploads. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:41` and `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:257`.
- Retention worker deletes artifacts and scrubs subjects unless legal holds exist. Source: `kyc-infra-main/cdktf/src/backend/retention/job.ts:181`.

Retention matrix (evidence):
- Data classes accepted: PII, BIOMETRIC, KYC_PII (validated) and UNSPECIFIED/DERIVED_CONTENT defaults. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:36` and `kyc-agents-main/common/artifacts.py:50`.
- Retention records allow optional `retention_policy_id` and `jurisdiction` fields. Source: `kyc-agents-main/common/retention.py:33` and `kyc-agents-main/common/retention.py:315`.
- No class-specific retention durations found. TODO/UNKNOWN: define retention durations by data_class and jurisdiction. Where searched: `rg -n "retention_policy|retention.*days|retention.*ttl" kyc-infra-main kyc-agents-main`. Next files to check: policy tables or ops config not in repo. Decision required: define retention durations and map to data_class + jurisdiction. Recommendation: create retention policy records and enforce by data_class.

### 5.3 Legal holds
- Legal hold APIs: create/list/delete. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/compliance.ts:29`.
- Retention job checks legal holds before deletions. Source: `kyc-infra-main/cdktf/src/backend/retention/job.ts:184`.

### 5.4 Immutability guarantees
- Control-plane events use idempotency key to avoid duplicate writes. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:26`.
- No explicit WORM storage evidence. TODO/UNKNOWN: define audit immutability requirements. Where searched: `rg -n "worm|immutab|append-only|object lock" kyc-infra-main kyc-agents-main`. Next files to check: storage policies or S3 Object Lock configs outside repo. Decision required: define immutability standard and storage mechanism. Recommendation: enable S3 Object Lock or DDB streams to an immutable store.

---

## 6. Privacy and Security Controls (Operational)

### 6.1 PII classification and masking
- Data class field requires subject_id for PII/BIOMETRIC/KYC_PII artifacts. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:249`.
- Audit payload summaries are truncated and hashed. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:16`.

### 6.2 Encryption at rest/in transit
- S3 presigned uploads require SSE AES256 headers. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:265`.
- Webhook signing secrets encrypted with KMS. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/webhooks.ts:33`.
- Tenant/subject keys encrypted using KMS or local encryption. Source: `kyc-agents-main/common/key_management.py:33`.

### 6.3 Access control policies
- Admin token + scope for control-plane operations. Source: `kyc-infra-main/cdktf/src/backend/controller/context.ts:94`.
- Portal access blocked for suspended/blocked ops status. Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:102`.

### 6.4 Incident response hooks
No explicit incident response hooks found. TODO/UNKNOWN: define alerting, breach reporting, and escalation channels. Where searched: `rg -n "incident|breach|alert|pager|sns|slack" kyc-infra-main kyc-agents-main`. Next files to check: ops runbooks or notifications integrations outside repo. Decision required: define IR workflow and owner contacts. Recommendation: wire CloudWatch alarms to an incident channel and define breach notification SLAs.

### 6.5 Data residency
No data residency configuration found in repo. TODO/UNKNOWN: confirm regional deployment policy and data residency requirements. Where searched: `rg -n "region|residency|location|geo" kyc-infra-main kyc-agents-main`. Next files to check: deployment runbooks or multi-region configs outside repo. Decision required: define residency requirements and region list. Recommendation: restrict PII processing to a single region per tenant.

---

## 7. Reporting and Monitoring

### 7.1 Compliance reports available
- Portal audit logs: `/portal/audit-logs`. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/audit.ts:9`.
- Control-plane events: `/control-plane-events`. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:358`.
- Billing ledger: `/billing/ledger` and `/portal/billing/ledger`. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/billing.ts:91`.

TODO/UNKNOWN: No SAR/STR reporting or compliance exports found. Where searched: `rg -n "sar|str|suspicious|report|export" kyc-infra-main kyc-agents-main`. Next files to check: compliance export jobs or BI pipeline not in repo. Decision required: define report formats and storage. Recommendation: add a monthly export job with immutable storage and audit trail.

---

## 8. Appendices

### 8.1 Compliance-relevant endpoint inventory
See `docs/frontend-api-contract.md` for endpoint details.

### 8.2 Entity/state machine tables (evidence)
- Tenant core: `kyb_status` (PENDING/APPROVED/REJECTED), `ops_status` (ACTIVE/SUSPENDED/BLOCKED), `env_access` (NONE/SANDBOX_ONLY/SANDBOX_AND_PROD). Source: `kyc-infra-main/cdktf/src/backend/admission/index.ts:42`.
- Billing status: NOT_READY/HEALTHY/LOW_BALANCE/ON_CREDIT/OVERDUE/LOCKED. Source: `kyc-infra-main/cdktf/src/backend/admission/index.ts:51` and `kyc-infra-main/cdktf/src/backend/billing/penalty.ts:49`.
- Risk tier: LOW/MEDIUM/HIGH. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:290`.
- Webhook delivery status: PENDING/IN_PROGRESS/DELIVERED/FAILED_PERMANENT. Source: `kyc-infra-main/cdktf/src/backend/webhooks/types.ts:5`.

---

## 9. Related Handoff Docs
- `docs/compliance-sop-pack.md`
- `docs/compliance-build-backlog.md`
- `docs/complete-frontend.md` (linked FE context)
