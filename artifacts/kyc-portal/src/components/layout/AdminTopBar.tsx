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

export function AdminTopBar() {
  const [location] = useLocation();
  const pageTitle = PAGE_TITLES[location] || "Admin";

  return (
    <motion.header
      className="flex items-center justify-between px-8 fixed top-0 right-0 z-40"
      style={{
        left: 72,
        height: 64,
        background: "rgba(232,238,247,0.92)",
        backdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
          style={{ background: "#0f1013", color: "#efc92d", border: "1px solid rgba(15,16,19,0.15)" }}
        >
          <Shield className="w-3 h-3" />
          ADMIN
        </div>
        <span style={{ color: "#c0c0c0" }}>/</span>
        <span className="font-semibold" style={{ fontSize: 15, color: "#1a1a1a" }}>{pageTitle}</span>
      </div>

      {/* Center search */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative w-full max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8a8a8a" }} />
          <input
            type="text"
            placeholder="Search clients, applications, events…"
            className="w-full h-10 text-sm pr-14 pl-11 rounded-2xl outline-none transition-all duration-200"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.09)",
              color: "#1a1a1a",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
            onFocus={e => {
              e.target.style.borderColor = "#0f1013";
              e.target.style.boxShadow = "0 0 0 3px rgba(15,16,19,0.08)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "rgba(0,0,0,0.09)";
              e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
            }}
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]"
            style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#8a8a8a" }}
          >
            <Command className="w-2.5 h-2.5" /><span>K</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Pending badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
          style={{ background: "#0f1013", color: "#efc92d" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "#efc92d" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#efc92d" }} />
          </span>
          14 Pending
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-xl transition-colors hover:bg-black/5" style={{ color: "#6b7280" }}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#f54a4a", border: "1.5px solid #e8eef7" }} />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-4 cursor-pointer group" style={{ borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
            style={{ background: "#0f1013", color: "#efc92d" }}
          >
            A
          </div>
          <div>
            <p className="text-sm font-display font-semibold leading-tight" style={{ color: "#1a1a1a" }}>Admin</p>
            <p className="text-[10px]" style={{ color: "#8a8a8a" }}>Super Admin</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
