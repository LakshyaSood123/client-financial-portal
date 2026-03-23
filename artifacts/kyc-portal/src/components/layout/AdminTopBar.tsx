import { Search, Bell, Command } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const PAGE_TITLES: Record<string, string> = {
  "/admin":           "Overview",
  "/admin/kyc-queue": "KYC Review Queue",
  "/admin/clients":   "Client Management",
  "/admin/risk":      "Risk Alerts",
  "/admin/analytics": "Analytics",
  "/admin/audit":     "Audit Logs",
  "/admin/settings":  "Settings",
};

const DARK = "#0e1219";
const MUTED = "#8499be";

export function AdminTopBar() {
  const [location] = useLocation();
  const pageTitle = PAGE_TITLES[location] || "Admin";

  return (
    <motion.header
      className="flex items-center justify-between px-8 fixed top-0 right-0 z-40"
      style={{
        left: 72,
        height: 64,
        background: "rgba(214,227,240,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(14,18,25,0.06)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left — greeting */}
      <p className="font-display font-bold" style={{ fontSize: 17, color: DARK, letterSpacing: "-0.01em" }}>
        {pageTitle}
      </p>

      {/* Center search */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative w-full max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
          <input
            type="text"
            placeholder="Search clients, applications, events…"
            className="w-full h-9 text-sm pr-14 pl-11 rounded-2xl outline-none transition-all duration-200"
            style={{
              background: "rgba(195,211,230,0.7)",
              border: "1px solid rgba(14,18,25,0.07)",
              color: DARK,
            }}
            onFocus={e => {
              e.target.style.background = "#bfcfe3";
              e.target.style.borderColor = "rgba(14,18,25,0.18)";
            }}
            onBlur={e => {
              e.target.style.background = "rgba(195,211,230,0.7)";
              e.target.style.borderColor = "rgba(14,18,25,0.07)";
            }}
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]"
            style={{ background: "rgba(14,18,25,0.07)", color: MUTED }}
          >
            <Command className="w-2.5 h-2.5" /><span>K</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Pending pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: DARK, color: "#ffffff" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 bg-white" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          14 Pending
        </div>

        {/* Bell */}
        <button
          className="relative p-2 rounded-xl transition-all"
          style={{ color: MUTED, background: "rgba(14,18,25,0.06)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(14,18,25,0.11)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(14,18,25,0.06)"}
        >
          <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#f87171" }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: "rgba(14,18,25,0.10)" }} />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 text-white"
            style={{ background: DARK }}
          >
            A
          </div>
          <div>
            <p className="text-sm font-display font-semibold leading-tight" style={{ color: DARK }}>Admin</p>
            <p className="text-[10px]" style={{ color: MUTED }}>Super Admin</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
