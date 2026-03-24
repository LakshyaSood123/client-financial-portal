import { PortalShell } from "./PortalShell";
import { BillingTab } from "@/components/dashboard/tabs/BillingTab";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

export default function PortalBilling() {
  return (
    <PortalShell
      title="Billing"
      subtitle="Balance, credit ledger, plan details, and payment history"
      showRail={false}
    >
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative billing data. Connect portal billing endpoints to see live balance and ledger."
      />
      <BillingTab />
    </PortalShell>
  );
}
