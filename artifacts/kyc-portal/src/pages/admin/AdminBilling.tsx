import { motion } from "framer-motion";
import { CreditCard, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { AdminLayout, SURF_DEFAULT, SURF_ANALYTIC, TEXT, MUTED, cardShell, DARK_1 } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

const KPI_ITEMS = [
  { label: "MRR (Mock)", value: "₹4.2L", icon: TrendingUp, color: "#4ade80", note: "illustrative" },
  { label: "Active Plans", value: "2,847", icon: CreditCard, color: "#60a5fa", note: "illustrative" },
  { label: "Credit Overages", value: "14", icon: AlertCircle, color: "#fbbf24", note: "illustrative" },
  { label: "Zero-balance", value: "3", icon: DollarSign, color: "#f87171", note: "illustrative" },
];

export default function AdminBilling() {
  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>
          Billing Operations
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: MUTED }}>
          Tenant billing health, credit balances, overages, and revenue metrics.
        </p>

        <BackendPlaceholder
          type="pending"
          description="Admin billing dashboard requires admin BFF billing endpoints. Data below is illustrative only."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {KPI_ITEMS.map((kpi, index) => (
            <motion.div key={kpi.label} className="admin-panel admin-panel-hover admin-kpi" style={{ ...cardShell, background: SURF_DEFAULT, padding: 20 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + index * 0.06 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className="admin-kpi-icon" style={{ width: 32, height: 32, borderRadius: 10, background: DARK_1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <kpi.icon style={{ width: 15, height: 15, color: kpi.color }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em", marginBottom: 2 }}>{kpi.value}</div>
              <span style={{ fontSize: 11, color: MUTED, fontStyle: "italic" }}>{kpi.note}</span>
            </motion.div>
          ))}
        </div>

        <div className="admin-panel admin-panel-subtle ledger-placeholder" style={{ ...cardShell, background: SURF_ANALYTIC, padding: 32, textAlign: "center", minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 28px rgba(10,15,24,0.07)" }}>
          <BackendPlaceholder
            type="pending"
            title="Ledger Table — Backend Required"
            description="A full tenant billing ledger, credit history, and invoice list will render here once admin billing endpoints are connected."
          />
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
            Expected data: tenant ID, plan tier, monthly credit, used, overages, last invoice date, payment status.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
