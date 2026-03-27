import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Auth
import LoginPage     from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";

// Portal pages
import PortalStats        from "@/pages/portal/PortalStats";
import PortalApiKeys      from "@/pages/portal/PortalApiKeys";
import PortalJobs         from "@/pages/portal/PortalJobs";
import PortalUploads      from "@/pages/portal/PortalUploads";
import PortalWebhooks     from "@/pages/portal/PortalWebhooks";
import PortalBilling      from "@/pages/portal/PortalBilling";
import PortalCompliance   from "@/pages/portal/PortalCompliance";
import PortalSettings     from "@/pages/portal/PortalSettings";
import PortalAuditLogs    from "@/pages/portal/PortalAuditLogs";

// Admin pages
import AdminOverview  from "@/pages/admin/AdminOverview";
import AdminTenants   from "@/pages/admin/AdminTenants";
import KYCQueue       from "@/pages/admin/KYCQueue";
import RiskAlerts     from "@/pages/admin/RiskAlerts";
import AdminCompliance from "@/pages/admin/AdminCompliance";
import AdminBilling   from "@/pages/admin/AdminBilling";
import AdminApiKeys   from "@/pages/admin/AdminApiKeys";
import AdminPlans     from "@/pages/admin/AdminPlans";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminEvents    from "@/pages/admin/AdminEvents";
import AdminWebhooks  from "@/pages/admin/AdminWebhooks";
import AdminPlatformOps from "@/pages/admin/AdminPlatformOps";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* ── Auth / onboarding ─────────────────────────────────── */}
      <Route path="/login"               component={LoginPage} />
      <Route path="/onboarding"          component={OnboardingPage} />
      <Route path="/onboarding/kyb-upload" component={OnboardingPage} />

      {/* ── Portal routes ─────────────────────────────────────── */}
      <Route path="/portal"              component={PortalStats} />
      <Route path="/portal/stats"        component={PortalStats} />
      <Route path="/portal/onboarding"   component={() => <Redirect to="/onboarding" />} />
      <Route path="/portal/apikeys"      component={PortalApiKeys} />
      <Route path="/portal/jobs"         component={PortalJobs} />
      <Route path="/portal/uploads"      component={PortalUploads} />
      <Route path="/portal/webhooks"     component={PortalWebhooks} />
      <Route path="/portal/billing"      component={PortalBilling} />
      <Route path="/portal/compliance"   component={PortalCompliance} />
      <Route path="/portal/settings"     component={PortalSettings} />
      <Route path="/portal/verifications" component={() => <Redirect to="/portal/compliance" />} />
      <Route path="/portal/audit-logs"   component={PortalAuditLogs} />

      {/* ── Admin routes ──────────────────────────────────────── */}
      <Route path="/admin"                       component={AdminOverview} />
      <Route path="/admin/tenants"               component={AdminTenants} />
      <Route path="/admin/kyc"                   component={KYCQueue} />
      <Route path="/admin/risk"                  component={RiskAlerts} />
      <Route path="/admin/compliance-holds"      component={AdminCompliance} />
      <Route path="/admin/plans-overrides"       component={AdminPlans} />
      <Route path="/admin/billing"               component={AdminBilling} />
      <Route path="/admin/apikeys"               component={AdminApiKeys} />
      <Route path="/admin/notifications"         component={AdminNotifications} />
      <Route path="/admin/control-plane-events"  component={AdminEvents} />
      <Route path="/admin/webhooks"              component={AdminWebhooks} />
      <Route path="/admin/platform-ops"          component={AdminPlatformOps} />

      {/* ── Legacy redirects ──────────────────────────────────── */}
      <Route path="/"                  component={() => <Redirect to="/portal" />} />
      <Route path="/usage"             component={() => <Redirect to="/portal/stats" />} />
      <Route path="/webhooks"          component={() => <Redirect to="/portal/webhooks" />} />
      <Route path="/billing"           component={() => <Redirect to="/portal/billing" />} />
      <Route path="/api-keys"          component={() => <Redirect to="/portal/apikeys" />} />
      <Route path="/jobs"              component={() => <Redirect to="/portal/jobs" />} />
      <Route path="/uploads"           component={() => <Redirect to="/portal/uploads" />} />
      <Route path="/compliance"        component={() => <Redirect to="/portal/compliance" />} />
      <Route path="/settings"          component={() => <Redirect to="/portal/settings" />} />
      <Route path="/audit-logs"        component={() => <Redirect to="/portal/audit-logs" />} />
      <Route path="/kyb-upload"        component={() => <Redirect to="/onboarding/kyb-upload" />} />
      <Route path="/admin/kyc-queue"   component={() => <Redirect to="/admin/kyc" />} />
      <Route path="/admin/clients"     component={() => <Redirect to="/admin/tenants" />} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
