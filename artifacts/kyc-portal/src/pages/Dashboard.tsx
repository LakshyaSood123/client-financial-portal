import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { KPICard } from "@/components/dashboard/KPICard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { WebhookDonut } from "@/components/dashboard/WebhookDonut";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { cn } from "@/lib/utils";
import { MoreHorizontal, AlertTriangle, Key } from "lucide-react";

const FILTERS = ["Overview", "Verification", "Integrations", "Billing"];

const glassCard = "bg-white/[0.04] backdrop-blur-[16px] border border-white/[0.08] rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("Overview");

  return (
    <div className="min-h-screen text-foreground font-sans relative overflow-x-hidden" style={{ background: "#050c0e" }}>
      {/* Atmospheric mesh gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#050c0e" }} />
        <div
          className="absolute"
          style={{
            width: "80%", height: "60%",
            top: "-10%", left: "-10%",
            background: "radial-gradient(ellipse 80% 60% at 10% 20%, #0d3830 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "60%", height: "50%",
            bottom: "-10%", right: "-10%",
            background: "radial-gradient(ellipse 60% 50% at 85% 70%, #0a2a22 0%, transparent 55%)",
          }}
        />
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

              {/* Filter pills */}
              <motion.div
                className="flex items-center gap-1 mt-3 p-1 rounded-xl self-start"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors z-10",
                      activeFilter === f ? "text-[#050c0e]" : "text-[#6b8a82] hover:text-foreground"
                    )}
                  >
                    {activeFilter === f && (
                      <motion.div
                        layoutId="active-filter"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ background: "#a8ff3e", boxShadow: "0 0 20px rgba(168,255,62,0.35)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {f}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <KPICard title="KYB Status" value="Verified" percent={100} color="#00d4aa" delay={0.35} />
              <KPICard title="Ops Status" value="Active" percent={90} color="#a8ff3e" trend={12} delay={0.43} />
              <KPICard title="Risk Tier" value="Low" percent={75} color="#9b7ff4" delay={0.51} />
              <KPICard title="Plan" value="Growth" percent={60} color="#ffb547" trend={-4} delay={0.59} />
            </div>

            {/* Usage Chart + Webhook Donut */}
            <div className="grid grid-cols-12 gap-5 mb-5">
              <UsageChart />
              <WebhookDonut />
            </div>

            {/* Bottom summary cards */}
            <div className="grid grid-cols-2 gap-5">
              {/* Billing Balance */}
              <motion.div
                className={cn(glassCard, "p-5 flex items-center justify-between")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] mb-2" style={{ color: "#6b8a82" }}>
                    Billing Balance
                  </p>
                  <p className="font-display font-bold text-foreground mb-1" style={{ fontSize: 28, letterSpacing: "-0.02em", fontFamily: "'JetBrains Mono', monospace" }}>
                    $0.00
                  </p>
                  <p className="text-xs" style={{ color: "#6b8a82" }}>$250 credit included · resets Apr 1</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(168,255,62,0.15)", color: "#a8ff3e", border: "1px solid rgba(168,255,62,0.2)" }}
                  >
                    No overages
                  </div>
                </div>
              </motion.div>

              {/* API Keys + Webhook Failures */}
              <motion.div
                className={cn(glassCard, "p-5 flex items-center justify-between")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
              >
                <div className="flex gap-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Key className="w-3 h-3" style={{ color: "#6b8a82" }} />
                      <p className="text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "#6b8a82" }}>API Keys</p>
                    </div>
                    <p className="font-display font-bold text-foreground mb-1" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>3</p>
                    <p className="text-xs" style={{ color: "#6b8a82" }}>Active keys</p>
                  </div>
                  <div style={{ width: "1px", background: "rgba(255,255,255,0.06)" }} />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3 h-3" style={{ color: "#6b8a82" }} />
                      <p className="text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "#6b8a82" }}>Hook Failures</p>
                    </div>
                    <p className="font-display font-bold text-foreground mb-1" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>23</p>
                    <p className="text-xs" style={{ color: "#6b8a82" }}>Last 30 days</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 self-start">
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(255,90,90,0.12)", color: "#ff5a5a", border: "1px solid rgba(255,90,90,0.2)" }}
                  >
                    1.8% fail rate
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right panel — fixed width */}
          <div className="flex-shrink-0" style={{ width: 348 }}>
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
