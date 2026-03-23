import { motion } from "framer-motion";
import { AccountSummaryCard } from "./AccountSummaryCard";
import { ChevronRight, Key, Webhook, Upload, FileText, RefreshCw, CheckCircle2, Circle } from "lucide-react";
import { Link } from "wouter";

const ACTIVITY = [
  { id: 1, label: "API key rotated",       detail: "prod_key_**** → new key",         time: "Mar 22", icon: Key,       color: "#efc92d", bg: "rgba(239,201,45,0.12)" },
  { id: 2, label: "Webhook test sent",     detail: "endpoint: /hooks/kyb",            time: "Mar 21", icon: Webhook,   color: "#8b6ff4", bg: "rgba(139,111,244,0.12)" },
  { id: 3, label: "KYB document uploaded", detail: "Certificate of Incorporation",    time: "Mar 20", icon: Upload,    color: "#00b896", bg: "rgba(0,184,150,0.12)" },
  { id: 4, label: "Audit log exported",    detail: "March 2026 · 847 events",         time: "Mar 19", icon: FileText,  color: "#f59b20", bg: "rgba(245,155,32,0.12)" },
  { id: 5, label: "Delivery replayed",     detail: "evt_8xKp2mNq · success",          time: "Mar 18", icon: RefreshCw, color: "#f54a4a", bg: "rgba(245,74,74,0.12)" },
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
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        borderLeft: "1px solid rgba(0,0,0,0.07)",
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
            <h2 className="font-display font-bold" style={{ fontSize: 18, color: "#1a1a1a" }}>Account Summary</h2>
          </div>
          <AccountSummaryCard />
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold" style={{ fontSize: 18, color: "#1a1a1a" }}>Recent Activity</h2>
            <Link
              href="/audit-logs"
              className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-[#efc92d]"
              style={{ color: "#00b896" }}
            >
              Audit Logs <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-0.5">
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 h-14 px-3 rounded-xl cursor-pointer group transition-all duration-150"
                style={{ borderLeft: "2px solid transparent" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.03)";
                  (e.currentTarget as HTMLElement).style.borderLeftColor = "#efc92d";
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
                  <p className="text-sm font-semibold truncate group-hover:text-[#1a1a1a] transition-colors" style={{ color: "#1a1a1a" }}>
                    {item.label}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "#8a8a8a" }}>{item.detail}</p>
                </div>
                <span className="text-[10px] flex-shrink-0 font-mono" style={{ color: "#b5b2ab" }}>{item.time}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Onboarding progress */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold" style={{ fontSize: 18, color: "#1a1a1a" }}>Onboarding</h2>
            <span className="text-xs font-mono" style={{ color: "#8a8a8a" }}>{done}/{total} complete</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #00b896, #efc92d)" }}
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
                  ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#00b896" }} />
                  : <Circle className="w-4 h-4 flex-shrink-0" style={{ color: "#c0bab0" }} />
                }
                <span
                  className="text-xs"
                  style={{
                    color: step.done ? "#b5b2ab" : "#8a8a8a",
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
