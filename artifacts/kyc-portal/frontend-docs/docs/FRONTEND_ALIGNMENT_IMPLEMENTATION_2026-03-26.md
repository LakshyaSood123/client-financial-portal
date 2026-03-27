# Frontend Alignment Implementation - 2026-03-26

## Purpose
This document records the implementation work completed after reviewing the embedded frontend docs bundle in:

- `FRONTEND_SINGLE_SOURCE_OF_TRUTH.md`
- `ONBOARDING_BILLING_COST_LIMITING_ADMISSION_GUARD.md`
- `CLIENT_INTERFACES_OPENAPI_AND_ADMIN_CLI.md`
- `CONTROL_PLANE_SKELETON_ADMIN_APIS.md`
- `NOTIFICATIONS_DISPATCHER.md`
- `PIPELINE_AND_WEBHOOKS_V1_IMPLEMENTATION.txt`
- `webhooks-ops-runbook.md`

It also ties that work back to the app state that existed before this alignment pass.

## What Existed Before This Pass
The following changes had already been made before the docs-driven alignment work:

### Workspace and build fixes
- Root `preinstall` was made cross-platform in `package.json`.
- `pnpm-workspace.yaml` was changed so Windows native packages for Rollup, esbuild, Lightning CSS, and Tailwind can install correctly.
- `artifacts/kyc-portal/vite.config.ts` and `artifacts/mockup-sandbox/vite.config.ts` were updated to default `PORT` and `BASE_PATH` instead of failing when env vars are missing.
- Framer Motion TypeScript issues were fixed in:
  - `artifacts/kyc-portal/src/pages/admin/AdminOverview.tsx`
  - `artifacts/kyc-portal/src/pages/admin/ClientManagement.tsx`

### Earlier UI-specific edits
- Admin greeting was changed to `Good evening, Admin`.
- Client greeting was changed to `Good evening, Client`.
- The old admin `Upcoming Review` card was replaced with a `Compliance Health` card.
- Customer `Webhooks` had previously been removed from the portal nav and route structure based on an earlier user direction.

That earlier removal conflicted with the embedded frontend docs bundle, which explicitly requires a customer-facing webhooks surface. This implementation pass resolves that conflict in favor of the docs bundle.

## Gap Assessment That Drove This Work
After reading the embedded docs, the major mismatches were:

1. Customer IA did not match the docs.
   Required by docs: `Overview`, `Onboarding`, `API Keys`, `Jobs`, `Uploads`, `Billing`, `Webhooks`, `Compliance`, `Settings`.
   Previous app: `Overview`, `Verifications`, `API Keys`, `Billing`, `Audit Logs`, with customer `Webhooks` removed.

2. Admin IA did not match the docs.
   Required by docs: `Tenants`, `KYB`, `Risk`, `Plans and Overrides`, `Billing Ops`, `API Keys`, `Webhooks Ops`, `Notifications`, `Control Plane Events`, `Platform Ops`.
   Previous admin nav lacked `Plans and Overrides`, `Notifications`, and `Platform Ops`.

3. Customer overview, onboarding, and billing surfaces did not reflect the canonical operational model described in the docs.

4. Tenant list did not expose the full canonical gating set together.
   Required by docs: `kyb_status`, `billing_status`, `ops_status`, `env_access`.

## Implemented Changes

### 1. Route graph aligned to the embedded docs bundle
Updated `artifacts/kyc-portal/src/App.tsx` to add or restore:

- Customer routes:
  - `/portal/jobs`
  - `/portal/uploads`
  - `/portal/webhooks`
  - `/portal/compliance`
  - `/portal/settings`
- Redirect:
  - `/portal/verifications` -> `/portal/compliance`
- Admin routes:
  - `/admin/plans-overrides`
  - `/admin/notifications`
  - `/admin/platform-ops`
- Legacy redirects:
  - `/jobs`
  - `/uploads`
  - `/webhooks`
  - `/compliance`
  - `/settings`

### 2. Customer sidebar now matches the docs IA
Updated `artifacts/kyc-portal/src/components/layout/Sidebar.tsx`.

Before:
- Overview
- Verifications
- API Keys
- Billing
- Audit Logs

After:
- Overview
- Onboarding
- API Keys
- Jobs
- Uploads
- Billing
- Webhooks
- Compliance
- Settings

This explicitly restores the customer `Webhooks` entry that had previously been removed.

### 3. Admin sidebar now matches the docs IA
Updated `artifacts/kyc-portal/src/components/layout/AdminSidebar.tsx`.

Added:
- Plans & Overrides
- Notifications
- Platform Ops

Renamed nav labels to better reflect the docs:
- `KYC Review` -> `KYB`
- `Billing` -> `Billing Ops`
- `Webhooks` -> `Webhooks Ops`
- `Events` -> `Control Plane Events`

### 4. Added missing customer screens
Added:
- `artifacts/kyc-portal/src/pages/portal/PortalJobs.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalUploads.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalWebhooks.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalCompliance.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalSettings.tsx`

These are backend-gated shells with spec-aligned placeholders and mock data instead of blank stubs.

### 5. Added missing admin screens
Added:
- `artifacts/kyc-portal/src/pages/admin/AdminPlans.tsx`
- `artifacts/kyc-portal/src/pages/admin/AdminNotifications.tsx`
- `artifacts/kyc-portal/src/pages/admin/AdminPlatformOps.tsx`

These reserve the required admin surfaces identified in the control-plane and notifications docs.

