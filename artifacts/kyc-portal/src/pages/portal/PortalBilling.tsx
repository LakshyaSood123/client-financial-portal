import { PortalShell } from "./PortalShell";
import { BillingTab } from "@/components/dashboard/tabs/BillingTab";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function PortalBilling() {
  const mobile = useMediaQuery("(max-width: 767px)");

  return (
    <PortalShell
      title="Billing"
      subtitle="Balance, credit ledger, plan details, and payment history"
      showRail={false}
    >
      {!mobile && (
        <BackendPlaceholder
          type="mock"
          description="Displaying illustrative billing data. Connect portal billing endpoints to see live balance and ledger."
        />
      )}
      <BillingTab />
    </PortalShell>
  );
}
