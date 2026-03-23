import { motion } from "framer-motion";
import { Bell, HelpCircle, Shield } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const TAB_ITEMS = [
  { id: "overview",      label: "Overview" },
  { id: "verification",  label: "Verification" },
  { id: "integrations",  label: "Integrations" },
  { id: "billing",       label: "Billing" },
] as const;

const LINK_ITEMS = [
  { label: "API Keys",   href: "/api-keys" },
  { label: "Audit Logs", href: "/audit-logs" },
];

type TabId = typeof TAB_ITEMS[number]["id"];

interface TopNavProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export function TopNav({ activeTab, setActiveTab }: TopNavProps) {
  return (
    <motion.header
      className="sticky top-0 z-40 flex items-center justify-between px-8"
      style={{
        height: 64,
        background: "#EEF4F8",
        borderBottom: "1px solid rgba(79,124,255,0.1)",
      }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-6">
        {/* Logo pill */}
        <div
          className="px-4 py-1.5 rounded-full cursor-pointer select-none shrink-0"
          style={{ border: "1.5px solid #1E293B" }}
        >
          <span className="font-display font-bold text-sm" style={{ color: "#0F172A", letterSpacing: "-0.01em" }}>
            Nexus<span style={{ color: "#4F7CFF" }}>KYC</span>
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex items-center gap-0.5">
          {TAB_ITEMS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors z-10",
                activeTab === tab.id ? "text-white" : "text-[#94A3B8] hover:text-[#111827]"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-top-nav"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{ background: "#4F7CFF" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab.label}
            </button>
          ))}

          <div className="w-px h-4 mx-2" style={{ background: "rgba(79,124,255,0.15)" }} />

          {LINK_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-[#94A3B8] hover:text-[#111827] transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-[#94A3B8] hover:text-[#111827] transition-colors whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Health pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22C55E" }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#22C55E" }} />
          All systems operational
        </div>

        {/* Bell */}
        <button className="relative p-1.5 rounded-full hover:bg-[rgba(79,124,255,0.08)] transition-colors" style={{ color: "#94A3B8" }}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#f54a4a", border: "1.5px solid #EEF4F8" }} />
        </button>

        {/* Help */}
        <button className="p-1.5 rounded-full hover:bg-[rgba(79,124,255,0.08)] transition-colors" style={{ color: "#94A3B8" }}>
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 24, background: "rgba(79,124,255,0.12)" }} />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #4F7CFF, #3B6AF3)", color: "#ffffff" }}
          >
            C
          </div>
          <p className="text-sm font-display font-semibold group-hover:text-[#4F7CFF] transition-colors" style={{ color: "#111827" }}>
            Client
          </p>
        </div>
      </div>
    </motion.header>
  );
}
