import { PortalShell } from "./PortalShell";
import { VerificationTab } from "@/components/dashboard/tabs/VerificationTab";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function PortalCompliance() {
  const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <PortalShell title="Compliance" subtitle="KYB status, review history, risk signals, and document evidence" showRail={false}>
      {!mobile && (
        <BackendPlaceholder
          type="mock"
          description="Displaying illustrative compliance data. Live data should map to tenant KYB, review, and hold-management endpoints described in the embedded docs."
        />
      )}
      <VerificationTab />
    </PortalShell>
  );
}
