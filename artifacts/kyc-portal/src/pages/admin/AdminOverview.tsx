import { motion } from "framer-motion";
import { Users, Clock3, ShieldCheck, AlertTriangle, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AdminLayout, SURF_SUPPORT, SURF_DEFAULT, SURF_ANALYTIC, DARK_1, DARK_2, TEXT, MUTED, cardShell } from "./AdminLayout";
import { useAdminTilt } from "@/hooks/useAdminTilt";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const R = 22;

const mkCard = (bg: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  ...cardShell,
  background: bg,
  borderRadius: R,
  padding: 16,
  ...extra,
});

const STATS = [
  { label: "Total Clients", value: "2,847", delta: "+124 this month", icon: Users, trend: "up", tone: "positive" },
  { label: "Pending Review", value: "14", delta: "4 older than SLA", icon: Clock3, trend: null, tone: null },
  { label: "", value: "Blank", delta: "", icon: ShieldCheck, trend: null, tone: null },
  { label: "Escalations Open", value: "6", delta: "+2 in last 24h", icon: AlertTriangle, trend: "up", tone: "negative" },
] as const;

const billingStatusData = [
  { status: "Healthy", count: 1824, fill: "#4ade80" },
  { status: "Low balance", count: 611, fill: "#fbbf24" },
  { status: "Overdue", count: 289, fill: "#f87171" },
  { status: "Locked", count: 123, fill: "#94a3b8" },
];

const webhookFailureData = [
  { day: "Mon", failures: 7, retried: 5 },
  { day: "Tue", failures: 11, retried: 8 },
  { day: "Wed", failures: 6, retried: 4 },
  { day: "Thu", failures: 14, retried: 10 },
  { day: "Fri", failures: 9, retried: 7 },
  { day: "Sat", failures: 3, retried: 2 },
  { day: "Sun", failures: 2, retried: 2 },
];

const RECENT = [
  { id: "KYC-2847", name: "Anime Corp Ltd", type: "Business", status: "approved", time: "2 min ago", risk: "Low" },
  { id: "KYC-2846", name: "David Chen", type: "Individual", status: "pending", time: "8 min ago", risk: "Medium" },
  { id: "KYC-2845", name: "Nova Ventures", type: "Business", status: "rejected", time: "14 min ago", risk: "High" },
  { id: "KYC-2844", name: "Sarah Williams", type: "Individual", status: "approved", time: "22 min ago", risk: "Low" },
  { id: "KYC-2843", name: "GlobalPay Inc", type: "Business", status: "pending", time: "31 min ago", risk: "Medium" },
];

const ALERTS = [
  { title: "High-risk jurisdiction", sub: "Vertex Capital · Caymans", severity: "critical" },
  { title: "PEP match detected", sub: "David Chen · Screening hit", severity: "high" },
  { title: "UBO verification pending", sub: "NexGen Logistics · 12 h old", severity: "medium" },
];

const STATUS: Record<string, { label: string; className: string }> = {
  approved: { label: "Approved", className: "admin-pill admin-pill-positive" },
  pending: { label: "Pending", className: "admin-pill admin-pill-warning" },
  rejected: { label: "Rejected", className: "admin-pill admin-pill-negative" },
};

const RISK_COLOR: Record<string, string> = { Low: "#4ade80", Medium: "#fbbf24", High: "#f87171" };
const SEV_COLOR: Record<string, string> = { critical: "#f87171", high: "#fbbf24", medium: "#94a3b8" };
const SEVERITY_CLASS: Record<string, string> = {
  critical: "admin-pill admin-pill-negative",
  high: "admin-pill admin-pill-warning",
  medium: "admin-pill admin-pill-neutral",
};

const darkCard: React.CSSProperties = {
  borderRadius: R,
  padding: 24,
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.04)",
};

const STANDARD_EASE = [0.16, 1, 0.3, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: STANDARD_EASE },
});

