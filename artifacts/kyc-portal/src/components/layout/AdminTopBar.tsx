import { Search, Bell, Command, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/kyc-queue": "KYC Review Queue",
  "/admin/clients": "Client Management",
  "/admin/risk": "Risk Alerts",
  "/admin/analytics": "Analytics",
  "/admin/audit": "Audit Logs",
  "/admin/settings": "Settings",
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
        background: "rgba(245,243,239,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left: Admin badge + breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
          style={{ background: "rgba(245,74,74,0.1)", color: "#f54a4a", border: "1px solid rgba(245,74,74,0.2)" }}
        >
          <Shield className="w-3 h-3" />
          ADMIN
        </div>
        <span style={{ color: "#c0c0c0" }}>/</span>
        <span className="font-semibold" style={{ fontSize: 15, color: "#1a1a1a" }}>{pageTitle}</span>
      </div>

      {/* Center: search */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative group w-full max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: "#8a8a8a" }} />
          <input
            type="text"
            placeholder="Search clients, applications, events…"
            className="w-full h-10 text-sm pr-14 pl-11 rounded-2xl outline-none transition-all duration-200"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.09)",
              color: "#1a1a1a",
            }}
            onFocus={e => {
              e.target.style.borderColor = "#f54a4a";
              e.target.style.boxShadow = "0 0 0 3px rgba(245,74,74,0.1)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "rgba(0,0,0,0.09)";
              e.target.style.boxShadow = "none";
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(245,155,32,0.12)", border: "1px solid rgba(245,155,32,0.25)", color: "#d97706" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "#f59b20" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#f59b20" }} />
          </span>
          14 Pending
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 transition-colors" style={{ color: "#8a8a8a" }}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#f54a4a", border: "1.5px solid #f5f3ef" }} />
        </button>

        {/* Admin avatar */}
        <div className="flex items-center gap-3 pl-4 cursor-pointer group" style={{ borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
          <div className="text-right">
            <p className="text-sm font-display font-semibold" style={{ color: "#1a1a1a" }}>Admin</p>
            <p className="text-[10px]" style={{ color: "#8a8a8a" }}>Super Admin</p>
          </div>
          <div
            className="w-9 h-9 rounded-full p-[2px]"
            style={{ background: "linear-gradient(135deg, #efc92d, #f59b20)" }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img src="https://i.pravatar.cc/150?img=12" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
