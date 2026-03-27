# Compliance SOP Pack (Templates)

Status: evidence-based where possible; PROPOSED sections are marked.

## Table of Contents
1. KYB/KYC Procedure Checklist
2. Evidence Review Checklist
3. Risk Scoring Review and Override
4. Exceptions and Appeals
5. Recordkeeping and Audit Response
6. Retention and Legal Hold
7. Incident Response (Template)

---

## 1. KYB/KYC Procedure Checklist

### 1.1 KYB Onboarding (Evidence-based)
- [ ] Verify portal user is authenticated via Cognito (ID token). Source: `kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:12`.
- [ ] Confirm tenant created via `POST /portal/onboarding`. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:15`.
- [ ] Confirm KYB documents uploaded via `POST /portal/onboarding/upload-url` and stored in KYB bucket. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:101`.
- [ ] Mark KYB start in admin console using `POST /kyb/start`. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:221`.
- [ ] Complete KYB using `POST /kyb/complete` with status APPROVED/REJECTED. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:246`.

### 1.2 KYC Verification (Evidence-based)
- [ ] Ensure API key issued before job creation. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:97`.
- [ ] Jobs submitted via `POST /jobs` with inputs (images/audio/video). Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:66`.
- [ ] Verify job completion via job status update or webhook events (`kyc.job.completed`). Source: `kyc-infra-main/cdktf/src/constructs/orchestrator/index.ts:145`.

---

## 2. Evidence Review Checklist

### 2.1 Document Review (KYB)
- [ ] Ensure file uploaded with SSE AES256. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:119`.
- [ ] Verify document integrity and relevance to the tenant (manual step).
- [ ] Record findings in audit log (admin audit table). Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:45`.

### 2.2 Biometric/Media Review (KYC)
- [ ] Confirm artifacts were submitted with valid subject_id for PII/BIOMETRIC/KYC_PII. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:249`.
- [ ] Review agent outputs stored in jobs table results (manual step).

PROPOSED: Add reviewer notes and decision fields to a case entity (see manual review section).

---

## 3. Risk Scoring Review and Override

- [ ] Default risk tier computed by KYB status (LOW/MEDIUM/HIGH). Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:290`.
- [ ] Manual override via `POST /risk/override` with actor and reason. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/admin.ts:308`.

PROPOSED: Require dual approval for overrides and store reviewer IDs in audit logs.

---

## 4. Exceptions and Appeals

### 4.1 Blocked/Suspended Tenants
- [ ] Portal access blocked when ops_status is BLOCKED/SUSPENDED. Source: `kyc-infra-main/cdktf/src/backend/controller/index.ts:102`.
- [ ] Review suspension reason and restore if applicable (manual step).

PROPOSED: Create an appeal workflow with SLA and escalation rules.

---

## 5. Recordkeeping and Audit Response

- [ ] Capture control-plane events in `CONTROL_PLANE_EVENTS_TABLE`. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:85`.
- [ ] Capture admin actions in `ADMIN_AUDIT_TABLE`. Source: `kyc-infra-main/cdktf/src/backend/controller/lib/audit.ts:45`.
- [ ] Provide audit exports from control-plane and admin audit logs (manual or tooling).

PROPOSED: Build an export endpoint for audit packages.

---

## 6. Retention and Legal Hold

- [ ] Default artifact retention is 30 days unless specified by `expires_at`. Source: `kyc-infra-main/cdktf/src/constructs/api/index.ts:261` and `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:85`.
- [ ] Legal holds override retention deletions. Source: `kyc-infra-main/cdktf/src/backend/retention/job.ts:184`.
- [ ] Create holds via `POST /compliance/holds`, delete via `DELETE /compliance/holds`. Source: `kyc-infra-main/cdktf/src/backend/controller/routes/compliance.ts:29`.

PROPOSED: Define retention durations by data_class and jurisdiction.

---

## 7. Incident Response (Template)

PROPOSED (no evidence in code):
- [ ] Detect incident (alert source, logs, metrics).
- [ ] Contain impact (disable API keys, suspend tenant).
- [ ] Preserve evidence (export audit logs, webhook delivery logs).
- [ ] Notify stakeholders and regulators per policy.
- [ ] Post-incident review and remediation.
