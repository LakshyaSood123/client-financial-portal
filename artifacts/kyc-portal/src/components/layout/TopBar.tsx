import { Search, Bell, HelpCircle, ChevronRight, Command } from "lucide-react";
import { motion } from "framer-motion";

export function TopBar() {
  return (
    <motion.header
      className="flex items-center justify-between px-8 z-40 sticky top-0"
      style={{
        height: 64,
        marginLeft: 72,
        background: "rgba(5,12,14,0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm shrink-0">
        <span className="text-[#6b8a82] font-medium hover:text-foreground cursor-pointer transition-colors">Portal</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#3d5a52]" />
        <span className="text-foreground font-medium" style={{ fontSize: 15 }}>Account Overview</span>
      </div>

      {/* Search bar */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative group w-full max-w-[420px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a82] group-focus-within:text-[#00d4aa] transition-colors" />
          <input
            type="text"
            placeholder="Search verifications, webhooks, API keys…"
            className="w-full h-10 text-sm text-foreground placeholder:text-[#3d5a52] pr-16 pl-11 rounded-3xl outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={e => {
              (e.target as HTMLInputElement).style.borderColor = "#00d4aa";
              (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(0,212,170,0.15)";
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
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5 shrink-0">
        {/* Live status */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#a8ff3e" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#a8ff3e" }} />
          </span>
          <span style={{ color: "#a8ff3e" }}>Live</span>
        </div>

        {/* Date range */}
        <button
          className="text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors hover:bg-white/10"
          style={{
            color: "#6b8a82",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Mar 1 – Mar 23
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 text-[#6b8a82] hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: "#ff5a5a", border: "1.5px solid #050c0e" }}
          />
        </button>

        {/* Help */}
        <button className="p-1.5 text-[#6b8a82] hover:text-foreground transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-4 cursor-pointer group" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm font-display font-semibold text-foreground group-hover:text-[#a8ff3e] transition-colors">
            Hi Stefan!
          </p>
          <div
            className="w-9 h-9 rounded-full p-[2px]"
            style={{ background: "linear-gradient(135deg, #00d4aa, #9b7ff4)" }}
          >
            <div className="w-full h-full rounded-full overflow-hidden" style={{ background: "#050c0e" }}>
              <img
                src="https://i.pravatar.cc/150?img=59"
                alt="Stefan"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
