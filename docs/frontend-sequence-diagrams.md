# Frontend Sequence Diagrams

Status: evidence-based; proposed steps marked.

## Table of Contents
1. Login and Token Validation
2. Portal Onboarding and KYB Upload
3. Presigned Upload Flow (Data Plane)
4. Webhook Registration and Delivery
5. Retention Deletion and Legal Hold

---

## 1. Login and Token Validation
```mermaid
sequenceDiagram
  participant U as User
  participant FE as Portal UI
  participant C as Cognito
  participant CF as CloudFront
  participant API as API Gateway
  participant AUTH as Portal Authorizer
  participant CTRL as Controller

  U->>FE: Login
  FE->>C: OAuth code flow / password auth
  C-->>FE: ID token (+ refresh token if enabled)
  FE->>CF: GET /portal/me (Authorization: Bearer ID token)
  CF->>API: Forward request + x-origin-verify
  API->>AUTH: Verify token (tokenUse=id)
  AUTH-->>API: Allow + email context
  API->>CTRL: Invoke route
  CTRL-->>FE: tenant profile
```
Evidence: `kyc-infra-main/cdktf/src/backend/auth/portal-authorizer.ts:12`, `kyc-infra-main/cdktf/src/constructs/edge/index.ts:174`.

---

## 2. Portal Onboarding and KYB Upload
```mermaid
sequenceDiagram
  participant FE as Portal UI
  participant CF as CloudFront
  participant API as API Gateway
  participant CTRL as Controller
  participant DDB as DynamoDB
  participant S3 as KYB S3 Bucket

  FE->>CF: POST /portal/onboarding
  CF->>API: Forward + x-origin-verify
  API->>CTRL: onboardUser
  CTRL->>DDB: Create TENANT + USER link
  CTRL-->>FE: tenant_id

  FE->>CF: POST /portal/onboarding/upload-url
  API->>CTRL: getKybUploadUrl
  CTRL-->>FE: upload_url + key
  FE->>S3: PUT document (SSE AES256)
```
Evidence: `kyc-infra-main/cdktf/src/backend/controller/routes/onboarding.ts:15`.

---

## 3. Presigned Upload Flow (Data Plane)
```mermaid
sequenceDiagram
  participant FE as Client UI
  participant CF as CloudFront
  participant API as API Gateway
  participant CTRL as Controller
  participant S3 as Artifacts Bucket

  FE->>CF: POST /uploads/presign (Authorization: Bearer api_key_id.secret)
  API->>CTRL: presignUpload
  CTRL-->>FE: uploadUrl + s3Key + requiredHeaders
  FE->>S3: PUT object (x-amz-server-side-encryption=AES256)
```
Evidence: `kyc-infra-main/cdktf/src/backend/controller/routes/jobs.ts:242`.

---

## 4. Webhook Registration and Delivery
```mermaid
sequenceDiagram
  participant FE as Portal UI
  participant API as Controller
  participant DDB as Webhook Tables
  participant SQS as Fanout Queue
  participant DW as Delivery Worker
  participant CUST as Customer Endpoint

  FE->>API: POST /portal/webhooks/endpoints
  API->>DDB: Store endpoint + encrypted secret
  API-->>FE: endpoint_id + masked secret

  API->>DDB: Store webhook event (job completed/failed)
  API->>SQS: Enqueue fanout
  SQS->>DW: delivery_id
  DW->>CUST: POST webhook with x-kyc-timestamp, x-kyc-signature
  CUST-->>DW: 2xx/4xx
```
Evidence: `kyc-infra-main/cdktf/src/backend/webhooks/delivery-worker.ts:366`.

---

## 5. Retention Deletion and Legal Hold
```mermaid
sequenceDiagram
  participant R as Retention Job
  participant DDB as Retention Tables
  participant S3 as Artifacts Bucket

  R->>DDB: Query expired artifacts (GSI_Expire)
  R->>DDB: Check legal hold
  alt no legal hold
    R->>S3: Delete object
    R->>DDB: Delete retention record
  else legal hold
    R-->>DDB: Skip deletion
  end
```
Evidence: `kyc-infra-main/cdktf/src/backend/retention/job.ts:104`.
