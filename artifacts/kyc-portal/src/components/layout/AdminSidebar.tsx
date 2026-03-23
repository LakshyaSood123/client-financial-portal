import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  AlertTriangle,
  BarChart2,
  ScrollText,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",   path: "/admin" },
  { icon: ShieldCheck,     label: "KYC Queue",  path: "/admin/kyc-queue", badge: 14 },
  { icon: Users,           label: "Clients",    path: "/admin/clients" },
  { icon: AlertTriangle,   label: "Risk Alerts",path: "/admin/risk", badge: 3 },
  { icon: BarChart2,       label: "Analytics",  path: "/admin/analytics" },
  { icon: ScrollText,      label: "Audit Logs", path: "/admin/audit" },
];

const SIDEBAR_BG   = "#0f1013";
const ICON_MUTED   = "rgba(255,255,255,0.38)";
const ICON_ACTIVE  = "#ffffff";
const ACTIVE_PILL  = "rgba(255,255,255,0.12)";
const HOVER_BG     = "rgba(255,255,255,0.06)";

export function AdminSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [location] = useLocation();

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col"
      style={{ background: SIDEBAR_BG }}
      initial={{ width: 72 }}
      animate={{ width: expanded ? 232 : 72 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center h-[72px] px-5 shrink-0 overflow-hidden">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #efc92d, #f59b20)" }}>
          <span className="font-display font-black text-sm" style={{ color: "#0f1013" }}>N</span>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="ml-3 overflow-hidden whitespace-nowrap"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.16 }}
            >
              <p className="font-display font-bold text-sm leading-tight text-white">
                Nexus<span style={{ color: "#efc92d" }}>KYC</span>
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                Admin Panel
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="absolute -right-3 top-[62px] w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
        style={{
          background: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          border: "1.5px solid rgba(0,0,0,0.08)",
        }}
      >
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: "#0f1013" }} />
        </motion.div>
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center h-11 px-3 rounded-xl transition-all duration-150 relative group shrink-0"
              style={{
                background: isActive ? ACTIVE_PILL : "transparent",
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = HOVER_BG;
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {/* Active left bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                  style={{ background: "#efc92d" }}
                />
              )}

              <item.icon
                className="w-5 h-5 shrink-0"
                style={{ color: isActive ? ICON_ACTIVE : ICON_MUTED }}
              />

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    className="ml-3 flex items-center justify-between flex-1 min-w-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                  >
                    <span
                      className="font-semibold text-sm whitespace-nowrap"
                      style={{ color: isActive ? ICON_ACTIVE : ICON_MUTED }}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ background: "#f54a4a", color: "#fff" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed badge dot */}
              {item.badge && !expanded && (
                <span
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ background: "#f54a4a" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
        <Link
          href="/"
          className="flex items-center h-11 px-3 rounded-xl transition-all duration-150"
          style={{ color: ICON_MUTED }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = HOVER_BG; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = ICON_MUTED; }}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span className="ml-3 text-sm font-semibold whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          className="w-full flex items-center h-11 px-3 rounded-xl transition-all duration-150"
          style={{ color: ICON_MUTED }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(245,74,74,0.15)"; (e.currentTarget as HTMLElement).style.color = "#f54a4a"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = ICON_MUTED; }}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span className="ml-3 text-sm font-semibold whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
