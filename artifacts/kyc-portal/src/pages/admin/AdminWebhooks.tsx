import { motion } from "framer-motion";
import { Webhook, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { AdminLayout, SURF_SUPPORT, SURF_DEFAULT, SURF_ANALYTIC, TEXT, MUTED, cardShell } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

const MOCK_WEBHOOKS = [
  { id: "awh_001", name: "Compliance System", url: "https://compliance.internal/hooks", events: ["hold.created", "tenant.blocked"], status: "active", deliveries: 234, failures: 2 },
  { id: "awh_002", name: "Billing Aggregator", url: "https://billing.internal/hooks", events: ["plan.changed", "credit.applied"], status: "active", deliveries: 892, failures: 0 },
  { id: "awh_003", name: "Audit Export Service", url: "https://audit.internal/hooks", events: ["*"], status: "degraded", deliveries: 150, failures: 18 },
];

export default function AdminWebhooks() {
  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>
          Admin Webhooks
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: MUTED }}>
          Internal platform-to-platform webhook integrations. Not tenant-facing.
        </p>

        <BackendPlaceholder
          type="pending"
          description="Admin webhook management requires admin BFF webhook endpoints. Displaying illustrative configuration."
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_WEBHOOKS.map((wh, i) => {
            const statusColor = wh.status === "active" ? "#4ade80" : wh.status === "degraded" ? "#fbbf24" : "#f87171";
            const StatusIcon = wh.status === "active" ? CheckCircle2 : wh.status === "degraded" ? AlertTriangle : XCircle;
            const pillClass = wh.status === "active" ? "admin-pill admin-pill-positive" : wh.status === "degraded" ? "admin-pill admin-pill-warning" : "admin-pill admin-pill-negative";
            return (
              <motion.div key={wh.id} className="admin-panel admin-panel-hover" style={{ ...cardShell, background: SURF_DEFAULT, padding: 20, display: "flex", alignItems: "flex-start", gap: 16 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.06 }}>
                <div className="admin-kpi-icon" style={{ width: 36, height: 36, borderRadius: 10, background: SURF_ANALYTIC, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Webhook style={{ width: 16, height: 16, color: MUTED }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{wh.name}</span>
                    <div className={`flex items-center gap-1 ${pillClass}`}>
                      <StatusIcon style={{ width: 12, height: 12, color: statusColor }} />
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: statusColor, textTransform: "capitalize" }}>{wh.status}</span>
                    </div>
                  </div>
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: MUTED, display: "block", marginBottom: 8 }}>{wh.url}</code>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {wh.events.map((ev) => (
                      <span key={ev} className="admin-token" style={{ background: SURF_SUPPORT, borderRadius: 6, padding: "2px 8px", fontSize: 11, color: MUTED, fontFamily: "'JetBrains Mono', monospace", border: "1px solid rgba(13,18,33,0.07)" }}>
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 3 }}>Deliveries</div>
                  <motion.div style={{ fontSize: 18, fontWeight: 800, color: TEXT }} initial={{ opacity: 0.4, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + i * 0.08 }}>
                    {wh.deliveries}
                  </motion.div>
                  {wh.failures > 0 && <div style={{ fontSize: 12, color: "#f87171", marginTop: 2 }}>{wh.failures} failures</div>}
                </div>
              </motion.div>
            );
          })}
        </div>

        <p style={{ marginTop: 20, fontSize: 12, color: MUTED, fontStyle: "italic" }}>
          Signing secret rotation for admin webhooks follows the one-time reveal pattern.
          Secret management actions are logged to the control-plane event stream.
        </p>
      </div>
    </AdminLayout>
  );
}
