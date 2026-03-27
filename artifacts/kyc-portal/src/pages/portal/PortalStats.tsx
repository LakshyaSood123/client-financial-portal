import { PortalShell } from "./PortalShell";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

export default function PortalStats() {
  return (
    <PortalShell
      title="Good evening, Client"
      subtitle="Environment access, onboarding gates, balance controls, and recent platform activity"
      showRail={true}
    >
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative tenant state based on the embedded frontend spec. Connect VITE_PORTAL_API_BASE to replace these values with live overview data."
      />
      <OverviewTab />
    </PortalShell>
  );
}
