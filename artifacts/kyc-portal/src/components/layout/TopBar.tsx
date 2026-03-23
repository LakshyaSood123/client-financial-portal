import { Bell, HelpCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Account Overview",
  "/usage": "Usage",
  "/webhooks": "Webhooks",
  "/billing": "Billing",
  "/api-keys": "API Keys",
  "/audit-logs": "Audit Logs",
  "/kyb-upload": "KYB Upload",
};

export function TopBar() {
  const [location] = useLocation();
  const pageLabel = ROUTE_LABELS[location] ?? "Account Overview";

  return (
    <motion.header
      className="flex items-center justify-between px-8 z-40 sticky top-0"
      style={{
        height: 64,
        marginLeft: 72,
        background: "rgba(5,12,14,0.90)",
        backdropFilter: "blur(24px) saturate(160%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium transition-colors" style={{ color: "#6b8a82" }}>Portal</span>
        <ChevronRight className="w-3.5 h-3.5" style={{ color: "#3d5a52" }} />
        <span className="font-semibold text-foreground" style={{ fontSize: 15 }}>{pageLabel}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        {/* Account health pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(168,255,62,0.08)", border: "1px solid rgba(168,255,62,0.18)", color: "#a8ff3e" }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#a8ff3e", boxShadow: "0 0 6px rgba(168,255,62,0.7)" }} />
          All systems operational
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 transition-colors hover:text-foreground" style={{ color: "#6b8a82" }}>
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: "#ff5a5a", border: "1.5px solid #050c0e" }}
          />
        </button>

        {/* Help */}
        <button className="p-1.5 transition-colors hover:text-foreground" style={{ color: "#6b8a82" }}>
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center gap-3 pl-4 cursor-pointer group"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="text-right">
            <p className="text-sm font-display font-semibold text-foreground group-hover:text-[#a8ff3e] transition-colors leading-tight">
              Stefan
            </p>
            <p className="text-[10px] leading-tight" style={{ color: "#6b8a82" }}>Acme Corp Ltd</p>
          </div>
          <div
            className="w-9 h-9 rounded-full p-[2px] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #00d4aa, #9b7ff4)" }}
          >
            <div className="w-full h-full rounded-full overflow-hidden" style={{ background: "#050c0e" }}>
              <img src="https://i.pravatar.cc/150?img=59" alt="Stefan" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