function OverviewKpiCard({
  stat,
  delay,
}: {
  stat: (typeof STATS)[number];
  delay: number;
}) {
  const tilt = useAdminTilt(3.5);
  const trendClass =
    stat.tone === "positive"
      ? "admin-pill admin-pill-positive"
      : stat.tone === "negative"
        ? "admin-pill admin-pill-negative"
        : "";

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={mkCard(SURF_DEFAULT)}
      className="admin-panel admin-panel-hover admin-kpi"
      {...fade(delay)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="admin-kpi-icon"
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <stat.icon className="w-5 h-5" style={{ color: MUTED, strokeWidth: 1.6 }} />
        </div>
        {stat.trend && stat.tone && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trendClass}`}>
            {stat.trend === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
      <p className="font-display font-black" style={{ fontSize: 34, letterSpacing: "-0.05em", lineHeight: 1, color: TEXT }}>
        {stat.value}
      </p>
      {stat.label ? (
        <p className="text-[11px] font-semibold mt-1.5 uppercase tracking-wide" style={{ color: MUTED }}>
          {stat.label}
        </p>
      ) : null}
      {stat.delta ? (
        <p
          className="text-[10px] mt-1"
          style={{
            color:
              stat.tone === "positive"
                ? "#4ade80"
                : stat.tone === "negative"
                  ? "#f87171"
                  : TEXT,
            opacity: stat.tone ? 1 : 0.72,
          }}
        >
          {stat.delta}
        </p>
      ) : null}
    </motion.div>
  );
}

export default function AdminOverview() {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  return (
    <AdminLayout>
      <div className="px-4 md:px-8 pt-5 pb-8 space-y-4">
        <motion.div {...fade(0.05)}>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, color: TEXT }}>
            Good evening, Admin
          </h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            KYC system overview — March 23, 2026
          </p>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-4 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {STATS.map((stat, index) => (
                <OverviewKpiCard key={stat.label} stat={stat} delay={0.1 + index * 0.06} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <motion.div style={{ ...mkCard(SURF_ANALYTIC) }} className="xl:col-span-4 flex flex-col admin-panel admin-panel-hover chart-panel" {...fade(0.32)}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>Tenants By Billing Status</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="font-display font-black" style={{ fontSize: 38, letterSpacing: "-0.04em", lineHeight: 1, color: TEXT }}>412</span>
                  <span className="text-xs font-bold mb-1" style={{ color: "#fbbf24" }}>need billing follow-up</span>
                </div>
                <p className="text-xs mb-2" style={{ color: MUTED }}>Healthy vs low-balance vs overdue vs locked tenants</p>
                <div style={{ height: 128 }}>
                  <ResponsiveContainer width="100%" height={128}>
                    <BarChart data={billingStatusData} layout="vertical" margin={{ top: 2, right: 8, left: 6, bottom: 2 }} barCategoryGap="24%">
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="status"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: MUTED, fontSize: 11, fontFamily: "Satoshi" }}
                        width={78}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(15,23,42,0.04)", radius: 8 }}
                        contentStyle={{ background: "#FFFFFF", border: "1px solid #D9E5F0", borderRadius: 12, boxShadow: "var(--admin-elev-3)", color: "#0F172A" }}
                        labelStyle={{ color: MUTED, fontSize: 11 }}
                        formatter={(value: number) => [`${value} tenants`, "Count"]}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={16}>
                        {billingStatusData.map((entry) => (
                          <Cell key={entry.status} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div style={{ ...mkCard(SURF_ANALYTIC) }} className="xl:col-span-8 admin-panel admin-panel-hover chart-panel" {...fade(0.36)}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Webhook Failures Over Time</p>
                    <p className="text-xs mt-0.5" style={{ color: MUTED }}>Delivery failures vs successful retries</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]" style={{ color: MUTED }}>
                    <span className="flex items-center gap-1.5 transition-colors hover:text-[#0F172A]"><span className="w-2 h-2 rounded-full" style={{ background: "#f87171" }} />Failures</span>
                    <span className="flex items-center gap-1.5 transition-colors hover:text-[#0F172A]"><span className="w-2 h-2 rounded-full" style={{ background: "#4ade80" }} />Retried OK</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={webhookFailureData} barGap={8} barCategoryGap="34%">
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: MUTED, fontSize: 11, fontFamily: "Satoshi" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: MUTED, fontSize: 10, fontFamily: "Satoshi" }} width={28} />
                    <Tooltip
                      cursor={{ fill: "rgba(15,23,42,0.04)", radius: 8 }}
                      contentStyle={{ background: "#FFFFFF", border: "1px solid #D9E5F0", borderRadius: 12, boxShadow: "var(--admin-elev-3)", color: "#0F172A" }}
                      labelStyle={{ color: MUTED, fontSize: 11 }}
                      itemStyle={{ color: "#0F172A" }}
                    />
                    <Bar dataKey="failures" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={18} />
                    <Bar dataKey="retried" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <motion.div style={{ ...mkCard(SURF_SUPPORT), padding: 20, overflowX: isMobile ? "auto" : "visible" }} className="admin-panel admin-table-shell" {...fade(0.42)}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: MUTED }}>Recent KYC Activity</p>
                  <p className="font-display font-bold" style={{ fontSize: 16, color: TEXT }}>Latest submissions</p>
                </div>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all admin-button"
                  style={{ background: "rgba(15,23,42,0.05)", color: TEXT }}
                  onClick={() => { window.history.pushState(null, "", "/admin/kyc"); window.dispatchEvent(new PopStateEvent("popstate")); }}
                >
                  View queue →
                </button>
              </div>
              <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider px-3 mb-1" style={{ color: MUTED }}>
                <span className="col-span-1">ID</span>
                <span className="col-span-3">Name</span>
                <span className="col-span-2">Type</span>
                <span className="col-span-2">Risk</span>
                <span className="col-span-2">Time</span>
                <span className="col-span-2 text-right">Status</span>
              </div>
              <div className="space-y-0.5">
                {RECENT.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="grid grid-cols-12 items-center h-11 px-3 rounded-xl cursor-pointer transition-all duration-150 admin-row"
                    style={{ animationDelay: `${i * 50}ms` }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                  >
                    <span className="col-span-1 font-mono text-[10px]" style={{ color: MUTED }}>{item.id.slice(-4)}</span>
                    <span className="col-span-3 text-sm font-semibold" style={{ color: TEXT }}>{item.name}</span>
                    <span className="col-span-2 text-xs" style={{ color: MUTED }}>{item.type}</span>
                    <span className="col-span-2 text-xs font-semibold" style={{ color: RISK_COLOR[item.risk] }}>● {item.risk}</span>
                    <span className="col-span-2 text-[11px]" style={{ color: MUTED }}>{item.time}</span>
                    <div className="col-span-2 flex justify-end">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS[item.status].className}`}>
                        {STATUS[item.status].label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4 w-full xl:w-auto" style={{ width: isMobile ? "100%" : 252, flexShrink: 0 }}>
            <motion.div style={{ ...darkCard, background: DARK_1 }} className="admin-monitor ops-monitor-panel" {...fade(0.18)}>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-50" />
                  <span className="relative rounded-full h-2 w-2 bg-green-400" />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>System Status</p>
              </div>
              <p className="font-display font-bold text-white" style={{ fontSize: 18, letterSpacing: "-0.02em", marginBottom: 14 }}>
                All systems operational
              </p>
              <div className="space-y-3">
                {[{ label: "KYC Engine", pct: 99 }, { label: "API Gateway", pct: 100 }, { label: "Risk Scoring", pct: 97 }].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-[11px] mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <span>{s.label}</span><span>{s.pct}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden admin-monitor-progress" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <motion.div className="h-full rounded-full" style={{ background: "#4ade80" }} initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 h-9 rounded-xl text-sm font-semibold transition-all admin-button" style={{ background: "rgba(255,255,255,0.08)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.1)" }}>
                View status page
              </button>
            </motion.div>

            <motion.div style={{ ...darkCard, background: DARK_2 }} className="admin-monitor ops-monitor-panel" {...fade(0.24)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.38)" }}>Live Risk Alerts</p>
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
              </div>
              <div className="space-y-3">
                {ALERTS.map((a, i) => (
                  <motion.div key={i} className="flex items-start gap-3 admin-list-item rounded-xl px-2 py-2" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: SEV_COLOR[a.severity] }} />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold leading-tight text-white">{a.title}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>{a.sub}</p>
                    </div>
                    <span className={`ml-auto text-[10px] self-start ${SEVERITY_CLASS[a.severity]}`}>{a.severity}</span>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-4 h-9 rounded-xl text-sm font-semibold transition-all admin-button" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.07)" }}>
                View all alerts →
              </button>
            </motion.div>

            <motion.div style={{ ...darkCard, background: DARK_1 }} className="admin-monitor ops-monitor-panel" {...fade(0.3)}>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.32)" }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.32)" }}>Compliance Health</p>
              </div>
              <p className="font-display font-bold text-white mb-0.5" style={{ fontSize: 16, letterSpacing: "-0.02em" }}>Review operations stable</p>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.32)" }}>No escalation threshold breached today</p>
              <div className="space-y-2.5 mb-4">
                {[{ label: "Cases within SLA", val: "92%" }, { label: "Manual escalations", val: "6 open" }, { label: "Median review time", val: "3.8 h" }].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.38)" }}>{r.label}</span>
                    <span className="text-[11px] font-bold text-white">{r.val}</span>
                  </div>
                ))}
              </div>
              <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.28)" }}>Current workload mix</p>
              <div className="space-y-2">
                {[{ label: "Standard review", val: 29, color: "#4ade80" }, { label: "Priority review", val: 11, color: "#fbbf24" }, { label: "Escalated", val: 6, color: "#f87171" }].map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden admin-monitor-progress" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div className="h-full rounded-full" style={{ background: b.color }} initial={{ width: 0 }} animate={{ width: `${(b.val / 46) * 100}%` }} transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }} />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: b.color, minWidth: 18, textAlign: "right" }}>{b.val}</span>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)", minWidth: 88 }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
