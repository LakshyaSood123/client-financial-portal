import { motion } from "framer-motion";
import { Activity, Database, ServerCog, ShieldAlert } from "lucide-react";
import { AdminLayout, SURF_ANALYTIC, SURF_DEFAULT, SURF_SUPPORT, TEXT, MUTED, cardShell } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

const HEALTH_CARDS = [
  { label: "API health", value: "OK", icon: Activity, color: "#22C55E" },
  { label: "Queue lag", value: "3m", icon: ServerCog, color: "#2563eb" },
  { label: "DB replicas", value: "2/2", icon: Database, color: "#F97316" },
  { label: "Open incidents", value: "0", icon: ShieldAlert, color: "#22C55E" },
];

export default function AdminPlatformOps() {
  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>Platform Ops</h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: MUTED }}>
          Internal runtime health, dependency surfaces, and operational readiness placeholders.
        </p>

        <BackendPlaceholder
          type="pending"
          description="Platform ops needs observability and control-plane health endpoints. The data below is intentionally illustrative."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {HEALTH_CARDS.map((card, index) => (
            <motion.div key={card.label} className="admin-panel admin-panel-hover admin-kpi" style={{ ...cardShell, background: SURF_DEFAULT, padding: 20 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + index * 0.06 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div className="admin-kpi-icon" style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <card.icon style={{ width: 15, height: 15, color: card.color }} />
                </div>
                <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>{card.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TEXT }}>{card.value}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="admin-panel admin-panel-subtle" style={{ ...cardShell, background: SURF_SUPPORT, padding: 24 }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 800, color: TEXT }}>Operational Notes</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: MUTED, lineHeight: 1.6 }}>
              The observability notes in the embedded docs mention queue latency, webhook replay safety, and retry telemetry as platform concerns. This page is the reserved admin surface for those controls.
            </p>
          </div>
          <div className="admin-panel admin-panel-subtle" style={{ ...cardShell, background: SURF_ANALYTIC, padding: 24 }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 800, color: TEXT }}>Next Backend Slice</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: MUTED, lineHeight: 1.6 }}>
              Wire control-plane health summaries and recent incident metadata so admins can correlate tenant-visible issues with platform state.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
