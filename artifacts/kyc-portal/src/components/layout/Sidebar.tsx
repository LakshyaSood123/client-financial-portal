import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard, ShieldCheck, Key, Webhook,
  CreditCard, ScrollText, Settings, HelpCircle, LogOut, ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/portal",            label: "Overview",      icon: LayoutDashboard },
  { path: "/portal/verifications", label: "Verifications", icon: ShieldCheck },
  { path: "/portal/apikeys",    label: "API Keys",      icon: Key },
  { path: "/portal/webhooks",   label: "Webhooks",      icon: Webhook },
  { path: "/portal/billing",    label: "Billing",       icon: CreditCard },
  { path: "/portal/audit-logs", label: "Audit Logs",    icon: ScrollText },
];

const UTIL_ITEMS = [
  { label: "Settings",    icon: Settings  },
  { label: "Help Center", icon: HelpCircle },
  { label: "Sign Out",    icon: LogOut    },
];

export function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) =>
    path === "/portal"
      ? location === "/portal" || location === "/"
      : location.startsWith(path);

  return (
    <motion.div
      style={{
        width: 220,
        flexShrink: 0,
        background: "#F2EAE1",
        borderRight: "1px solid rgba(120,90,50,0.08)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 14px 20px",
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <Link href="/portal" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg, #F97316, #F59E0B)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 14, letterSpacing: "-0.02em" }}>N</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#1C1917", letterSpacing: "-0.01em" }}>
            Nexus<span style={{ color: "#F97316" }}>KYC</span>
          </span>
        </Link>
        <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#C4B5A5", padding: 4, borderRadius: 6 }}>
          <ChevronLeft style={{ width: 15, height: 15 }} />
        </button>
      </div>

      {/* MENU label */}
      <p style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "#C4B5A5",
        marginBottom: 6, paddingLeft: 10,
      }}>
        Menu
      </p>

      {/* Nav items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <div key={item.path} style={{ position: "relative" }}>
              {active && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  style={{
                    position: "absolute", inset: 0, borderRadius: 12,
                    background: "linear-gradient(135deg, #F97316, #F59E0B)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Link href={item.path} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    position: "relative", zIndex: 1,
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 12,
                    color: active ? "#ffffff" : "#A09080",
                    cursor: "pointer",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(120,90,50,0.08)";
                      (e.currentTarget as HTMLElement).style.color = "#1C1917";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "#A09080";
                    }
                  }}
                >
                  <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, fontFamily: "'Satoshi', sans-serif" }}>
                    {item.label}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Utility section */}
      <div style={{ borderTop: "1px solid rgba(120,90,50,0.1)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 1 }}>
        {UTIL_ITEMS.map((item) => (
          <button
            key={item.label}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 12,
              border: "none", background: "transparent",
              color: "#A09080", cursor: "pointer", textAlign: "left",
              width: "100%", fontFamily: "'Satoshi', sans-serif",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(120,90,50,0.08)";
              (e.currentTarget as HTMLElement).style.color = "#1C1917";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#A09080";
            }}
          >
            <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
