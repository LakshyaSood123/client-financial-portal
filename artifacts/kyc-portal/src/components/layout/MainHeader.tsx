import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { GlobalSearchBox, type SearchItem } from "@/components/layout/GlobalSearchBox";

interface MainHeaderProps {
  title?: string;
  subtitle?: string;
  elevated?: boolean;
  mobile?: boolean;
}

const PORTAL_SEARCH_ITEMS: SearchItem[] = [
  { label: "Overview", href: "/portal", description: "Account summary and current usage", keywords: ["dashboard", "home", "stats"] },
  { label: "Onboarding", href: "/onboarding", description: "Business setup and KYB steps", keywords: ["kyb", "setup", "verification"] },
  { label: "API Keys", href: "/portal/apikeys", description: "Create, rotate, and review keys", keywords: ["keys", "token", "secret"] },
  { label: "Jobs", href: "/portal/jobs", description: "Submitted jobs and processing status", keywords: ["cases", "jobs", "processing"] },
  { label: "Uploads", href: "/portal/uploads", description: "Document uploads and requests", keywords: ["documents", "files", "presigned"] },
  { label: "Billing", href: "/portal/billing", description: "Balance, plan, and ledger details", keywords: ["plan", "usage", "wallet", "invoice"] },
  { label: "Webhooks", href: "/portal/webhooks", description: "Endpoint health and deliveries", keywords: ["deliveries", "endpoint", "replay"] },
  { label: "Compliance", href: "/portal/compliance", description: "Risk, holds, and verification data", keywords: ["risk", "kyb", "holds"] },
  { label: "Audit Logs", href: "/portal/audit-logs", description: "Search platform activity events", keywords: ["events", "history", "logs"] },
  { label: "Settings", href: "/portal/settings", description: "Notification and tenant preferences", keywords: ["preferences", "alerts", "profile"] },
];

export function MainHeader({
  title   = "Account Overview",
  subtitle = "KYB progress, integration health, billing status, and recent activity",
  elevated = false,
  mobile = false,
}: MainHeaderProps) {
  if (mobile) {
    return (
      <div
        className={cn("topbar-elevation", elevated && "scrolled")}
        style={{
          padding: "18px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          borderBottom: "1px solid var(--nk-border)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          flexShrink: 0,
          position: "relative",
          zIndex: 25,
          overflow: "visible",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                background: "linear-gradient(135deg, #F97316, #F59E0B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: "-0.02em" }}>N</span>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: "#1C1917",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              Nexus<span style={{ color: "#F97316" }}>KYC</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button
              className="cta-3d"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "1px solid var(--nk-border)",
                boxShadow: "var(--elev-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                color: "#A09080",
              }}
            >
              <Bell style={{ width: 16, height: 16 }} />
              <span
                style={{
                  position: "absolute",
                  top: 7,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#f54a4a",
                  border: "1.5px solid #FAF8F4",
                }}
              />
            </button>

            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F97316, #F59E0B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                fontFamily: "'Satoshi', sans-serif",
                boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
                cursor: "pointer",
              }}
            >
              C
            </div>
          </div>
        </div>

        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1C1917",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              fontFamily: "'Satoshi', sans-serif",
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 12, color: "#B0A090", marginTop: 4, fontFamily: "'Satoshi', sans-serif" }}>
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 14,
            background: "rgba(245, 239, 230, 0.85)",
            border: "1px solid rgba(214, 203, 187, 0.75)",
            color: "#8B7355",
            fontSize: 11.5,
            lineHeight: 1.35,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#F59E0B",
              flexShrink: 0,
            }}
          />
          Best viewed in desktop mode for full dashboard access.
        </div>

        <GlobalSearchBox
          items={PORTAL_SEARCH_ITEMS}
          placeholder="Search pages, jobs, billing..."
          width="100%"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("topbar-elevation", elevated && "scrolled")}
      style={{
        padding: "28px 32px 22px",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 0,
        borderBottom: "1px solid var(--nk-border)",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
        flexShrink: 0,
        transformStyle: "preserve-3d",
        position: "relative",
        zIndex: 25,
        overflow: "visible",
      }}
    >
      <div>
        <h1 style={{
          fontSize: mobile ? 22 : 26, fontWeight: 800, color: "#1C1917",
          letterSpacing: "-0.025em", lineHeight: 1.15,
          fontFamily: "'Satoshi', sans-serif", margin: 0,
        }}>
          {title}
        </h1>
        <p style={{ fontSize: mobile ? 12 : 13, color: "#B0A090", marginTop: 4, fontFamily: "'Satoshi', sans-serif" }}>
          {subtitle}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
          marginTop: 2,
          width: "auto",
        }}
      >
        <GlobalSearchBox
          items={PORTAL_SEARCH_ITEMS}
          placeholder="Search pages, jobs, billing..."
          width={210}
        />

        <button className="cta-3d" style={{
          width: 36, height: 36, borderRadius: "50%", background: "#FFFFFF",
          border: "1px solid var(--nk-border)",
          boxShadow: "var(--elev-1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", flexShrink: 0, color: "#A09080",
        }}>
          <Bell style={{ width: 16, height: 16 }} />
          <span style={{
            position: "absolute", top: 6, right: 7, width: 7, height: 7,
            borderRadius: "50%", background: "#f54a4a", border: "1.5px solid #FAF8F4",
          }} />
        </button>

        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(135deg, #F97316, #F59E0B)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 15,
          fontFamily: "'Satoshi', sans-serif", flexShrink: 0,
          boxShadow: "0 2px 8px rgba(249,115,22,0.3)", cursor: "pointer",
        }}>
          C
        </div>
      </div>
    </div>
  );
}
