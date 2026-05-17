import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { GlobalSearchBox, type SearchItem } from "@/components/layout/GlobalSearchBox";
import { MOCK_TENANTS } from "@/pages/admin/adminTenantData";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/tenants": "Tenants",
  "/admin/kyc": "KYC Review Queue",
  "/admin/risk": "Risk Alerts",
  "/admin/plans-overrides": "Plans and Overrides",
  "/admin/billing": "Billing Operations",
  "/admin/apikeys": "Admin API Keys",
  "/admin/webhooks": "Admin Webhooks",
  "/admin/notifications": "Notifications",
  "/admin/control-plane-events": "Control-Plane Events",
  "/admin/platform-ops": "Platform Ops",
};

const ADMIN_SEARCH_ITEMS: SearchItem[] = [
  { label: "Overview", href: "/admin", description: "Control-plane summary", keywords: ["dashboard", "ops", "summary"] },
  { label: "Tenants", href: "/admin/tenants", description: "Tenant list and gating fields", keywords: ["clients", "accounts", "billing status"] },
  { label: "KYC Review Queue", href: "/admin/kyc", description: "Pending KYB/KYC cases", keywords: ["review", "queue", "verification"] },
  { label: "Risk Alerts", href: "/admin/risk", description: "Escalations and flagged cases", keywords: ["alerts", "risk", "pep", "sanctions"] },
  { label: "Plans and Overrides", href: "/admin/plans-overrides", description: "Pricing and commercial controls", keywords: ["pricing", "plans", "override"] },
  { label: "Billing Operations", href: "/admin/billing", description: "Top-ups and balance operations", keywords: ["wallet", "ledger", "billing"] },
  { label: "Admin API Keys", href: "/admin/apikeys", description: "Key inventory and admin actions", keywords: ["api", "keys", "rotation"] },
  { label: "Admin Webhooks", href: "/admin/webhooks", description: "Endpoint and delivery operations", keywords: ["deliveries", "endpoint", "failures"] },
  { label: "Notifications", href: "/admin/notifications", description: "Routes, channels, and templates", keywords: ["dispatcher", "email", "slack", "alerts"] },
  { label: "Control-Plane Events", href: "/admin/control-plane-events", description: "Audit and system events", keywords: ["events", "audit", "control plane"] },
  { label: "Platform Ops", href: "/admin/platform-ops", description: "Health cards and ops notes", keywords: ["health", "latency", "queue", "dlq"] },
  ...MOCK_TENANTS.map((tenant) => ({
    label: tenant.name,
    href: `/admin/tenants?search=${encodeURIComponent(tenant.name)}`,
    description: `${tenant.id} · ${tenant.plan} · ${tenant.billingStatus}`,
    keywords: [tenant.id, tenant.plan, tenant.kybStatus, tenant.billingStatus, tenant.opsStatus, tenant.envAccess],
  })),
  ...[
    { id: "KYC-2846", name: "David Chen", risk: "Medium", href: "/admin/kyc?search=KYC-2846" },
    { id: "KYC-2843", name: "GlobalPay Inc", risk: "Medium", href: "/admin/kyc?search=KYC-2843" },
    { id: "KYC-2838", name: "Vertex Capital", risk: "High", href: "/admin/kyc?search=KYC-2838" },
    { id: "KYC-2831", name: "NexGen Logistics", risk: "Medium", href: "/admin/kyc?search=KYC-2831" },
  ].map((item) => ({
    label: item.id,
    href: item.href,
    description: `${item.name} · ${item.risk} risk review`,
    keywords: [item.name, item.risk, "queue", "review", "application"],
  })),
  ...[
    { label: "tenant.created", href: "/admin/control-plane-events", description: "Control-plane tenant lifecycle event" },
    { label: "hold.created", href: "/admin/control-plane-events", description: "Compliance hold event" },
    { label: "api_key.admin_rotated", href: "/admin/control-plane-events", description: "Admin API key rotation event" },
  ].map((item) => ({
    ...item,
    keywords: ["events", "audit", "control plane"],
  })),
];

const DARK = "#0e1219";
const MUTED = "#8499be";

interface AdminTopBarProps {
  sidebarWidth: number;
}

export function AdminTopBar({ sidebarWidth }: AdminTopBarProps) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const pageTitle = PAGE_TITLES[location] || "Admin";
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const headerHeight = isMobile ? 76 : 64;

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 20);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <motion.header
      className={`flex items-center justify-between px-8 fixed top-0 right-0 z-40 admin-topbar ${scrolled ? "scrolled" : ""}`}
      style={{
        left: sidebarWidth,
        height: headerHeight,
        background: "rgba(243,247,252,0.92)",
        borderBottom: "1px solid rgba(217,229,240,0.85)",
        overflow: "visible",
        paddingLeft: isMobile ? 16 : 32,
        paddingRight: isMobile ? 16 : 32,
        gap: isMobile ? 12 : 0,
      }}
      animate={{ left: sidebarWidth }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      initial={false}
    >
      <p className="font-display font-bold" style={{ fontSize: isMobile ? 15 : 17, color: DARK, letterSpacing: "-0.01em", flexShrink: 0 }}>
        {pageTitle}
      </p>

      <div className="flex-1 flex justify-center" style={{ minWidth: 0, paddingLeft: isMobile ? 0 : 32, paddingRight: isMobile ? 0 : 32 }}>
        <div className="w-full admin-command-surface rounded-2xl" style={{ maxWidth: isMobile ? "100%" : 400 }}>
          <GlobalSearchBox
            items={ADMIN_SEARCH_ITEMS}
            placeholder="Search clients, applications, events..."
            hint="Ctrl K"
            compact
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-opacity admin-button admin-button-primary"
          style={{ background: DARK, color: "#ffffff" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 bg-white" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          {isMobile ? "14" : "14 Pending"}
        </div>

        <button
          className="relative p-2 rounded-xl transition-all admin-icon-button"
          style={{ color: MUTED, background: "rgba(14,18,25,0.06)" }}
          onMouseEnter={(event) => ((event.currentTarget as HTMLElement).style.background = "rgba(14,18,25,0.11)")}
          onMouseLeave={(event) => ((event.currentTarget as HTMLElement).style.background = "rgba(14,18,25,0.06)")}
        >
          <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#f87171" }} />
        </button>

        <div style={{ width: 1, height: 22, background: "rgba(14,18,25,0.10)" }} />

        <div className="flex items-center gap-2.5 cursor-pointer admin-button rounded-xl px-2 py-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 text-white"
            style={{ background: DARK }}
          >
            A
          </div>
          <div style={{ display: isMobile ? "none" : "block" }}>
            <p className="text-sm font-display font-semibold leading-tight" style={{ color: DARK }}>
              Admin
            </p>
            <p className="text-[10px]" style={{ color: MUTED }}>
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
