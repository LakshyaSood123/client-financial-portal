import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, CheckCircle2, XCircle, Clock, ExternalLink, RefreshCw } from "lucide-react";
import { PortalShell } from "./PortalShell";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { OneTimeSecretReveal, MaskedSecret } from "@/components/shared/OneTimeSecretReveal";

const ENDPOINTS = [
  { id: "wh_1", url: "https://api.acme.io/hooks/kyb",     events: ["kyb.approved","kyb.rejected"],  status: "active",   successRate: 99.1 },
  { id: "wh_2", url: "https://api.acme.io/hooks/billing", events: ["billing.invoice","billing.paid"], status: "active", successRate: 97.4 },
  { id: "wh_3", url: "https://internal.acme.co/hooks",    events: ["*"],                             status: "disabled", successRate: 91.2 },
];

const DELIVERIES = [
  { id: "del_8xKp2", event: "kyb.approved",     endpoint: "wh_1", status: "success", time: "Mar 23, 14:32", attempts: 1 },
  { id: "del_7mNq1", event: "billing.invoice",  endpoint: "wh_2", status: "success", time: "Mar 23, 12:01", attempts: 1 },
  { id: "del_6bRp9", event: "kyb.rejected",     endpoint: "wh_1", status: "failed",  time: "Mar 22, 09:45", attempts: 3 },
  { id: "del_5xKq3", event: "billing.paid",     endpoint: "wh_2", status: "success", time: "Mar 21, 17:10", attempts: 1 },
];

type SecretReveal = { label: string; value: string } | null;

export default function PortalWebhooks() {
  const [reveal, setReveal] = useState<SecretReveal>(null);

  const rotateSecret = (endpointId: string) => {
    const fake = `whsec_${Math.random().toString(36).slice(2, 28)}`;
    setReveal({ label: `Signing secret — ${ENDPOINTS.find(e => e.id === endpointId)?.url}`, value: fake });
  };

  const replayDelivery = (id: string) => {
    console.log("Replay delivery (no-op):", id);
  };

  return (
    <PortalShell
      title="Webhooks"
      subtitle="Manage endpoints, view deliveries, and rotate signing secrets"
      showRail={false}
    >
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative webhook data. Connect portal webhook endpoints to manage live configuration."
      />

      {/* Endpoints section */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1C1917", fontFamily: "'Satoshi', sans-serif" }}>
          Endpoints
        </h2>
        <button style={{
          display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
          borderRadius: 12, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #F97316, #F59E0B)",
          color: "#fff", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 13,
        }}>
          <Plus style={{ width: 14, height: 14 }} /> Add Endpoint
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {ENDPOINTS.map((ep, i) => (
          <motion.div
            key={ep.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: "#FAF8F4", border: "1px solid rgba(120,90,50,0.09)",
              borderRadius: 14, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <ExternalLink style={{ width: 13, height: 13, color: "#F97316", flexShrink: 0 }} />
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#1C1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ep.url}
                </code>
                <span style={{
                  background: ep.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(180,160,120,0.15)",
                  color: ep.status === "active" ? "#22C55E" : "#B0A090",
                  borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700,
                  fontFamily: "'Satoshi', sans-serif", textTransform: "capitalize",
                }}>
                  {ep.status}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ep.events.map(ev => (
                  <span key={ev} style={{
                    background: "rgba(249,115,22,0.08)", borderRadius: 6, padding: "1px 8px",
                    fontSize: 11, color: "#F97316", fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {ev}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: "#A09080", marginBottom: 2, fontFamily: "'Satoshi', sans-serif" }}>Success rate</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ep.successRate > 95 ? "#22C55E" : "#F59E0B", fontFamily: "'Satoshi', sans-serif" }}>
                {ep.successRate}%
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => rotateSecret(ep.id)}
                title="Rotate signing secret"
                style={{ background: "rgba(249,115,22,0.1)", border: "none", borderRadius: 8, cursor: "pointer", padding: "7px 9px", color: "#F97316" }}
              >
                <RotateCcw style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Deliveries */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1C1917", fontFamily: "'Satoshi', sans-serif" }}>
          Recent Deliveries
        </h2>
        <span style={{ fontSize: 12, color: "#B0A090", fontFamily: "'Satoshi', sans-serif" }}>Last 30 days</span>
      </div>

      <div style={{ background: "#F7F3EE", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(120,90,50,0.07)" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 140px 90px 140px 80px",
          padding: "9px 18px", borderBottom: "1px solid rgba(120,90,50,0.07)",
        }}>
          {["Delivery ID", "Event", "Status", "Timestamp", "Actions"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#B0A090", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Satoshi', sans-serif" }}>
              {h}
            </span>
          ))}
        </div>
        {DELIVERIES.map((d, i) => (
          <div
            key={d.id}
            style={{
              display: "grid", gridTemplateColumns: "1fr 140px 90px 140px 80px",
              padding: "12px 18px", alignItems: "center",
              borderBottom: i < DELIVERIES.length - 1 ? "1px solid rgba(120,90,50,0.06)" : "none",
              background: "#FAF8F4",
            }}
          >
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6B5F54" }}>{d.id}</code>
            <span style={{ fontSize: 12, color: "#F97316", fontFamily: "'JetBrains Mono', monospace" }}>{d.event}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {d.status === "success"
                ? <CheckCircle2 style={{ width: 13, height: 13, color: "#22C55E" }} />
                : <XCircle style={{ width: 13, height: 13, color: "#f87171" }} />}
              <span style={{ fontSize: 12, fontWeight: 600, color: d.status === "success" ? "#22C55E" : "#f87171", fontFamily: "'Satoshi', sans-serif", textTransform: "capitalize" }}>
                {d.status}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock style={{ width: 11, height: 11, color: "#B0A090" }} />
              <span style={{ fontSize: 11.5, color: "#8B7355", fontFamily: "'JetBrains Mono', monospace" }}>{d.time}</span>
            </div>
            {d.status === "failed" && (
              <button
                onClick={() => replayDelivery(d.id)}
                style={{ background: "rgba(249,115,22,0.1)", border: "none", borderRadius: 7, cursor: "pointer", padding: "5px 8px", color: "#F97316", display: "flex", alignItems: "center", gap: 5 }}
              >
                <RefreshCw style={{ width: 12, height: 12 }} />
                <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Satoshi', sans-serif" }}>Replay</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {reveal && (
          <OneTimeSecretReveal
            label={reveal.label}
            secretValue={reveal.value}
            onClose={() => setReveal(null)}
          />
        )}
      </AnimatePresence>
    </PortalShell>
  );
}
