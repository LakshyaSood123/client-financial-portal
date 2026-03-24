import { PortalShell } from "./PortalShell";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

export default function PortalStats() {
  return (
    <PortalShell
      title="Account Overview"
      subtitle="KYB progress, integration health, billing status, and recent activity"
    >
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative data. Connect VITE_PORTAL_API_BASE to see live stats from GET /portal/stats."
      />
      <OverviewTab />
    </PortalShell>
  );
}
