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
import { cn } from "@/lib/utils";

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
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col pt-6 pb-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
      initial={{ width: 72 }}
      animate={{ width: isHovered ? 240 : 72 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo area */}
      <div className="flex items-center px-5 mb-8 h-10 overflow-hidden shrink-0">
        <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full opacity-80"
            style={{ border: "2px solid #ff5a5a" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1 rounded-full opacity-60"
            style={{ border: "2px solid #ffb547" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <div className="w-2 h-2 rounded-full" style={{ background: '#ff5a5a', boxShadow: '0 0 8px #ff5a5a' }} />
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="ml-4 flex flex-col whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-display font-bold text-base text-foreground leading-tight">
                Nexus<span style={{ color: '#ff5a5a' }}>KYC</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#ffb547' }}>
                Admin Panel
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center h-12 px-3 rounded-xl transition-all duration-200 relative group shrink-0",
                isActive
                  ? "text-[#ff5a5a]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
              style={isActive ? { background: "rgba(255,90,90,0.1)" } : {}}
            >
              {isActive && (
                <motion.div
                  layoutId="active-admin-nav"
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                  style={{ background: '#ff5a5a', boxShadow: '0 0 8px #ff5a5a' }}
                />
              )}

              <div className="relative shrink-0">
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#ff5a5a]" : "group-hover:text-[#00d4aa]")} />
                {item.badge && !isHovered && (
                  <div
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background: '#ff5a5a' }}
                  >
                    {item.badge}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="ml-4 flex items-center justify-between flex-1 min-w-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span
                        className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white"
                        style={{ background: '#ff5a5a' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isHovered && (
                <div className="absolute left-14 px-3 py-1.5 rounded-lg text-sm text-foreground opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl"
                  style={{ background: '#0a181c', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 mt-auto pt-4 space-y-1 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Back to client view */}
        <Link
          href="/"
          className="flex items-center h-12 px-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 group"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {isHovered && (
              <motion.span className="ml-4 font-medium text-sm whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Client View
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button className="w-full flex items-center h-12 px-3 rounded-xl text-muted-foreground hover:text-[#ff5a5a] hover:bg-[rgba(255,90,90,0.1)] transition-all duration-200 group">
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {isHovered && (
              <motion.span className="ml-4 font-medium text-sm whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
