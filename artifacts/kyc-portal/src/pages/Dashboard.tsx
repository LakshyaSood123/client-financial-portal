import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { KPICard } from "@/components/dashboard/KPICard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { WebhookDonut } from "@/components/dashboard/WebhookDonut";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Key, AlertTriangle, ScrollText, BookOpen } from "lucide-react";

const TABS = ["Overview", "Verification", "Integrations", "Billing"];

const glassCard = "bg-white/[0.04] backdrop-blur-[16px] border border-white/[0.08] rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

const BOTTOM_CARDS = [
  {
    label: "Billing Balance",
    value: "$0.00",
    sub: "$250 credit included · resets Apr 1",
    badge: "No overages",
    badgeColor: "#a8ff3e",
    badgeBg: "rgba(168,255,62,0.12)",
    href: "/billing",
    icon: BookOpen,
    iconColor: "#a8ff3e",
  },
  {
    label: "API Keys Active",
    value: "3",
    sub: "2 production · 1 sandbox",
    badge: "All valid",
    badgeColor: "#00d4aa",
    badgeBg: "rgba(0,212,170,0.12)",
    href: "/api-keys",
    icon: Key,
    iconColor: "#00d4aa",
  },
  {
    label: "Webhook Failures",
    value: "23",
    sub: "Last 30 days · 1.8% fail rate",
    badge: "Review needed",
    badgeColor: "#ff5a5a",
    badgeBg: "rgba(255,90,90,0.12)",
    href: "/webhooks",
    icon: AlertTriangle,
    iconColor: "#ff5a5a",
  },
  {
    label: "Audit Events",
    value: "847",
    sub: "March 2026 · exportable",
    badge: "Up to date",
    badgeColor: "#9b7ff4",
    badgeBg: "rgba(155,127,244,0.12)",
    href: "/audit-logs",
    icon: ScrollText,
    iconColor: "#9b7ff4",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen text-foreground font-sans relative overflow-x-hidden" style={{ background: "#050c0e" }}>
      {/* Atmospheric mesh gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#050c0e" }} />
        <div className="absolute" style={{
          width: "80%", height: "60%",
          top: "-10%", left: "-10%",
          background: "radial-gradient(ellipse 80% 60% at 10% 20%, #0d3830 0%, transparent 60%)",
        }} />
        <div className="absolute" style={{
          width: "60%", height: "50%",
          bottom: "-10%", right: "-10%",
          background: "radial-gradient(ellipse 60% 50% at 85% 70%, #0a2a22 0%, transparent 55%)",
        }} />
      </div>

      <Sidebar />
      <TopBar />

      <main className="relative z-10" style={{ marginLeft: 72 }}>
        <div className="flex min-h-screen">
          {/* Main content */}
          <div className="flex-1 min-w-0 p-8 pr-4" style={{ minWidth: 0 }}>

            {/* Header */}
            <div className="flex flex-col gap-2 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
              >
                <h1
                  className="font-display font-bold text-foreground"
                  style={{ fontSize: 38, letterSpacing: "-0.03em", lineHeight: 1.1 }}
                >
                  Account Overview
                </h1>
                <p className="text-sm font-sans mt-1" style={{ color: "#6b8a82" }}>
                  KYB progress, integration health, billing status, and recent activity
                </p>
              </motion.div>

              {/* Tab strip */}
              <motion.div
                className="flex items-center gap-1 mt-3 p-1 rounded-xl self-start"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors z-10",
                      activeTab === tab ? "text-[#050c0e]" : "text-[#6b8a82] hover:text-foreground"
                    )}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ background: "#a8ff3e", boxShadow: "0 0 20px rgba(168,255,62,0.35)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {tab}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* KPI Cards — no fake trend badges */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <KPICard title="KYB Status" value="Verified" percent={100} color="#00d4aa" delay={0.35} />
              <KPICard title="Ops Status" value="Active" percent={90} color="#a8ff3e" delay={0.43} />
              <KPICard title="Risk Tier" value="Low" percent={75} color="#9b7ff4" delay={0.51} />
              <KPICard title="Plan" value="Growth" percent={60} color="#ffb547" delay={0.59} />
            </div>

            {/* Usage Chart + Webhook Donut */}
            <div className="grid grid-cols-12 gap-5 mb-5">
              <UsageChart />
              <WebhookDonut />
            </div>

            {/* Bottom summary cards — 4 columns, all with real navigation */}
            <div className="grid grid-cols-4 gap-4">
              {BOTTOM_CARDS.map((card, i) => (
                <motion.div
                  key={card.label}
                  className={cn(glassCard, "p-5 flex flex-col gap-3 group cursor-pointer")}
                  style={{ transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 + i * 0.07 }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${card.iconColor}18`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: card.badgeBg }}
                    >
                      <card.icon className="w-4 h-4" style={{ color: card.iconColor }} />
                    </div>
                    <Link
                      href={card.href}
                      className="text-[10px] font-semibold transition-colors hover:opacity-80"
                      style={{ color: card.iconColor }}
                    >
                      View →
                    </Link>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-1" style={{ color: "#6b8a82" }}>
                      {card.label}
                    </p>
                    <p
                      className="font-display font-bold text-foreground"
                      style={{ fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1, fontFamily: card.label === "Billing Balance" ? "'JetBrains Mono', monospace" : undefined }}
                    >
                      {card.value}
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: "#6b8a82" }}>{card.sub}</p>
                  </div>

                  <div
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold w-fit"
                    style={{ background: card.badgeBg, color: card.badgeColor }}
                  >
                    {card.badge}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-shrink-0" style={{ width: 348 }}>
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
