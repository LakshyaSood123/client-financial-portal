import { AdminLayout, SURF_SUPPORT, SURF_DEFAULT, SURF_ANALYTIC, TEXT, MUTED, cardShell, DARK_1 } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { Lock, ShieldAlert, Calendar, FileText } from "lucide-react";

const MOCK_HOLDS = [
  { id: "hold_001", tenant: "Vertex Capital",  tenantId: "ten_3mNb", reason: "Regulatory investigation — jurisdiction",  created: "Mar 10 2026", expires: "Indefinite", status: "active" },
  { id: "hold_002", tenant: "GlobalPay Inc",   tenantId: "ten_7bRp", reason: "Fraud screening hold",                    created: "Feb 28 2026", expires: "Apr 28 2026",  status: "active" },
  { id: "hold_003", tenant: "David Chen",      tenantId: "ten_5xKq", reason: "AML review",                              created: "Jan 15 2026", expires: "Mar 15 2026",  status: "released" },
];

export default function AdminCompliance() {
  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>
          Compliance Holds
        </h1>
        <p style={{ margin: "0 0 6px", fontSize: 13.5, color: MUTED }}>
          Legal holds, retention holds, and regulatory freezes on tenant data and operations.
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(139,92,246,0.1)", borderRadius: 20, padding: "3px 12px", marginBottom: 20,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8b5cf6", display: "block" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6" }}>Compliance-sensitive — internal only</span>
        </div>

        <BackendPlaceholder
          type="pending"
          description="Legal hold management requires admin compliance API endpoints. Displaying mock hold records."
        />

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Active Holds",    value: "2",  icon: Lock,       color: "#f87171" },
            { label: "Released (30d)",  value: "1",  icon: ShieldAlert, color: "#4ade80" },
            { label: "Pending Review",  value: "0",  icon: Calendar,   color: "#fbbf24" },
          ].map(kpi => (
            <div key={kpi.label} style={{ ...cardShell, background: SURF_DEFAULT, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: DARK_1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <kpi.icon style={{ width: 15, height: 15, color: kpi.color }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Holds list */}
        <div style={{ ...cardShell, background: SURF_ANALYTIC, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(13,18,33,0.07)", display: "flex", gap: 8, alignItems: "center" }}>
            <FileText style={{ width: 15, height: 15, color: MUTED }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Hold Records</span>
          </div>
          {MOCK_HOLDS.map((hold, i) => (
            <div
              key={hold.id}
              style={{
                padding: "16px 20px",
                borderBottom: i < MOCK_HOLDS.length - 1 ? "1px solid rgba(13,18,33,0.06)" : "none",
                background: i % 2 === 0 ? SURF_SUPPORT : SURF_DEFAULT,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{hold.tenant}</span>
                    <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, background: "rgba(13,18,33,0.07)", padding: "1px 7px", borderRadius: 5 }}>
                      {hold.tenantId}
                    </code>
                    <span style={{
                      background: hold.status === "active" ? "rgba(248,113,113,0.15)" : "rgba(74,222,128,0.12)",
                      color: hold.status === "active" ? "#f87171" : "#4ade80",
                      borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700,
                      textTransform: "capitalize",
                    }}>
                      {hold.status}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: MUTED }}>{hold.reason}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 2 }}>Created: {hold.created}</div>
                  <div style={{ fontSize: 11.5, color: hold.expires === "Indefinite" ? "#f87171" : MUTED }}>
                    Expires: {hold.expires}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
