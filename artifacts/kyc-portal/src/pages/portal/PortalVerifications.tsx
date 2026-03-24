import { PortalShell } from "./PortalShell";
import { VerificationTab } from "@/components/dashboard/tabs/VerificationTab";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

export default function PortalVerifications() {
  return (
    <PortalShell
      title="Verifications"
      subtitle="KYB document status, verification history, and submission tracking"
      showRail={false}
    >
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative verification records. Live data requires portal KYB endpoints."
      />
      <VerificationTab />
    </PortalShell>
  );
}
