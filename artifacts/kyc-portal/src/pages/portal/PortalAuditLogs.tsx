import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Filter, Calendar, Search } from "lucide-react";
import { PortalShell } from "./PortalShell";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

const LOGS = [
  { id: "evt_001", ts: "2026-03-23 14:32:01", event: "api_key.created",     actor: "user@acme.io",       resource: "key_3xKp2", ip: "203.0.113.1"  },
  { id: "evt_002", ts: "2026-03-23 12:01:45", event: "webhook.delivered",   actor: "system",             resource: "wh_1",      ip: "—"             },
  { id: "evt_003", ts: "2026-03-22 09:14:30", event: "kyb.submitted",       actor: "user@acme.io",       resource: "kyb_8mNq",  ip: "203.0.113.1"  },
  { id: "evt_004", ts: "2026-03-21 17:50:22", event: "billing.credit_used", actor: "system",             resource: "txn_4bRp",  ip: "—"             },
  { id: "evt_005", ts: "2026-03-21 11:33:14", event: "api_key.rotated",     actor: "user@acme.io",       resource: "key_7bRp1", ip: "203.0.113.2"  },
  { id: "evt_006", ts: "2026-03-20 08:22:55", event: "webhook.secret_rotated", actor: "user@acme.io",   resource: "wh_2",      ip: "203.0.113.1"  },
  { id: "evt_007", ts: "2026-03-19 16:04:11", event: "portal.login",        actor: "user@acme.io",       resource: "session",   ip: "203.0.113.1"  },
  { id: "evt_008", ts: "2026-03-18 13:40:02", event: "kyb.document_uploaded", actor: "user@acme.io",    resource: "kyb_8mNq",  ip: "203.0.113.1"  },
];

const EVENT_COLORS: Record<string, string> = {
  "api_key.created":         "#F97316",
  "api_key.rotated":         "#F59E0B",
  "webhook.delivered":       "#8b5cf6",
  "webhook.secret_rotated":  "#a78bfa",
  "kyb.submitted":           "#22C55E",
  "kyb.document_uploaded":   "#4ade80",
  "billing.credit_used":     "#38bdf8",
  "portal.login":            "#94a3b8",
};

export default function PortalAuditLogs() {
  const [search, setSearch] = useState("");
  const filtered = LOGS.filter(l =>
    l.event.includes(search.toLowerCase()) ||
    l.actor.includes(search.toLowerCase()) ||
    l.id.includes(search)
  );

  return (
    <PortalShell
      title="Audit Logs"
      subtitle="Complete record of portal actions, API events, and system operations"
      showRail={false}
    >
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative audit events. Live logs require portal audit log endpoints (GET /portal/audit-logs)."
      />

      {/* Filter / export row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8,
          background: "#F7F3EE", borderRadius: 10, padding: "8px 14px",
          border: "1px solid rgba(120,90,50,0.1)",
        }}>
          <Search style={{ width: 14, height: 14, color: "#B0A090", flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by event type, actor, or ID…"
            style={{
              background: "transparent", border: "none", outline: "none",
              fontSize: 13, color: "#1C1917", fontFamily: "'Satoshi', sans-serif", width: "100%",
            }}
          />
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderRadius: 10, border: "1px solid rgba(120,90,50,0.12)",
          background: "#F7F3EE", color: "#6B5F54", cursor: "pointer",
          fontFamily: "'Satoshi', sans-serif", fontWeight: 600, fontSize: 13,
        }}>
          <Calendar style={{ width: 14, height: 14 }} /> Date Range
        </button>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderRadius: 10, border: "1px solid rgba(120,90,50,0.12)",
          background: "#F7F3EE", color: "#6B5F54", cursor: "pointer",
          fontFamily: "'Satoshi', sans-serif", fontWeight: 600, fontSize: 13,
        }}>
          <Filter style={{ width: 14, height: 14 }} /> Filter
        </button>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
          borderRadius: 10, border: "none",
          background: "linear-gradient(135deg, #F97316, #F59E0B)",
          color: "#fff", cursor: "pointer",
          fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 13,
        }}>
          <Download style={{ width: 14, height: 14 }} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#F7F3EE", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(120,90,50,0.07)" }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "100px 180px 180px 1fr 120px 110px",
          padding: "10px 20px", borderBottom: "1px solid rgba(120,90,50,0.08)",
        }}>
          {["Event ID", "Timestamp", "Event Type", "Actor", "Resource", "IP"].map(h => (
            <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: "#B0A090", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Satoshi', sans-serif" }}>
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#C4B5A5", fontSize: 13.5, fontFamily: "'Satoshi', sans-serif" }}>
            No events match your search.
          </div>
        ) : filtered.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            style={{
              display: "grid", gridTemplateColumns: "100px 180px 180px 1fr 120px 110px",
              padding: "12px 20px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(120,90,50,0.05)" : "none",
              background: "#FAF8F4",
            }}
          >
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#8B7355" }}>{log.id}</code>
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#8B7355" }}>{log.ts}</code>
            <span style={{
              fontSize: 12, fontWeight: 600, color: EVENT_COLORS[log.event] ?? "#A09080",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {log.event}
            </span>
            <span style={{ fontSize: 13, color: "#6B5F54", fontFamily: "'Satoshi', sans-serif" }}>{log.actor}</span>
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#8B7355" }}>{log.resource}</code>
            <span style={{ fontSize: 12, color: "#B0A090", fontFamily: "'JetBrains Mono', monospace" }}>{log.ip}</span>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#C4B5A5", fontFamily: "'Satoshi', sans-serif" }}>
          Showing {filtered.length} of {LOGS.length} events (illustrative)
        </span>
        <span style={{ fontSize: 12, color: "#C4B5A5", fontFamily: "'Satoshi', sans-serif" }}>
          Logs are retained per your plan's retention policy.
        </span>
      </div>
    </PortalShell>
  );
}
