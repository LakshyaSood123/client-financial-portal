import { Activity, Filter, Download } from "lucide-react";
import { AdminLayout, SURF_SUPPORT, SURF_DEFAULT, TEXT, MUTED, cardShell } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

const MOCK_EVENTS = [
  { id: "cpe_001", type: "tenant.created", actor: "admin@nexuskyc.io", ts: "2026-03-23 14:32", severity: "info" },
  { id: "cpe_002", type: "tenant.blocked", actor: "admin@nexuskyc.io", ts: "2026-03-22 09:14", severity: "critical" },
  { id: "cpe_003", type: "hold.created", actor: "compliance@nexuskyc.io", ts: "2026-03-21 11:00", severity: "high" },
  { id: "cpe_004", type: "kyc.manual_approved", actor: "reviewer@nexuskyc.io", ts: "2026-03-21 08:45", severity: "info" },
  { id: "cpe_005", type: "plan.changed", actor: "billing@nexuskyc.io", ts: "2026-03-20 16:20", severity: "info" },
  { id: "cpe_006", type: "api_key.admin_rotated", actor: "admin@nexuskyc.io", ts: "2026-03-19 13:05", severity: "high" },
];

const SEV_STYLE: Record<string, { className: string; color: string }> = {
  info: { className: "admin-pill admin-pill-neutral", color: "#94a3b8" },
  high: { className: "admin-pill admin-pill-warning", color: "#fbbf24" },
  critical: { className: "admin-pill admin-pill-negative", color: "#f87171" },
};

export default function AdminEvents() {
  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>
          Control-Plane Events
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: MUTED }}>
          Internal platform events — tenant lifecycle, compliance actions, and admin operations.
        </p>

        <BackendPlaceholder
          type="pending"
          description="Live control-plane event stream requires admin BFF event endpoints. Displaying illustrative events below."
        />

        <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
          <div className="admin-command-surface" style={{ display: "flex", alignItems: "center", gap: 8, background: SURF_SUPPORT, borderRadius: 10, padding: "8px 14px", flex: 1, border: "1px solid rgba(13,18,33,0.07)" }}>
            <Activity style={{ width: 14, height: 14, color: MUTED }} />
            <input placeholder="Filter by event type, actor…" style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: TEXT, fontFamily: "'Satoshi', sans-serif", width: "100%" }} />
          </div>
          <button className="admin-button" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(13,18,33,0.1)", background: SURF_SUPPORT, color: MUTED, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", fontWeight: 600, fontSize: 13 }}>
            <Filter style={{ width: 14, height: 14 }} /> Filter
          </button>
          <button className="admin-button" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(13,18,33,0.1)", background: SURF_SUPPORT, color: MUTED, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", fontWeight: 600, fontSize: 13 }}>
            <Download style={{ width: 14, height: 14 }} /> Export
          </button>
        </div>

        <div className="admin-panel admin-table-shell" style={{ ...cardShell, background: SURF_DEFAULT, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 200px 1fr 180px 90px", padding: "10px 20px", borderBottom: "1px solid rgba(13,18,33,0.07)" }}>
            {["Event ID", "Type", "Actor", "Timestamp", "Severity"].map((h) => (
              <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {h}
              </span>
            ))}
          </div>
          {MOCK_EVENTS.map((ev, i) => (
            <div key={ev.id} className="admin-row" style={{ display: "grid", gridTemplateColumns: "100px 200px 1fr 180px 90px", padding: "12px 20px", alignItems: "center", borderBottom: i < MOCK_EVENTS.length - 1 ? "1px solid rgba(13,18,33,0.05)" : "none", background: SURF_SUPPORT, animationDelay: `${i * 50}ms` }}>
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: MUTED }}>{ev.id}</code>
              <span style={{ fontSize: 12, color: SEV_STYLE[ev.severity].color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{ev.type}</span>
              <span style={{ fontSize: 13, color: TEXT }}>{ev.actor}</span>
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: MUTED }}>{ev.ts}</code>
              <div className={SEV_STYLE[ev.severity].className} style={{ width: "fit-content" }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: SEV_STYLE[ev.severity].color, textTransform: "capitalize" }}>{ev.severity}</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 14, fontSize: 12, color: MUTED, fontStyle: "italic" }}>
          Control-plane events are retained per compliance policy. Export is restricted to compliance roles.
        </p>
      </div>
    </AdminLayout>
  );
}
