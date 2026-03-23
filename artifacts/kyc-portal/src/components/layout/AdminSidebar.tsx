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
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: ShieldCheck, label: "KYC Queue", path: "/admin/kyc-queue", badge: 14 },
  { icon: Users, label: "Clients", path: "/admin/clients" },
  { icon: AlertTriangle, label: "Risk Alerts", path: "/admin/risk", badge: 3 },
  { icon: BarChart2, label: "Analytics", path: "/admin/analytics" },
  { icon: ScrollText, label: "Audit Logs", path: "/admin/audit" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export function AdminSidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [location] = useLocation();

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col pt-5 pb-5"
      style={{
        background: "#ffffff",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "2px 0 12px rgba(0,0,0,0.05)",
      }}
      initial={{ width: 72 }}
      animate={{ width: isHovered ? 228 : 72 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo area */}
      <div className="flex items-center px-5 mb-7 h-10 overflow-hidden shrink-0">
        <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid #efc92d" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1 rounded-full"
            style={{ border: "2px solid #f54a4a" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <div className="w-2 h-2 rounded-full" style={{ background: "#f54a4a" }} />
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="ml-3 flex flex-col whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.16 }}
            >
              <span className="font-display font-bold text-sm leading-tight" style={{ color: "#1a1a1a" }}>
                Nexus<span style={{ color: "#efc92d" }}>KYC</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#f54a4a" }}>
                Admin Panel
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center h-11 px-3 rounded-xl transition-all duration-200 relative group shrink-0"
              style={isActive ? {
                background: "#1a1a1a",
                color: "#ffffff",
              } : {
                color: "#8a8a8a",
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "";
              }}
            >
              <item.icon className="w-5 h-5 shrink-0" style={isActive ? { color: "#ffffff" } : {}} />

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="ml-3 flex items-center justify-between flex-1 min-w-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                  >
                    <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span
                        className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white"
                        style={{ background: "#f54a4a" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {item.badge && !isHovered && (
                <div
                  className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ background: "#f54a4a" }}
                >
                  {item.badge}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 mt-4 pt-4 space-y-0.5 shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <Link
          href="/"
          className="flex items-center h-11 px-3 rounded-xl transition-colors group"
          style={{ color: "#8a8a8a" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "";
          }}
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {isHovered && (
              <motion.span className="ml-3 font-semibold text-sm whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Client View
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          className="w-full flex items-center h-11 px-3 rounded-xl transition-colors"
          style={{ color: "#8a8a8a" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(245,74,74,0.08)";
            (e.currentTarget as HTMLElement).style.color = "#f54a4a";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "";
            (e.currentTarget as HTMLElement).style.color = "#8a8a8a";
          }}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {isHovered && (
              <motion.span className="ml-3 font-semibold text-sm whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
