import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard, ShieldCheck, Key, Webhook,
  CreditCard, ScrollText, Settings, HelpCircle, LogOut,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/portal",               label: "Overview",      icon: LayoutDashboard },
  { path: "/portal/verifications", label: "Verifications", icon: ShieldCheck     },
  { path: "/portal/apikeys",       label: "API Keys",      icon: Key             },
  { path: "/portal/webhooks",      label: "Webhooks",      icon: Webhook         },
  { path: "/portal/billing",       label: "Billing",       icon: CreditCard      },
  { path: "/portal/audit-logs",    label: "Audit Logs",    icon: ScrollText      },
];

const UTIL_ITEMS = [
  { label: "Settings",    icon: Settings   },
  { label: "Help Center", icon: HelpCircle },
  { label: "Sign Out",    icon: LogOut     },
];

const COLLAPSED_W = 56;
const EXPANDED_W  = 220;

export function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("portal-sidebar-collapsed") === "true"; }
    catch { return false; }
  });

  const persist = (val: boolean) => {
    setCollapsed(val);
    try { localStorage.setItem("portal-sidebar-collapsed", String(val)); } catch {}
  };

  const isActive = (path: string) =>
    path === "/portal"
      ? location === "/portal" || location === "/"
      : location.startsWith(path);

  const w = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <motion.div
      animate={{ width: w }}
      initial={false}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flexShrink: 0,
        background: "#F2EAE1",
        borderRight: "1px solid rgba(120,90,50,0.08)",
        display: "flex",
        flexDirection: "column",
        padding: collapsed ? "24px 10px 20px" : "24px 14px 20px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Logo row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        marginBottom: 28,
        minHeight: 30,
      }}>
        <Link href="/portal" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg, #F97316, #F59E0B)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 14, letterSpacing: "-0.02em" }}>N</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontWeight: 800, fontSize: 15, color: "#1C1917",
                  letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden",
                }}
              >
                Nexus<span style={{ color: "#F97316" }}>KYC</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Collapse toggle — only visible when expanded */}
        <AnimatePresence>
          {!collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => persist(true)}
              style={{
                border: "none", background: "transparent", cursor: "pointer",
                color: "#C4B5A5", padding: 4, borderRadius: 6, flexShrink: 0,
                display: "flex", alignItems: "center",
              }}
              title="Collapse sidebar"
            >
              <ChevronLeft style={{ width: 15, height: 15 }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Expand button — only visible when collapsed, centered */}
      <AnimatePresence>
        {collapsed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => persist(false)}
            style={{
              position: "absolute", top: 28, right: -1,
              width: 20, height: 20, borderRadius: "50%",
              background: "#F2EAE1",
              border: "1px solid rgba(120,90,50,0.18)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#C4B5A5", zIndex: 10, boxShadow: "0 1px 4px rgba(90,65,30,0.12)",
            }}
            title="Expand sidebar"
          >
            <ChevronRight style={{ width: 11, height: 11 }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* MENU label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#C4B5A5",
              marginBottom: 6, paddingLeft: 10, margin: "0 0 6px",
            }}
          >
            Menu
          </motion.p>
        )}
      </AnimatePresence>

      {/* Nav items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, marginTop: collapsed ? 0 : undefined }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <div key={item.path} style={{ position: "relative" }} title={collapsed ? item.label : undefined}>
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: 10,
                    padding: collapsed ? "9px 0" : "9px 12px",
                    borderRadius: 12,
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
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.16 }}
                        style={{
                          fontSize: 13.5, fontWeight: active ? 700 : 500,
                          fontFamily: "'Satoshi', sans-serif",
                          whiteSpace: "nowrap", overflow: "hidden",
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Utility section */}
      <div style={{
        borderTop: "1px solid rgba(120,90,50,0.1)",
        paddingTop: 12, display: "flex", flexDirection: "column", gap: 1,
      }}>
        {UTIL_ITEMS.map((item) => (
          <button
            key={item.label}
            title={collapsed ? item.label : undefined}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10,
              padding: collapsed ? "9px 0" : "9px 12px",
              borderRadius: 12, border: "none", background: "transparent",
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
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.16 }}
                  style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden" }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