### 6. Customer overview was refactored toward the docs model
Updated:
- `artifacts/kyc-portal/src/pages/portal/PortalStats.tsx`
- `artifacts/kyc-portal/src/components/dashboard/tabs/OverviewTab.tsx`
- `artifacts/kyc-portal/src/components/dashboard/UsageChart.tsx`
- `artifacts/kyc-portal/src/components/dashboard/WebhookDonut.tsx`
- `artifacts/kyc-portal/src/components/dashboard/RightPanel.tsx`

Before:
- Generic dashboard content
- Verification donut in place of webhooks
- Less explicit focus on canonical tenant gates

After:
- Overview language now references:
  - environment access
  - onboarding gates
  - balance controls
  - recent platform activity
- Added readiness rows for:
  - KYB status
  - billing status
  - environment access
  - API keys
  - uploads
  - jobs queue
- Restored a webhooks delivery health donut tied back to the docs
- Added recommended next steps tied to uploads, jobs, and webhooks
- Right rail now reflects go-live checklist logic instead of the older generic onboarding block

### 7. Onboarding flow expanded from a 3-step placeholder to a docs-aligned lifecycle
Updated `artifacts/kyc-portal/src/pages/OnboardingPage.tsx`.

Before:
- 3-step shell
  - Business Details
  - KYB Documents
  - Review & Submit

After:
- 8-stage lifecycle aligned to the embedded onboarding and admission docs:
  1. Create tenant
  2. Business profile
  3. KYB evidence
  4. Review and approve
  5. Choose plan
  6. Fund wallet
  7. Verify integrations
  8. Production admission

### 8. Billing surface now reflects threshold and admission concepts from the docs
Updated `artifacts/kyc-portal/src/components/dashboard/tabs/BillingTab.tsx`.

Before:
- Mostly generic balance and usage presentation

After:
- Explicit cards for:
  - current balance
  - soft threshold
  - hard negative limit
  - current plan
- Added cycle limits section
- Ledger text now emphasizes balance-affecting entries and admission behavior

### 9. Compliance screen now replaces the old customer verifications concept
Updated:
- `artifacts/kyc-portal/src/components/dashboard/tabs/VerificationTab.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalCompliance.tsx`

Change:
- The previous `Verifications` concept is now surfaced as `Compliance`, which is closer to the embedded docs language.
- Upload CTA inside the compliance view now routes to `/portal/uploads`.

### 10. Admin tenant list now exposes the canonical gating fields together
Updated `artifacts/kyc-portal/src/pages/admin/AdminTenants.tsx`.

Before:
- plan
- KYB
- single status field

After:
- plan
- KYB status
- billing status
- ops status
- environment access

This is the most direct implementation of the tenant list gap identified during docs review.

## Files Added
- `artifacts/kyc-portal/frontend-docs/docs/FRONTEND_ALIGNMENT_IMPLEMENTATION_2026-03-26.md`
- `artifacts/kyc-portal/src/pages/admin/AdminNotifications.tsx`
- `artifacts/kyc-portal/src/pages/admin/AdminPlans.tsx`
- `artifacts/kyc-portal/src/pages/admin/AdminPlatformOps.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalCompliance.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalJobs.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalSettings.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalUploads.tsx`

## Files Modified In This Alignment Pass
- `artifacts/kyc-portal/src/App.tsx`
- `artifacts/kyc-portal/src/components/dashboard/RightPanel.tsx`
- `artifacts/kyc-portal/src/components/dashboard/UsageChart.tsx`
- `artifacts/kyc-portal/src/components/dashboard/WebhookDonut.tsx`
- `artifacts/kyc-portal/src/components/dashboard/tabs/BillingTab.tsx`
- `artifacts/kyc-portal/src/components/dashboard/tabs/OverviewTab.tsx`
- `artifacts/kyc-portal/src/components/dashboard/tabs/VerificationTab.tsx`
- `artifacts/kyc-portal/src/components/layout/AdminSidebar.tsx`
- `artifacts/kyc-portal/src/components/layout/Sidebar.tsx`
- `artifacts/kyc-portal/src/pages/OnboardingPage.tsx`
- `artifacts/kyc-portal/src/pages/admin/AdminTenants.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalStats.tsx`
- `artifacts/kyc-portal/src/pages/portal/PortalWebhooks.tsx`

## What Is Still Not Fully Resolved
The following gaps remain and should be treated as the next implementation phase:

1. Auth contract mismatch
- Embedded docs describe API key and admin token patterns.
- Current app still includes the earlier Cognito-based auth flow.
- This pass did not replace the auth model.

2. Real backend integration
- Most newly aligned surfaces still use placeholder or illustrative data.
- The UI shape is now much closer to the docs, but backend wiring is still pending.

3. Admin tenant detail page
- The docs imply a richer tenant detail surface.
- This pass aligned the list, not the full detail workflow.

4. Legacy files still present
- `PortalVerifications.tsx` remains in the tree as a legacy artifact even though routing now redirects to compliance.

## Validation
Validated with:

- `pnpm --filter @workspace/kyc-portal run build`

Result:
- Build passes successfully.
- Existing non-blocking warnings remain about large bundle size and a sourcemap lookup in `src/components/ui/tooltip.tsx`.

## Summary
This implementation pass reoriented the frontend from the earlier narrower portal mock into a docs-aligned IA and screen set. The main correction was restoring customer `Webhooks`, adding the missing portal/admin surfaces required by the embedded docs, and refactoring overview, onboarding, billing, and tenant gating views so they reflect the documented operational model rather than the earlier generic dashboard structure.
