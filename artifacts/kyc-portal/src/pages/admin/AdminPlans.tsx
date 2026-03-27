import { BadgeIndianRupee, SlidersHorizontal, Sparkles } from "lucide-react";
import { AdminLayout, SURF_DEFAULT, SURF_SUPPORT, TEXT, MUTED, cardShell } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

const PLANS = [
  { name: "Starter", monthly: "INR 0", allowance: "500 jobs", overage: "Blocked at cap", status: "Default" },
  { name: "Growth", monthly: "INR 250", allowance: "5,000 jobs", overage: "Usage-rated", status: "Popular" },
  { name: "Custom", monthly: "Contract", allowance: "Negotiated", overage: "Manual review", status: "Sales-led" },
];

const STATUS_CLASS: Record<string, string> = {
  Default: "admin-pill admin-pill-neutral",
  Popular: "admin-pill admin-pill-warning",
  "Sales-led": "admin-pill admin-pill-positive",
};

export default function AdminPlans() {
  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>Plans and Overrides</h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: MUTED }}>
          Commercial plans, admission guard defaults, and tenant-level override placeholders.
        </p>

        <BackendPlaceholder
          type="pending"
          description="Admin plan management requires pricing, balance-threshold, and tenant-override endpoints. Data below is illustrative."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {PLANS.map((plan) => (
            <div key={plan.name} className="admin-panel admin-panel-hover admin-kpi plan-card" style={{ ...cardShell, background: SURF_DEFAULT, padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div className="admin-kpi-icon" style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BadgeIndianRupee style={{ width: 16, height: 16, color: "#F97316" }} />
                </div>
                <span className={`text-[11px] font-bold rounded-full px-[10px] py-1 ${STATUS_CLASS[plan.status]}`}>{plan.status}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>Monthly base: {plan.monthly}</div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>Included allowance: {plan.allowance}</div>
              <div style={{ fontSize: 13, color: MUTED }}>Overage policy: {plan.overage}</div>
            </div>
          ))}
        </div>

        <div className="admin-panel admin-panel-subtle" style={{ ...cardShell, background: SURF_SUPPORT, padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <SlidersHorizontal style={{ width: 16, height: 16, color: "#F97316" }} />
              <strong style={{ color: TEXT }}>Tenant override model</strong>
            </div>
            <p style={{ margin: 0, color: MUTED, fontSize: 13.5, lineHeight: 1.6 }}>
              The embedded docs call for tenant-specific overrides to pricing, thresholds, and operational admission. This screen reserves that admin surface.
            </p>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Sparkles style={{ width: 16, height: 16, color: "#F97316" }} />
              <strong style={{ color: TEXT }}>Suggested next backend slice</strong>
            </div>
            <p style={{ margin: 0, color: MUTED, fontSize: 13.5, lineHeight: 1.6 }}>
              Add plan snapshot APIs plus per-tenant override CRUD so this screen can move from placeholder state to live controls.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
