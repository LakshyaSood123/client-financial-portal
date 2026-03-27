import { motion } from "framer-motion";
import { BellRing, ChevronRight, Mail, MessageSquareText, TriangleAlert } from "lucide-react";
import { useLocation } from "wouter";
import { AdminLayout, SURF_DEFAULT, SURF_SUPPORT, TEXT, MUTED, cardShell } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { MOCK_TENANTS, focusDefinitions, type NotificationFocusKey } from "./adminTenantData";

const ROUTES = [
  {
    name: "Billing threshold alerts",
    channel: "Email",
    owner: "finance@acme.io",
    status: "Active",
    focusKey: "billing-alerts" as NotificationFocusKey,
  },
  {
    name: "Webhook failure summaries",
    channel: "Slack",
    owner: "#ops-alerts",
    status: "Active",
    focusKey: "webhook-failures" as NotificationFocusKey,
  },
  {
    name: "Compliance review outcomes",
    channel: "Email",
    owner: "compliance@acme.io",
    status: "Needs template",
    focusKey: "compliance-review" as NotificationFocusKey,
  },
];

export default function AdminNotifications() {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>
          Notifications
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: MUTED }}>
          Dispatcher routes, tenant-facing templates, and notification health placeholders.
        </p>

        <BackendPlaceholder
          type="pending"
          description="Notification routing requires dispatcher and template endpoints. The docs bundle identifies the target channels shown here."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Active routes", value: "12", icon: BellRing, color: "#2563eb" },
            { label: "Email templates", value: "8", icon: Mail, color: "#22C55E" },
            { label: "Needs attention", value: "2", icon: TriangleAlert, color: "#F59E0B" },
          ].map((card, index) => (
            <motion.div
              key={card.label}
              className="admin-panel admin-panel-hover admin-kpi"
              style={{ ...cardShell, background: SURF_DEFAULT, padding: 20 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.06 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div
                  className="admin-kpi-icon"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <card.icon style={{ width: 15, height: 15, color: card.color }} />
                </div>
                <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>{card.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TEXT }}>{card.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="admin-panel admin-table-shell" style={{ ...cardShell, background: SURF_SUPPORT, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 140px 1fr 140px",
              padding: "12px 20px",
              borderBottom: "1px solid rgba(13,18,33,0.07)",
            }}
          >
            {["Route", "Channel", "Owner", "Status"].map((heading) => (
              <span
                key={heading}
                style={{ fontSize: 10.5, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}
              >
                {heading}
              </span>
            ))}
          </div>

          {ROUTES.map((route, index) => {
            const matchCount = MOCK_TENANTS.filter((tenant) => focusDefinitions[route.focusKey].match(tenant)).length;

            return (
              <motion.button
                key={route.name}
                type="button"
                className="admin-row"
                onClick={() => setLocation(`/admin/tenants?focus=${route.focusKey}`)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 140px 1fr 140px",
                  padding: "14px 20px",
                  alignItems: "center",
                  borderBottom: index < ROUTES.length - 1 ? "1px solid rgba(13,18,33,0.05)" : "none",
                  background: SURF_DEFAULT,
                  animationDelay: `${index * 50}ms`,
                  width: "100%",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MessageSquareText style={{ width: 15, height: 15, color: "#F97316", flexShrink: 0 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{route.name}</span>
                    <span style={{ fontSize: 12, color: MUTED }}>
                      {matchCount} {matchCount === 1 ? "tenant" : "tenants"} in current scope - Open in Tenants
                    </span>
                  </div>
                </div>
                <span className="admin-pill admin-pill-neutral" style={{ width: "fit-content", fontSize: 12.5, color: MUTED }}>
                  {route.channel}
                </span>
                <span style={{ fontSize: 12.5, color: MUTED }}>{route.owner}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span
                    className={route.status === "Active" ? "admin-pill admin-pill-positive" : "admin-pill admin-pill-warning"}
                    style={{ width: "fit-content" }}
                  >
                    {route.status}
                  </span>
                  <ChevronRight style={{ width: 15, height: 15, color: MUTED, flexShrink: 0 }} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
