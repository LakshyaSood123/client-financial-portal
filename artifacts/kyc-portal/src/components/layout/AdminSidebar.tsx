import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, ShieldCheck, AlertTriangle,
  Lock, CreditCard, Key, Activity, Webhook,
  LogOut, ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",        path: "/admin"                     },
  { icon: Users,           label: "Tenants",         path: "/admin/tenants"             },
  { icon: ShieldCheck,     label: "KYC Review",      path: "/admin/kyc",       badge: 14 },
  { icon: AlertTriangle,   label: "Risk",            path: "/admin/risk",      badge: 3  },
  { icon: Lock,            label: "Compliance Holds",path: "/admin/compliance-holds"    },
  { icon: CreditCard,      label: "Billing",         path: "/admin/billing"             },
  { icon: Key,             label: "API Keys",        path: "/admin/apikeys"             },
  { icon: Activity,        label: "Events",          path: "/admin/control-plane-events"},
  { icon: Webhook,         label: "Webhooks",        path: "/admin/webhooks"            },
];

const DARK  = "#0e1219";
const DIM   = "rgba(255,255,255,0.36)";
const ON    = "#ffffff";
const ACTV  = "rgba(255,255,255,0.10)";
const HOVER = "rgba(255,255,255,0.05)";

export function AdminSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) =>
    path === "/admin"
      ? location === "/admin"
      : location.startsWith(path);

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col"
      style={{ background: DARK, borderRadius: "0 24px 24px 0" }}
      initial={{ width: 72 }}
      animate={{ width: expanded ? 228 : 72 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center h-[72px] px-5 shrink-0 overflow-hidden">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.14)" }}
        >
          <span className="font-display font-black text-sm text-white">N</span>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="ml-3 overflow-hidden whitespace-nowrap"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.16 }}
            >
              <span className="font-bold text-white text-sm">Nexus</span>
              <span style={{ color: "#F97316" }} className="font-bold text-sm">KYC</span>
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Admin</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "#1e2634", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight style={{ width: 12, height: 12, color: DIM }} />
        </motion.div>
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-hidden">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} href={item.path} style={{ textDecoration: "none" }}>
              <motion.div
                className="flex items-center gap-3 rounded-xl cursor-pointer relative overflow-hidden"
                style={{
                  padding: expanded ? "10px 12px" : "10px",
                  justifyContent: expanded ? "flex-start" : "center",
                  background: active ? ACTV : "transparent",
                }}
                whileHover={{ background: active ? ACTV : HOVER }}
              >
                <item.icon style={{ width: 18, height: 18, color: active ? ON : DIM, flexShrink: 0 }} />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.14 }}
                      style={{ color: active ? ON : DIM, fontSize: 13.5, fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && (
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="ml-auto text-xs font-bold rounded-full px-2 py-0.5"
                        style={{ background: "rgba(249,115,22,0.25)", color: "#F97316", fontSize: 11 }}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                    {!expanded && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                        style={{ background: "#F97316" }}
                      />
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 shrink-0">
        <motion.button
          className="flex items-center gap-3 rounded-xl w-full"
          style={{
            padding: expanded ? "10px 12px" : "10px",
            justifyContent: expanded ? "flex-start" : "center",
            background: "transparent", border: "none", cursor: "pointer",
          }}
          whileHover={{ background: HOVER }}
        >
          <LogOut style={{ width: 18, height: 18, color: DIM, flexShrink: 0 }} />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.14 }}
                style={{ color: DIM, fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap" }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
