import { motion } from "framer-motion";
import { AccountSummaryCard } from "./AccountSummaryCard";
import { ChevronRight, Key, Webhook, Upload, FileText, RefreshCw, CheckCircle2, Circle } from "lucide-react";
import { Link } from "wouter";

const ACTIVITY = [
  { id: 1, label: "API key rotated",       detail: "prod_key_**** → new key",         time: "Mar 22", icon: Key,       color: "#F97316", bg: "rgba(249,115,22,0.1)" },
  { id: 2, label: "Webhook test sent",     detail: "endpoint: /hooks/kyb",            time: "Mar 21", icon: Webhook,   color: "#8b6ff4", bg: "rgba(139,111,244,0.1)" },
  { id: 3, label: "KYB document uploaded", detail: "Certificate of Incorporation",    time: "Mar 20", icon: Upload,    color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  { id: 4, label: "Audit log exported",    detail: "March 2026 · 847 events",         time: "Mar 19", icon: FileText,  color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { id: 5, label: "Delivery replayed",     detail: "evt_8xKp2mNq · success",          time: "Mar 18", icon: RefreshCw, color: "#f54a4a", bg: "rgba(245,74,74,0.1)" },
];

const ONBOARDING = [
  { label: "KYB verification completed",        done: true },
  { label: "First API key created",             done: true },
  { label: "Webhook endpoint configured",       done: true },
  { label: "Test webhook delivery confirmed",   done: false },
  { label: "Go live in production",             done: false },
];

export function RightPanel() {
  const done = ONBOARDING.filter(s => s.done).length;
  const total = ONBOARDING.length;

  return (
    <motion.div
      className="flex flex-col"
      style={{
        background: "#FAF8F4",
        borderLeft: "1px solid rgba(120,90,50,0.08)",
        minHeight: "100%",
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="flex flex-col gap-6 p-6">

        {/* Account Summary */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold" style={{ fontSize: 18, color: "#1C1917" }}>Account Summary</h2>
          </div>
          <AccountSummaryCard />
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold" style={{ fontSize: 18, color: "#1C1917" }}>Recent Activity</h2>
            <Link
              href="/audit-logs"
              className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-[#1C1917]"
              style={{ color: "#F97316" }}
            >
              Audit Logs <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-0.5">
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 h-14 px-3 rounded-xl cursor-pointer transition-all duration-150"
                style={{ borderLeft: "2px solid transparent" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(120,90,50,0.04)";
                  (e.currentTarget as HTMLElement).style.borderLeftColor = "#F97316";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#1C1917" }}>
                    {item.label}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "#A09080" }}>{item.detail}</p>
                </div>
                <span className="text-[10px] flex-shrink-0 font-mono" style={{ color: "#A09080" }}>{item.time}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Onboarding progress — warm blush surface */}
        <section
          className="rounded-2xl p-4"
          style={{
            background: "#EBE1D5",
            border: "1px solid rgba(120,90,50,0.08)",
            boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold" style={{ fontSize: 16, color: "#1C1917" }}>Onboarding</h2>
            <span className="text-xs font-mono" style={{ color: "#A09080" }}>{done}/{total} complete</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(120,90,50,0.1)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #F97316, #F59E0B)" }}
              initial={{ width: 0 }}
              animate={{ width: `${(done / total) * 100}%` }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            />
          </div>

          <div className="space-y-2.5">
            {ONBOARDING.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.07 }}
              >
                {step.done
                  ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#22C55E" }} />
                  : <Circle className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(120,90,50,0.25)" }} />
                }
                <span
                  className="text-xs"
                  style={{
                    color: step.done ? "#A09080" : "#57493C",
                    textDecoration: step.done ? "line-through" : undefined,
                  }}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
