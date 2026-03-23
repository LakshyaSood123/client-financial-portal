import { motion } from "framer-motion";
import { TrendingUp, Calendar, Download, BookOpen, Zap } from "lucide-react";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const lightCard = {
  background: "#ffffff",
  border: "1px solid rgba(79,124,255,0.08)",
  borderRadius: 20,
  boxShadow: "0 1px 8px rgba(79,124,255,0.05)",
} as React.CSSProperties;

const USAGE_DATA = [
  { month: "Oct", jobs: 312 },
  { month: "Nov", jobs: 548 },
  { month: "Dec", jobs: 491 },
  { month: "Jan", jobs: 703 },
  { month: "Feb", jobs: 867 },
  { month: "Mar", jobs: 1124 },
];

const LEDGER = [
  { description: "Monthly plan — Growth",          type: "credit", amount: "₹250.00", date: "Mar 1, 2026", balance: "₹250.00" },
  { description: "Jobs processed (1,124 × ₹0.00)", type: "usage",  amount: "₹0.00",   date: "Mar 1–23",    balance: "₹250.00" },
  { description: "Monthly plan — Growth",          type: "credit", amount: "₹250.00", date: "Feb 1, 2026", balance: "₹250.00" },
  { description: "Jobs processed (867 × ₹0.00)",   type: "usage",  amount: "₹0.00",   date: "Feb 1–28",    balance: "₹250.00" },
];

const TYPE_STYLES: Record<string, { color: string; bg: string }> = {
  credit: { color: "#4F7CFF", bg: "rgba(79,124,255,0.08)" },
  usage:  { color: "#94A3B8", bg: "rgba(79,124,255,0.03)" },
  charge: { color: "#f54a4a", bg: "rgba(245,74,74,0.1)" },
};

const PLAN_FEATURES = [
  "5,000 verification jobs / month",
  "3 production API keys",
  "Unlimited webhook endpoints",
  "Audit log retention — 12 months",
  "Email support + SLA",
];

const item = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
};

export function BillingTab() {
  const usedJobs = 1124;
  const planJobs = 5000;
  const usedPct = (usedJobs / planJobs) * 100;

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top row: Balance + Plan + Cycle */}
      <div className="grid grid-cols-3 gap-5">

        {/* Current balance */}
        <motion.div style={lightCard} className="p-6" custom={0} variants={item} initial="hidden" animate="show">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Current Balance</p>
              <p className="font-display font-bold" style={{ fontSize: 36, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace", color: "#111827" }}>
                ₹0.00
              </p>
              <p className="text-xs mt-2" style={{ color: "#94A3B8" }}>₹250 included credit · no overages</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(79,124,255,0.1)" }}>
              <BookOpen className="w-5 h-5" style={{ color: "#4F7CFF" }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: "rgba(79,124,255,0.1)", color: "#4F7CFF" }}>
              No overages
            </div>
            <div className="flex items-center gap-1 text-[10px]" style={{ color: "#94A3B8" }}>
              <Calendar className="w-3 h-3" /> Resets Apr 1
            </div>
          </div>
        </motion.div>

        {/* Plan — soft blue highlight card */}
        <motion.div
          style={{ ...lightCard, background: "linear-gradient(135deg, #EAF3FF 0%, #DCE7FF 100%)", border: "1px solid rgba(79,124,255,0.15)" }}
          className="p-6"
          custom={1} variants={item} initial="hidden" animate="show"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Current Plan</p>
              <p className="font-display font-bold" style={{ fontSize: 28, letterSpacing: "-0.02em", color: "#111827" }}>Growth</p>
              <p className="text-xs mt-2" style={{ color: "#4F7CFF" }}>₹250 / month · included</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(79,124,255,0.15)" }}>
              <Zap className="w-5 h-5" style={{ color: "#4F7CFF" }} />
            </div>
          </div>
          <div className="space-y-1.5">
            {PLAN_FEATURES.slice(0, 3).map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]" style={{ color: "#475569" }}>
                <span style={{ color: "#4F7CFF" }}>✓</span> {f}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Usage this cycle */}
        <motion.div style={lightCard} className="p-6" custom={2} variants={item} initial="hidden" animate="show">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Usage This Cycle</p>
              <div className="flex items-end gap-2">
                <span className="font-display font-bold" style={{ fontSize: 28, letterSpacing: "-0.02em", color: "#111827" }}>1,124</span>
                <span className="text-sm mb-1" style={{ color: "#94A3B8" }}>/ 5,000 jobs</span>
              </div>
              <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Mar 1 – Mar 23, 2026</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,111,244,0.1)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "#8b6ff4" }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]" style={{ color: "#94A3B8" }}>
              <span>{usedPct.toFixed(1)}% of limit used</span>
              <span style={{ color: "#8b6ff4" }}>{(planJobs - usedJobs).toLocaleString()} remaining</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(79,124,255,0.08)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #4F7CFF, #22C55E)" }}
                initial={{ width: 0 }}
                animate={{ width: `${usedPct}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Usage chart + Ledger */}
      <div className="grid grid-cols-12 gap-5">

        {/* Usage chart */}
        <motion.div style={{ ...lightCard, gridColumn: "span 5" }} className="col-span-5 p-6" custom={3} variants={item} initial="hidden" animate="show">
          <h3 className="font-display font-bold mb-1" style={{ fontSize: 18, color: "#111827" }}>Monthly Job Usage</h3>
          <p className="text-xs mb-5" style={{ color: "#94A3B8" }}>Last 6 months</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={USAGE_DATA} barCategoryGap="35%" margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${v / 1000}K` : String(v)} />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid rgba(79,124,255,0.1)", borderRadius: 10, boxShadow: "0 4px 12px rgba(79,124,255,0.08)" }}
                labelStyle={{ color: "#94A3B8", fontSize: 11 }}
                formatter={(v: number) => [`${v.toLocaleString()} jobs`, "Jobs"]}
              />
              <Bar dataKey="jobs" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {USAGE_DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.month === "Mar" ? "#4F7CFF" : "rgba(79,124,255,0.15)"}
                    style={entry.month === "Mar" ? { filter: "drop-shadow(0 0 6px rgba(79,124,255,0.4))" } : undefined}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Billing ledger */}
        <motion.div style={{ ...lightCard, gridColumn: "span 7" }} className="col-span-7 p-6" custom={4} variants={item} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#111827" }}>Billing Ledger</h3>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Credits and usage charges</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: "rgba(79,124,255,0.06)", color: "#94A3B8", border: "1px solid rgba(79,124,255,0.1)" }}>
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-4 px-3 mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
            <span className="col-span-2">Description</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Balance</span>
          </div>

          <div className="space-y-1">
            {LEDGER.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center px-3 h-12 rounded-xl text-sm transition-all"
                style={{ background: i === 0 ? "rgba(79,124,255,0.03)" : "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(79,124,255,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = i === 0 ? "rgba(79,124,255,0.03)" : "transparent")}
              >
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TYPE_STYLES[row.type].color }} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "#111827" }}>{row.description}</p>
                    <p className="text-[10px]" style={{ color: "#94A3B8" }}>{row.date}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-right" style={{ color: TYPE_STYLES[row.type].color }}>{row.amount}</span>
                <span className="text-xs font-mono text-right" style={{ color: "#111827" }}>{row.balance}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 flex items-center justify-between text-xs" style={{ borderTop: "1px solid rgba(79,124,255,0.08)", color: "#94A3B8" }}>
            <span>Showing last 4 entries</span>
            <Link href="/billing" className="font-semibold hover:text-[#4F7CFF] transition-colors" style={{ color: "#94A3B8" }}>
              Full billing history →
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
