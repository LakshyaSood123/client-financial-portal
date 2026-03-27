import { PortalShell } from "./PortalShell";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { CheckCircle2, Plus, RefreshCw, RotateCcw, TriangleAlert, Webhook, XCircle } from "lucide-react";

const ENDPOINTS = [
  { url: "https://api.acme.io/hooks/kyb", status: "Active", successRate: "99.1%", events: ["kyb.approved", "kyb.rejected"] },
  { url: "https://api.acme.io/hooks/billing", status: "Active", successRate: "97.4%", events: ["billing.invoice", "billing.paid"] },
  { url: "https://internal.acme.co/hooks", status: "Degraded", successRate: "91.2%", events: ["*"] },
];

const DELIVERIES = [
  { id: "del_8xKp2", event: "kyb.approved", status: "Success", timestamp: "Mar 23, 14:32" },
  { id: "del_7mNq1", event: "billing.invoice", status: "Success", timestamp: "Mar 23, 12:01" },
  { id: "del_6bRp9", event: "kyb.rejected", status: "Failed", timestamp: "Mar 22, 09:45" },
  { id: "del_5xKq3", event: "billing.paid", status: "Success", timestamp: "Mar 21, 17:10" },
];

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "10px 16px",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  color: "#fff",
  fontFamily: "'Satoshi', sans-serif",
  fontWeight: 700,
};

const ghostButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid rgba(120,90,50,0.12)",
  background: "rgba(120,90,50,0.04)",
  color: "#8B7355",
  cursor: "pointer",
  fontFamily: "'Satoshi', sans-serif",
  fontWeight: 600,
};

const primaryGhostButton: React.CSSProperties = {
  ...ghostButton,
  background: "rgba(249,115,22,0.1)",
  color: "#F97316",
};

const iconButton: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 12,
  border: "none",
  background: "rgba(249,115,22,0.1)",
  color: "#F97316",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function PortalWebhooks() {
  return (
    <PortalShell title="Webhooks" subtitle="Manage endpoints, inspect delivery health, and rotate signing secrets" showRail={false}>
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative webhook configuration. Live management should connect to the documented webhook endpoints and ops runbook."
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1C1917" }}>Endpoints</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#A09080" }}>Primary delivery targets and their recent health.</p>
        </div>
        <button className="cta-3d btn-primary" style={primaryButton}>
          <Plus style={{ width: 14, height: 14 }} /> Add Endpoint
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {ENDPOINTS.map((endpoint) => {
          const healthy = endpoint.status === "Active";
          return (
            <div
              key={endpoint.url}
              style={{
                background: "#FAF8F4",
                border: "1px solid rgba(120,90,50,0.08)",
                borderRadius: 18,
                padding: 20,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Webhook style={{ width: 16, height: 16, color: "#F97316" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <code style={{ fontSize: 13.5, fontWeight: 700, color: "#1C1917" }}>{endpoint.url}</code>
                  <div className={`status-badge-3d ${healthy ? "badge-active" : "badge-queued"}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: healthy ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)", color: healthy ? "#22C55E" : "#F59E0B", borderRadius: 999, padding: "4px 10px", boxShadow: healthy ? "0 2px 8px rgba(34,197,94,0.35)" : "0 2px 8px rgba(245,158,11,0.35)" }}>
                    {healthy ? <CheckCircle2 style={{ width: 12, height: 12 }} /> : <TriangleAlert style={{ width: 12, height: 12 }} />}
                    <span style={{ fontSize: 11.5, fontWeight: 700 }}>{endpoint.status}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {endpoint.events.map((event) => (
                    <span key={event} style={{ fontSize: 11.5, color: "#F97316", background: "rgba(249,115,22,0.08)", borderRadius: 8, padding: "4px 8px" }}>
                      {event}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#A09080", marginBottom: 4 }}>Success rate</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: healthy ? "#22C55E" : "#F59E0B", letterSpacing: "-0.02em" }}>{endpoint.successRate}</div>
              </div>
              <button className="cta-3d" style={iconButton}>
                <RotateCcw style={{ width: 14, height: 14 }} />
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background: "#F7F3EE", borderRadius: 18, border: "1px solid rgba(120,90,50,0.08)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid rgba(120,90,50,0.08)" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1C1917" }}>Recent Deliveries</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#A09080" }}>Last 30 days of delivery attempts for tenant-facing webhook events.</p>
          </div>
          <button className="cta-3d" style={ghostButton}>
            <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 140px 170px 100px", padding: "12px 20px", borderBottom: "1px solid rgba(120,90,50,0.08)" }}>
          {["Delivery ID", "Event", "Status", "Timestamp", "Actions"].map((heading) => (
            <span key={heading} style={{ fontSize: 10.5, fontWeight: 700, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {heading}
            </span>
          ))}
        </div>

        {DELIVERIES.map((delivery, index) => {
          const ok = delivery.status === "Success";
          return (
            <div
              className="data-row-3d"
              key={delivery.id}
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr 140px 170px 100px",
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: index < DELIVERIES.length - 1 ? "1px solid rgba(120,90,50,0.06)" : "none",
                background: "#FAF8F4",
                animationDelay: `${index * 60}ms`,
              }}
            >
              <code style={{ fontSize: 12, color: "#8B7355" }}>{delivery.id}</code>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#F97316" }}>{delivery.event}</span>
              <div className={`status-badge-3d ${ok ? "badge-completed" : "badge-failed"}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content", padding: "4px 10px", borderRadius: 999, background: ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: ok ? "#22C55E" : "#ef4444", boxShadow: ok ? "0 2px 8px rgba(34,197,94,0.35)" : "0 2px 8px rgba(239,68,68,0.35)" }}>
                {ok ? <CheckCircle2 style={{ width: 12, height: 12 }} /> : <XCircle style={{ width: 12, height: 12 }} />}
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>{delivery.status}</span>
              </div>
              <span style={{ fontSize: 12.5, color: "#8B7355" }}>{delivery.timestamp}</span>
              <button className="cta-3d" style={ok ? ghostButton : primaryGhostButton}>{ok ? "Inspect" : "Replay"}</button>
            </div>
          );
        })}
      </div>
    </PortalShell>
  );
}
