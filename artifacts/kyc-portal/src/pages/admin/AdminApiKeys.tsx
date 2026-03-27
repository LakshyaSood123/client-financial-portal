import { Key, AlertTriangle } from "lucide-react";
import { AdminLayout, SURF_SUPPORT, SURF_DEFAULT, TEXT, MUTED, cardShell } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

export default function AdminApiKeys() {
  return (
    <AdminLayout>
      <div style={{ padding: "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>
          Admin API Keys
        </h1>
        <p style={{ margin: "0 0 8px", fontSize: 13.5, color: MUTED }}>
          Platform-level API keys for internal integrations. Not visible to tenants.
        </p>

        <div className="admin-restricted-banner" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(248,113,113,0.1)", borderRadius: 10, padding: "8px 14px", border: "1px solid rgba(248,113,113,0.2)", marginBottom: 20, width: "fit-content" }}>
          <AlertTriangle style={{ width: 14, height: 14, color: "#f87171", flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#f87171" }}>
            These keys carry platform-level permissions. Treat with extreme care. Rotation logs are retained.
          </span>
        </div>

        <BackendPlaceholder
          type="pending"
          description="Admin API key management requires admin BFF endpoints. One-time secret reveal UX will be applied on creation/rotation."
        />

        <div className="admin-panel admin-table-shell" style={{ ...cardShell, background: SURF_DEFAULT, padding: 24, opacity: 0.82 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Key style={{ width: 18, height: 18, color: MUTED }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Platform Keys</span>
          </div>
          {["Integration-Webhook-Delivery", "Compliance-Export-Service", "Analytics-Aggregation"].map((name, index) => (
            <div key={name} className="admin-row api-key-row" style={{ background: SURF_SUPPORT, borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", animationDelay: `${index * 50}ms` }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT, marginBottom: 3 }}>{name}</div>
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: MUTED, letterSpacing: "0.02em" }}>
                  sk_adm_••••••••••••••••
                </code>
              </div>
              <span style={{ fontSize: 11.5, color: MUTED, fontStyle: "italic", minWidth: 110, textAlign: "right" }}>backend pending</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
