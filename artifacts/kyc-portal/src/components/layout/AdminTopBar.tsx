import { Search, Bell, Command, Shield } from "lucide-react";
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

const NAVY  = "#1c2b4a";
const BLUE  = "#6b9cf4";

export function AdminTopBar() {
  const [location] = useLocation();
  const pageTitle = PAGE_TITLES[location] || "Admin";

  return (
    <motion.header
      className="flex items-center justify-between px-8 fixed top-0 right-0 z-40"
      style={{
        left: 72,
        height: 64,
        background: "rgba(237,241,249,0.92)",
        backdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid rgba(28,43,74,0.08)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
          style={{
            background: "rgba(28,43,74,0.08)",
            color: NAVY,
            border: "1px solid rgba(28,43,74,0.12)",
          }}
        >
          <Shield className="w-3 h-3" />
          ADMIN
        </div>
        <span style={{ color: "#b8c5de" }}>/</span>
        <span className="font-semibold" style={{ fontSize: 15, color: NAVY }}>{pageTitle}</span>
      </div>

      {/* Center search */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8fa5c8" }} />
          <input
            type="text"
            placeholder="Search clients, applications, events…"
            className="w-full h-10 text-sm pr-14 pl-11 rounded-2xl outline-none transition-all duration-200"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(28,43,74,0.1)",
              color: NAVY,
              boxShadow: "0 1px 6px rgba(28,43,74,0.06)",
            }}
            onFocus={e => {
              e.target.style.borderColor = BLUE;
              e.target.style.boxShadow = `0 0 0 3px rgba(107,156,244,0.15)`;
            }}
            onBlur={e => {
              e.target.style.borderColor = "rgba(28,43,74,0.1)";
              e.target.style.boxShadow = "0 1px 6px rgba(28,43,74,0.06)";
            }}
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]"
            style={{ background: "rgba(28,43,74,0.06)", border: "1px solid rgba(28,43,74,0.1)", color: "#8fa5c8" }}
          >
            <Command className="w-2.5 h-2.5" /><span>K</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Pending badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
          style={{ background: NAVY, color: "#ffffff" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: BLUE }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: BLUE }} />
          </span>
          14 Pending
        </div>

        {/* Bell */}
        <button
          className="relative p-2 rounded-xl transition-all hover:bg-[rgba(28,43,74,0.07)]"
          style={{ color: "#8fa5c8" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#f87171", border: "1.5px solid #edf1f9" }}
          />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "rgba(28,43,74,0.1)" }} />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0"
            style={{ background: NAVY, color: "#ffffff" }}
          >
            A
          </div>
          <div>
            <p className="text-sm font-display font-semibold leading-tight" style={{ color: NAVY }}>Admin</p>
            <p className="text-[10px]" style={{ color: "#8fa5c8" }}>Super Admin</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
