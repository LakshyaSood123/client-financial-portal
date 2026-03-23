import { motion } from "framer-motion";
import { AdminLayout } from "./AdminLayout";
import { Users, CheckCircle2, XCircle, Clock, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// ─── Design tokens ──────────────────────────────────────────────
const CARD    = "#c3d3e6";      // tonal — slightly darker than page bg
const DARK    = "#0e1219";      // near-black accent surfaces
const TEXT    = "#0d1221";
const MUTED   = "#7b8fad";
const R       = 22;             // border radius

const tCard: React.CSSProperties = {
  background: CARD,
  borderRadius: R,
  padding: 16,
};
const dCard: React.CSSProperties = {
  background: DARK,
  borderRadius: R,
  padding: 24,
  color: "#ffffff",
};

// ─── Data ────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Clients",  value: "2,847", delta: "+124 this month", icon: Users,        up: true  },
  { label: "Pending KYC",    value: "14",    delta: "Needs review",    icon: Clock,        up: null  },
  { label: "Approved Today", value: "38",    delta: "+18% vs yesterday",icon: CheckCircle2, up: true  },
  { label: "Rejected Today", value: "5",     delta: "2.4% reject rate", icon: XCircle,     up: false },
];

const volumeData = [
  { name: "Mon", approved: 32, rejected: 4 },
  { name: "Tue", approved: 45, rejected: 7 },
  { name: "Wed", approved: 28, rejected: 3 },
  { name: "Thu", approved: 51, rejected: 8 },
  { name: "Fri", approved: 38, rejected: 5 },
  { name: "Sat", approved: 12, rejected: 2 },
  { name: "Sun", approved: 8,  rejected: 1 },
];

const trendData = Array.from({ length: 28 }, (_, i) => ({
  v: 40 + Math.sin(i * 0.4) * 14 + i * 0.8,
}));

const RECENT = [
  { id: "KYC-2847", name: "Acme Corp Ltd",  type: "Business",   status: "approved", time: "2 min ago",  risk: "Low"    },
  { id: "KYC-2846", name: "David Chen",     type: "Individual", status: "pending",  time: "8 min ago",  risk: "Medium" },
  { id: "KYC-2845", name: "Nova Ventures",  type: "Business",   status: "rejected", time: "14 min ago", risk: "High"   },
  { id: "KYC-2844", name: "Sarah Williams", type: "Individual", status: "approved", time: "22 min ago", risk: "Low"    },
  { id: "KYC-2843", name: "GlobalPay Inc",  type: "Business",   status: "pending",  time: "31 min ago", risk: "Medium" },
];

const ALERTS = [
  { title: "High-risk jurisdiction",  sub: "Vertex Capital · Caymans",   severity: "critical" },
  { title: "PEP match detected",      sub: "David Chen · Screening hit",  severity: "high"     },
  { title: "UBO verification pending",sub: "NexGen Logistics · 12 h old", severity: "medium"   },
];

const STATUS: Record<string, { color: string; bg: string; label: string }> = {
  approved: { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  label: "Approved" },
  pending:  { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  label: "Pending"  },
  rejected: { color: "#f87171", bg: "rgba(248,113,113,0.12)", label: "Rejected" },
};
const RISK_COLOR: Record<string, string> = { Low: "#4ade80", Medium: "#fbbf24", High: "#f87171" };
const SEV_COLOR: Record<string, string> = { critical: "#f87171", high: "#fbbf24", medium: "#94a3b8" };

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
});

