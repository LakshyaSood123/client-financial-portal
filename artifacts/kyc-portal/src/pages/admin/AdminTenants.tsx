import { motion } from "framer-motion";
import { AdminLayout, SURF_SUPPORT, SURF_DEFAULT, TEXT, MUTED, cardShell, DARK_1 } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { Search, Filter, Building2, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

const MOCK_TENANTS = [
  { id: "ten_4x8a", name: "Acme Corp Ltd",   plan: "Growth",  status: "ACTIVE",    kyb: "Verified",   joined: "Jan 15 2026" },
  { id: "ten_9mNq", name: "Nova Ventures",   plan: "Starter", status: "ACTIVE",    kyb: "Pending",    joined: "Mar 01 2026" },
  { id: "ten_7bRp", name: "GlobalPay Inc",   plan: "Growth",  status: "BLOCKED",   kyb: "Failed",     joined: "Nov 10 2025" },
  { id: "ten_5xKq", name: "David Chen",      plan: "Starter", status: "ACTIVE",    kyb: "Verified",   joined: "Feb 22 2026" },
  { id: "ten_3mNb", name: "Vertex Capital",  plan: "Custom",  status: "SUSPENDED", kyb: "Under Review", joined: "Oct 05 2025" },
];

const ST_MAP: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  ACTIVE:    { color: "#4ade80", bg: "rgba(74,222,128,0.12)",   icon: CheckCircle2 },
  BLOCKED:   { color: "#f87171", bg: "rgba(248,113,113,0.12)",  icon: XCircle },
  SUSPENDED: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",   icon: AlertTriangle },
  PENDING:   { color: "#94a3b8", bg: "rgba(148,163,184,0.12)",  icon: Clock },
};

export default function AdminTenants() {
  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>
          Tenants
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: MUTED }}>
          Registered tenants, KYB status, plan tier, and operational state.
        </p>

        <BackendPlaceholder
          type="pending"
          description="Tenant list requires the admin BFF tenant list endpoint. Displaying illustrative mock data."
        />

        {/* Filter row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8,
            background: SURF_SUPPORT, borderRadius: 10, padding: "8px 14px",
            border: "1px solid rgba(13,18,33,0.07)",
          }}>
            <Search style={{ width: 14, height: 14, color: MUTED }} />
            <input placeholder="Search tenants by name, ID, or plan…" style={{
              background: "transparent", border: "none", outline: "none",
              fontSize: 13, color: TEXT, fontFamily: "'Satoshi', sans-serif", width: "100%",
            }} />
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            borderRadius: 10, border: "1px solid rgba(13,18,33,0.1)", background: SURF_SUPPORT,
            color: MUTED, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", fontWeight: 600, fontSize: 13,
          }}>
            <Filter style={{ width: 14, height: 14 }} /> Filter
          </button>
        </div>

        {/* Table */}
        <div style={{ ...cardShell, background: SURF_DEFAULT, overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "120px 1fr 100px 100px 120px 130px",
            padding: "10px 20px", borderBottom: "1px solid rgba(13,18,33,0.07)",
          }}>
            {["Tenant ID", "Name", "Plan", "KYB", "Status", "Joined"].map(h => (
              <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {h}
              </span>
            ))}
          </div>

          {MOCK_TENANTS.map((t, i) => {
            const st = ST_MAP[t.status] ?? ST_MAP.PENDING;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: "grid", gridTemplateColumns: "120px 1fr 100px 100px 120px 130px",
                  padding: "13px 20px", alignItems: "center",
                  borderBottom: i < MOCK_TENANTS.length - 1 ? "1px solid rgba(13,18,33,0.05)" : "none",
                  background: SURF_SUPPORT,
                }}
              >
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: MUTED }}>{t.id}</code>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: DARK_1,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Building2 style={{ width: 13, height: 13, color: "#94a3b8" }} />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: TEXT }}>{t.name}</span>
                </div>
                <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>{t.plan}</span>
                <span style={{ fontSize: 12.5, color: t.kyb === "Verified" ? "#4ade80" : t.kyb === "Failed" ? "#f87171" : MUTED }}>
                  {t.kyb}
                </span>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: st.bg, borderRadius: 20, padding: "3px 10px", width: "fit-content",
                }}>
                  <st.icon style={{ width: 11, height: 11, color: st.color }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: st.color }}>{t.status}</span>
                </div>
                <span style={{ fontSize: 12, color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}>{t.joined}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
