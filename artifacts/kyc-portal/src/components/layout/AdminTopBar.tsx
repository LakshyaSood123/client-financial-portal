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
      className="flex items-center justify-between px-8 z-40 sticky top-0"
      style={{
        height: 64,
        marginLeft: 72,
        background: "rgba(5,12,14,0.9)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left: Admin badge + breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
          style={{ background: "rgba(255,90,90,0.12)", color: "#ff5a5a", border: "1px solid rgba(255,90,90,0.25)" }}
        >
          <Shield className="w-3 h-3" />
          ADMIN
        </div>
        <span style={{ color: "#3d5a52" }}>/</span>
        <span className="text-foreground font-medium" style={{ fontSize: 15 }}>{pageTitle}</span>
      </div>

      {/* Center: search */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative group w-full max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a82] group-focus-within:text-[#ff5a5a] transition-colors" />
          <input
            type="text"
            placeholder="Search clients, applications, events…"
            className="w-full h-10 text-sm text-foreground placeholder:text-[#3d5a52] pr-14 pl-11 rounded-3xl outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={e => {
              (e.target as HTMLInputElement).style.borderColor = "#ff5a5a";
              (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,90,90,0.12)";
            }}
            onBlur={e => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.target as HTMLInputElement).style.boxShadow = "none";
            }}
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-[#6b8a82]"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Command className="w-2.5 h-2.5" /><span>K</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 shrink-0">
        {/* System status */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(255,181,71,0.1)", border: "1px solid rgba(255,181,71,0.2)", color: "#ffb547" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "#ffb547" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#ffb547" }} />
          </span>
          14 Pending
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 text-[#6b8a82] hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#ff5a5a", border: "1.5px solid #050c0e" }} />
        </button>

        {/* Admin avatar */}
        <div className="flex items-center gap-3 pl-4 cursor-pointer group" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="text-right">
            <p className="text-sm font-display font-semibold text-foreground group-hover:text-[#ff5a5a] transition-colors">Admin</p>
            <p className="text-[10px]" style={{ color: "#6b8a82" }}>Super Admin</p>
          </div>
          <div
            className="w-9 h-9 rounded-full p-[2px]"
            style={{ background: "linear-gradient(135deg, #ff5a5a, #ffb547)" }}
          >
            <div className="w-full h-full rounded-full overflow-hidden" style={{ background: "#050c0e" }}>
              <img src="https://i.pravatar.cc/150?img=12" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
