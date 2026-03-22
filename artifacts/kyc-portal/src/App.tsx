import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import AdminOverview from "@/pages/admin/AdminOverview";
import KYCQueue from "@/pages/admin/KYCQueue";
import ClientManagement from "@/pages/admin/ClientManagement";
import RiskAlerts from "@/pages/admin/RiskAlerts";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Client routes */}
      <Route path="/" component={Dashboard} />
      <Route path="/usage" component={Dashboard} />
      <Route path="/webhooks" component={Dashboard} />
      <Route path="/billing" component={Dashboard} />
      <Route path="/api-keys" component={Dashboard} />
      <Route path="/audit-logs" component={Dashboard} />
      <Route path="/kyb-upload" component={Dashboard} />

      {/* Admin routes */}
      <Route path="/admin" component={AdminOverview} />
      <Route path="/admin/kyc-queue" component={KYCQueue} />
      <Route path="/admin/clients" component={ClientManagement} />
      <Route path="/admin/risk" component={RiskAlerts} />
      <Route path="/admin/analytics" component={AdminOverview} />
      <Route path="/admin/audit" component={AdminOverview} />
      <Route path="/admin/settings" component={AdminOverview} />

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
