import { PortalShell } from "./PortalShell";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { CheckCircle2, Globe, Mail, Shield, UserRound } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const panel: React.CSSProperties = {
  background: "#F7F3EE",
  borderRadius: 18,
  border: "1px solid rgba(120,90,50,0.08)",
  padding: 22,
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 18,
};

const headerIcon: React.CSSProperties = {
  width: 18,
  height: 18,
  color: "#F97316",
};

const panelTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 800,
  color: "#1C1917",
};

const panelSubtitle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 12.5,
  color: "#8B7355",
};

const fieldGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const fieldCard: React.CSSProperties = {
  background: "#FAF8F4",
  borderRadius: 14,
  padding: 16,
};

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#A09080",
  marginBottom: 6,
};

const fieldValue: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#1C1917",
};

const toggleRow: React.CSSProperties = {
  background: "#FAF8F4",
  borderRadius: 14,
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const toggleOn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: "#22C55E",
  fontWeight: 700,
  fontSize: 12.5,
};

const NOTIFICATION_ITEMS = [
  {
    title: "Billing threshold alerts",
    detail: "Sends a notification when the balance drops below the soft threshold.",
  },
  {
    title: "Usage limit reached",
    detail: "Sends a notification as soon as daily or cycle usage crosses the configured limit.",
  },
  {
    title: "Webhook delivery failures",
    detail: "Sends a notification when endpoint deliveries fail or degrade.",
  },
  {
    title: "Compliance review updates",
    detail: "Sends a notification when KYB review status or document requests change.",
  },
];

export default function PortalSettings() {
  const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <PortalShell title="Settings" subtitle="Tenant profile, notification preferences, and environment configuration" showRail={false}>
      {!mobile && (
        <BackendPlaceholder
          type="mock"
          description="Displaying illustrative settings. Live profile and environment controls require the tenant settings and notification APIs."
        />
      )}

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 14 : 20 }}>
        <div style={panel}>
          <div style={headerRow}>
            <UserRound style={headerIcon} />
            <div>
              <h2 style={panelTitle}>Tenant Profile</h2>
              <p style={panelSubtitle}>Primary organization metadata exposed to the portal.</p>
            </div>
          </div>
          <div style={{ ...fieldGrid, gridTemplateColumns: mobile ? "1fr" : "1fr 1fr" }}>
            {[
              ["Tenant ID", "ten_4x8a"],
              ["Legal name", "Anime Corp Ltd"],
              ["Plan", "Growth"],
              ["Jurisdiction", "United Kingdom"],
            ].map(([label, value]) => (
              <div key={label} style={fieldCard}>
                <div style={fieldLabel}>{label}</div>
                <div style={fieldValue}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <div style={headerRow}>
            <Globe style={headerIcon} />
            <div>
              <h2 style={panelTitle}>Environment Access</h2>
              <p style={panelSubtitle}>Spec-aligned view of sandbox and production access.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Sandbox", "Enabled", "#22C55E"],
              ["Production", "Enabled", "#22C55E"],
              ["Webhook secret rotation", "Due in 9 days", "#F59E0B"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 14, background: "#FAF8F4" }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1C1917" }}>{label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <div style={headerRow}>
            <Mail style={headerIcon} />
            <div>
              <h2 style={panelTitle}>Notifications</h2>
              <p style={panelSubtitle}>Channels expected by the notifications dispatcher documents.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {NOTIFICATION_ITEMS.map((item) => (
              <div key={item.title} style={{ ...toggleRow, alignItems: mobile ? "flex-start" : "center", flexDirection: mobile ? "column" : "row", gap: mobile ? 10 : 16 }}>
                <div>
                  <div style={{ fontSize: 13.5, color: "#1C1917", fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: 11.5, color: "#8B7355", marginTop: 3 }}>{item.detail}</div>
                </div>
                <div style={toggleOn}>
                  <CheckCircle2 style={{ width: 14, height: 14 }} />
                  Enabled
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <div style={headerRow}>
            <Shield style={headerIcon} />
            <div>
              <h2 style={panelTitle}>Security Controls</h2>
              <p style={panelSubtitle}>Key rotation and contact verification checkpoints.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Primary contact verified", "Mar 18, 2026"],
              ["Last API key rotation", "Mar 22, 2026"],
              ["Next review window", "Jun 18, 2026"],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: "14px 16px", borderRadius: 14, background: "#FAF8F4" }}>
                <div style={fieldLabel}>{label}</div>
                <div style={fieldValue}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