export default function AdminOverview() {
  return (
    <AdminLayout>
      <div className="px-8 pt-5 pb-8 space-y-4">

        {/* ── Header ── */}
        <motion.div {...fade(0.05)}>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, color: TEXT }}>
            Good morning, Admin
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            KYC system overview — March 23, 2026
          </p>
        </motion.div>

        {/* ── Top section: KPI row + dark right panel ── */}
        <div className="flex gap-5 items-start">

          {/* Left: KPIs + chart */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div key={s.label} style={tCard} {...fade(0.1 + i * 0.06)}>
                  <div className="flex items-start justify-between mb-3">
                    <s.icon className="w-5 h-5" style={{ color: MUTED, strokeWidth: 1.5 }} />
                    {s.up !== null && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: s.up ? "rgba(74,222,128,0.14)" : "rgba(248,113,113,0.14)",
                          color: s.up ? "#4ade80" : "#f87171",
                        }}
                      >
                        {s.up ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                  <p className="font-display font-black" style={{ fontSize: 32, letterSpacing: "-0.04em", lineHeight: 1, color: TEXT }}>
                    {s.value}
                  </p>
                  <p className="text-[11px] font-semibold mt-1.5 uppercase tracking-wide" style={{ color: MUTED }}>
                    {s.label}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: s.up === true ? "#4ade80" : s.up === false ? "#f87171" : MUTED }}>
                    {s.delta}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-12 gap-4">
              {/* Approval Rate sparkline */}
              <motion.div style={{ ...tCard, gridColumn: "span 4" }} className="col-span-4 flex flex-col" {...fade(0.32)}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>Approval Rate</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="font-display font-black" style={{ fontSize: 38, letterSpacing: "-0.04em", lineHeight: 1, color: TEXT }}>
                    88.4%
                  </span>
                  <span className="text-xs font-bold mb-1" style={{ color: "#4ade80" }}>+2.1%</span>
                </div>
                <div className="flex-1" style={{ height: 56 }}>
                  <ResponsiveContainer width="100%" height={56}>
                    <AreaChart data={trendData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ovTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={TEXT} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={TEXT} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke={TEXT} strokeWidth={1.5} fill="url(#ovTrend)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* KYC Volume bar chart */}
              <motion.div style={{ ...tCard, gridColumn: "span 8" }} className="col-span-8" {...fade(0.36)}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>KYC Volume</p>
                    <p className="text-xs mt-0.5" style={{ color: MUTED }}>Weekly approved vs rejected</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]" style={{ color: MUTED }}>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: TEXT }} />Approved
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#f87171" }} />Rejected
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={volumeData} barGap={3} barCategoryGap="38%">
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: MUTED, fontSize: 11, fontFamily: "Satoshi" }} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fill: MUTED, fontSize: 10, fontFamily: "Satoshi" }} width={28} />
                    <Tooltip
                      cursor={{ fill: "rgba(13,18,33,0.06)", radius: 8 }}
                      contentStyle={{ background: DARK, border: "none", borderRadius: 12, color: "#fff" }}
                      labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="approved" fill={TEXT} radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="rejected" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>

          {/* ── Dark right panel ── */}
          <div className="flex flex-col gap-4" style={{ width: 256, flexShrink: 0 }}>

            {/* System status dark card */}
            <motion.div style={dCard} {...fade(0.18)}>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-50" />
                  <span className="relative rounded-full h-2 w-2 bg-green-400" />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                  System Status
                </p>
              </div>
              <p className="font-display font-bold text-white" style={{ fontSize: 20, letterSpacing: "-0.02em", marginBottom: 16 }}>
                All systems operational
              </p>

              <div className="space-y-3">
                {[
                  { label: "KYC Engine",    pct: 99 },
                  { label: "API Gateway",   pct: 100 },
                  { label: "Risk Scoring",  pct: 97 },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-[11px] mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span>{s.label}</span><span>{s.pct}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "#4ade80" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-5 h-9 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                View status page
              </button>
            </motion.div>

            {/* Risk alerts dark card */}
            <motion.div style={dCard} {...fade(0.24)}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Live Risk Alerts
                </p>
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
              </div>
              <div className="space-y-3">
                {ALERTS.map((a, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: SEV_COLOR[a.severity] }} />
                    <div>
                      <p className="text-[12px] font-semibold leading-tight" style={{ color: "#ffffff" }}>{a.title}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{a.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                className="w-full mt-5 h-9 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                View all alerts →
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom: Recent Activity + dark event ── */}
        <div className="flex gap-5 items-start">

          {/* Recent activity */}
          <motion.div style={{ ...tCard, flex: 1, padding: 24 }} {...fade(0.42)}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: MUTED }}>Recent KYC Activity</p>
                <p className="font-display font-bold" style={{ fontSize: 17, color: TEXT }}>Latest submissions</p>
              </div>
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                style={{ background: "rgba(13,18,33,0.08)", color: TEXT }}
                onClick={() => { window.history.pushState(null, '', '/admin/kyc-queue'); window.dispatchEvent(new PopStateEvent('popstate')); }}
              >
                View queue →
              </button>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider px-3 mb-2" style={{ color: MUTED }}>
              <span className="col-span-1">ID</span>
              <span className="col-span-3">Name</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-2">Risk</span>
              <span className="col-span-2">Time</span>
              <span className="col-span-2 text-right">Status</span>
            </div>

            <div className="space-y-1">
              {RECENT.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="grid grid-cols-12 items-center h-12 px-3 rounded-xl cursor-pointer transition-all duration-150"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(13,18,33,0.06)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <span className="col-span-1 font-mono text-[10px]" style={{ color: MUTED }}>{item.id.slice(-4)}</span>
                  <span className="col-span-3 text-sm font-semibold" style={{ color: TEXT }}>{item.name}</span>
                  <span className="col-span-2 text-xs" style={{ color: MUTED }}>{item.type}</span>
                  <span className="col-span-2 text-xs font-semibold" style={{ color: RISK_COLOR[item.risk] }}>● {item.risk}</span>
                  <span className="col-span-2 text-[11px]" style={{ color: MUTED }}>{item.time}</span>
                  <div className="col-span-2 flex justify-end">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{ background: STATUS[item.status].bg, color: STATUS[item.status].color }}
                    >
                      {STATUS[item.status].label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dark: upcoming review */}
          <motion.div style={{ ...dCard, width: 256, flexShrink: 0 }} {...fade(0.46)}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.35)" }} />
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                Upcoming Review
              </p>
            </div>
            <p className="font-display font-bold text-white mb-1" style={{ fontSize: 18, letterSpacing: "-0.02em" }}>
              Board Compliance Meeting
            </p>
            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Mar 25 · 10:00 AM</p>

            <div className="space-y-3 mb-5">
              {[
                { label: "Pending reviews",     val: "14 items" },
                { label: "High-risk flagged",   val: "3 cases"  },
                { label: "Avg processing time", val: "4.2 h"    },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{r.label}</span>
                  <span className="text-[11px] font-bold text-white">{r.val}</span>
                </div>
              ))}
            </div>

            <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.07)" }} />

            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                Today's queue breakdown
              </p>
              {[
                { label: "Approved",  val: 38, color: "#4ade80" },
                { label: "Pending",   val: 14, color: "#fbbf24" },
                { label: "Rejected",  val: 5,  color: "#f87171" },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: b.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(b.val / 57) * 100}%` }}
                      transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: b.color, minWidth: 20, textAlign: "right" }}>{b.val}</span>
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)", minWidth: 52 }}>{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </AdminLayout>
  );
}
