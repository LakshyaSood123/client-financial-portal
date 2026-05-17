import { PortalShell } from "./PortalShell";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function PortalStats() {
  const isPhone = useMediaQuery("(max-width: 768px)");

  return (
    <PortalShell
      title="Good evening, Client"
      subtitle="Environment access, onboarding gates, balance controls, and recent platform activity"
      showRail={true}
    >
      {!isPhone && (
        <BackendPlaceholder
          type="mock"
          description="Displaying illustrative tenant state based on the embedded frontend spec. Connect VITE_PORTAL_API_BASE to replace these values with live overview data."
        />
      )}
      <OverviewTab />
    </PortalShell>
  );
}
