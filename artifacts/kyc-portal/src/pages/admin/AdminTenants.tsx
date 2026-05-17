import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout, SURF_SUPPORT, SURF_DEFAULT, TEXT, MUTED, cardShell, DARK_1 } from "./AdminLayout";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { Search, Filter, Building2, CheckCircle2, XCircle, Clock, AlertTriangle, Link2, X } from "lucide-react";
import { MOCK_TENANTS, focusDefinitions, type NotificationFocusKey } from "./adminTenantData";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const badgeTone = {
  positive: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", icon: CheckCircle2 },
  warning: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", icon: AlertTriangle },
  negative: { color: "#f87171", bg: "rgba(248,113,113,0.12)", icon: XCircle },
  neutral: { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", icon: Clock },
} as const;

const toneFor = (value: string) => {
  if (["Verified", "Healthy", "Active", "Sandbox + Prod", "Sandbox", "Prod pending"].includes(value)) {
    return value === "Prod pending" ? badgeTone.warning : badgeTone.positive;
  }
  if (["Pending", "Review", "Under Review", "Manual review", "Low balance", "Sandbox only"].includes(value)) {
    return badgeTone.warning;
  }
  if (["Failed", "Blocked", "Suspended", "Disabled", "Escalated"].includes(value)) {
    return badgeTone.negative;
  }
  return badgeTone.neutral;
};

export default function AdminTenants() {
  const mobile = useMediaQuery("(max-width: 767px)");
  const [location, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return new URLSearchParams(window.location.search).get("search") ?? "";
  });
  const focusKey = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new URLSearchParams(window.location.search).get("focus") as NotificationFocusKey | null;
  }, [location]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const nextSearch = new URLSearchParams(window.location.search).get("search") ?? "";
    setSearchValue(nextSearch);
  }, [location]);
  const activeFocus = focusKey ? focusDefinitions[focusKey] : null;
  const visibleTenants = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    return MOCK_TENANTS.filter((tenant) => {
      const matchesFocus = activeFocus ? activeFocus.match(tenant) : true;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [tenant.id, tenant.name, tenant.plan, tenant.kybStatus, tenant.billingStatus, tenant.opsStatus, tenant.envAccess]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFocus && matchesQuery;
    });
  }, [activeFocus, searchValue]);

  return (
    <AdminLayout>
      <div style={{ padding: mobile ? "20px 16px" : "28px 32px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>
          Tenants
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: MUTED }}>
          Spec-aligned tenant list exposing KYB, billing, ops, and environment access together.
        </p>

        <BackendPlaceholder
          type="pending"
          description="Tenant list requires the admin BFF tenant list endpoint. Displaying illustrative canonical gating fields."
        />

        {activeFocus ? (
          <div
            className="admin-panel"
            style={{
              ...cardShell,
              background: SURF_DEFAULT,
              display: "flex",
              flexDirection: mobile ? "column" : "row",
              alignItems: mobile ? "stretch" : "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "14px 18px",
              marginBottom: 16,
              border: "1px solid rgba(249,115,22,0.16)",
              boxShadow: "0 10px 22px rgba(15,23,42,0.05), 0 2px 6px rgba(249,115,22,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div className="admin-kpi-icon" style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Link2 style={{ width: 15, height: 15, color: "#F97316" }} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: TEXT }}>
                  Notification link active: {activeFocus.label}
                </div>
                <div style={{ marginTop: 3, fontSize: 12.5, color: MUTED }}>
                  {activeFocus.description} Showing {visibleTenants.length} matching {visibleTenants.length === 1 ? "tenant" : "tenants"} from the notifications route.
                </div>
              </div>
            </div>

            <button
              type="button"
              className="admin-button"
              onClick={() => setLocation("/admin/tenants")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(13,18,33,0.1)",
                background: SURF_SUPPORT,
                color: TEXT,
                cursor: "pointer",
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 700,
                fontSize: 12.5,
                flexShrink: 0,
              }}
            >
              <X style={{ width: 14, height: 14 }} />
              Clear link
            </button>
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 10, marginBottom: 20, alignItems: mobile ? "stretch" : "center" }}>
          <div
            className="admin-command-surface"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: SURF_SUPPORT,
              borderRadius: 10,
              padding: "8px 14px",
              border: "1px solid rgba(13,18,33,0.07)",
            }}
          >
            <Search style={{ width: 14, height: 14, color: MUTED }} />
            <input
              placeholder="Search tenants by name, ID, or plan..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: TEXT,
                fontFamily: "'Satoshi', sans-serif",
                width: "100%",
              }}
            />
          </div>
          <button
            className="admin-button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid rgba(13,18,33,0.1)",
              background: SURF_SUPPORT,
              color: MUTED,
              cursor: "pointer",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              width: mobile ? "100%" : "fit-content",
            }}
          >
            <Filter style={{ width: 14, height: 14 }} /> Filter
          </button>
        </div>

        <div className="admin-panel admin-table-shell" style={{ ...cardShell, background: SURF_DEFAULT, overflowX: mobile ? "auto" : "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1.3fr 100px 130px 130px 120px 140px 120px",
              padding: "10px 20px",
              borderBottom: "1px solid rgba(13,18,33,0.07)",
              minWidth: 990,
            }}
          >
            {["Tenant ID", "Name", "Plan", "KYB", "Billing", "Ops", "Env Access", "Joined"].map((heading) => (
              <span key={heading} style={{ fontSize: 10.5, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {heading}
              </span>
            ))}
          </div>

          {visibleTenants.map((tenant, index) => {
            const isLinkedMatch = activeFocus ? activeFocus.match(tenant) : false;

            return (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.06 }}
              className="admin-row"
              style={{
                animationDelay: `${index * 50}ms`,
                display: "grid",
                gridTemplateColumns: "120px 1.3fr 100px 130px 130px 120px 140px 120px",
                padding: "13px 20px",
                alignItems: "center",
                borderBottom: index < visibleTenants.length - 1 ? "1px solid rgba(13,18,33,0.05)" : "none",
                background: SURF_SUPPORT,
                boxShadow: isLinkedMatch ? "inset 3px 0 0 #F97316" : "none",
                minWidth: 990,
              }}
            >
              <code style={{ fontSize: 11.5, color: MUTED }}>{tenant.id}</code>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: DARK_1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Building2 style={{ width: 13, height: 13, color: "#94a3b8" }} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: TEXT }}>{tenant.name}</span>
              </div>
              <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>{tenant.plan}</span>

              {[tenant.kybStatus, tenant.billingStatus, tenant.opsStatus, tenant.envAccess].map((value) => {
                const tone = toneFor(value);
                return (
                  <div
                    key={`${tenant.id}-${value}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: tone.bg,
                      borderRadius: 20,
                      padding: "3px 10px",
                      width: "fit-content",
                    }}
                    className={`admin-pill ${tone === badgeTone.positive ? "admin-pill-positive" : tone === badgeTone.warning ? "admin-pill-warning" : tone === badgeTone.negative ? "admin-pill-negative" : "admin-pill-neutral"}`}
                  >
                    <tone.icon style={{ width: 11, height: 11, color: tone.color }} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: tone.color }}>{value}</span>
                  </div>
                );
              })}

              <span style={{ fontSize: 12, color: MUTED }}>{tenant.joined}</span>
            </motion.div>
          )})}
        </div>
      </div>
    </AdminLayout>
  );
}
