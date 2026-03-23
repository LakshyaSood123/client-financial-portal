import { motion } from "framer-motion";
import { AdminLayout } from "./AdminLayout";
import {
  Users, CheckCircle2, XCircle, Activity, Clock,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";

const card = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 16,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
} as React.CSSProperties;

const STATS = [
  { label: "Total Clients", value: "2,847", change: "+124 this month", icon: Users, color: "#00b896", bg: "rgba(0,184,150,0.1)" },
  { label: "Pending KYC", value: "14", change: "Needs review", icon: Clock, color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  { label: "Approved Today", value: "38", change: "+18% vs yesterday", icon: CheckCircle2, color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  { label: "Rejected Today", value: "5", change: "2.4% reject rate", icon: XCircle, color: "#f54a4a", bg: "rgba(245,74,74,0.1)" },
];

const volumeData = [
  { name: "Mon", approved: 32, rejected: 4 },
  { name: "Tue", approved: 45, rejected: 7 },
  { name: "Wed", approved: 28, rejected: 3 },
  { name: "Thu", approved: 51, rejected: 8 },
  { name: "Fri", approved: 38, rejected: 5 },
  { name: "Sat", approved: 12, rejected: 2 },
  { name: "Sun", approved: 8, rejected: 1 },
];

const trendData = Array.from({ length: 30 }, (_, i) => ({
  val: 40 + Math.sin(i * 0.4) * 15 + i * 0.8 + Math.random() * 8,
}));

const RECENT_ACTIVITY = [
  { id: "KYC-2847", name: "Acme Corp Ltd", type: "Business", status: "approved", time: "2 min ago", risk: "Low" },
  { id: "KYC-2846", name: "David Chen", type: "Individual", status: "pending", time: "8 min ago", risk: "Medium" },
  { id: "KYC-2845", name: "Nova Ventures", type: "Business", status: "rejected", time: "14 min ago", risk: "High" },
  { id: "KYC-2844", name: "Sarah Williams", type: "Individual", status: "approved", time: "22 min ago", risk: "Low" },
  { id: "KYC-2843", name: "GlobalPay Inc", type: "Business", status: "pending", time: "31 min ago", risk: "Medium" },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  approved: { color: "#16a34a", bg: "rgba(22,163,74,0.1)", label: "Approved" },
  pending: { color: "#d97706", bg: "rgba(217,119,6,0.1)", label: "Pending" },
  rejected: { color: "#f54a4a", bg: "rgba(245,74,74,0.1)", label: "Rejected" },
};
const RISK_STYLES: Record<string, { color: string }> = {
  Low: { color: "#00b896" },
  Medium: { color: "#d97706" },
  High: { color: "#f54a4a" },
};

export default function AdminOverview() {
  return (
    <AdminLayout>
      <div className="p-8 space-y-7">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="font-display" style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#1a1a1a" }}>
            Admin Overview
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "#8a8a8a" }}>
            System-wide KYC performance — today, March 23, 2026
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              style={card}
              className="p-5 flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: stat.bg }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#8a8a8a" }}>
                  {stat.label}
                </p>
                <p className="font-display font-bold" style={{ fontSize: 26, letterSpacing: "-0.03em", lineHeight: 1, color: "#1a1a1a" }}>
                  {stat.value}
                </p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: stat.color }}>
                  {stat.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-12 gap-6">
          {/* KYC Volume chart */}
          <motion.div
            style={{ ...card, gridColumn: "span 7" }}
            className="col-span-7 p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold" style={{ fontSize: 17, color: "#1a1a1a" }}>KYC Volume</h3>
                <p className="text-xs mt-0.5" style={{ color: "#8a8a8a" }}>Weekly approved vs rejected</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5" style={{ color: "#16a34a" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#16a34a" }} />Approved
                </span>
                <span className="flex items-center gap-1.5" style={{ color: "#f54a4a" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#f54a4a" }} />Rejected
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeData} barGap={4} barCategoryGap="35%">
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8a8a8a", fontSize: 12, fontFamily: "Satoshi" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#c0c0c0", fontSize: 11, fontFamily: "Satoshi" }} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  labelStyle={{ color: "#1a1a1a", fontFamily: "Satoshi" }}
                />
                <Bar dataKey="approved" fill="#00b896" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="rejected" fill="#f54a4a" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Approval trend sparkline */}
          <motion.div
            style={{ ...card, gridColumn: "span 5" }}
            className="col-span-5 p-6 flex flex-col"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4" style={{ color: "#00b896" }} />
              <h3 className="font-display font-bold" style={{ fontSize: 17, color: "#1a1a1a" }}>Approval Rate</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: "#8a8a8a" }}>30-day rolling trend</p>

            <div className="flex items-end gap-4 mb-4">
              <span className="font-display font-bold" style={{ fontSize: 40, letterSpacing: "-0.03em", lineHeight: 1, color: "#1a1a1a" }}>
                88.4%
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold mb-1" style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }}>
                +2.1%
              </span>
            </div>

            <div className="flex-1 min-h-0" style={{ height: 100 }}>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={trendData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00b896" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00b896" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke="#00b896" strokeWidth={2} fill="url(#adminTrend)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          style={card}
          className="p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold" style={{ fontSize: 17, color: "#1a1a1a" }}>Recent KYC Activity</h3>
            <a
              href="/admin/kyc-queue"
              className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: "#00b896" }}
              onClick={e => { e.preventDefault(); window.history.pushState(null, '', '/admin/kyc-queue'); window.dispatchEvent(new PopStateEvent('popstate')); }}
            >
              View Queue ›
            </a>
          </div>

          <div className="space-y-1">
            {RECENT_ACTIVITY.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-center justify-between h-14 px-4 rounded-xl cursor-pointer group transition-all"
                style={{ borderLeft: "2px solid transparent" }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                whileHover={{ background: "rgba(0,0,0,0.025)", borderLeftColor: "#00b896" } as React.CSSProperties}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs" style={{ color: "#c0c0c0", width: 80 }}>{item.id}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{item.name}</p>
                    <p className="text-xs" style={{ color: "#8a8a8a" }}>{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-medium" style={{ color: RISK_STYLES[item.risk].color }}>
                    ● {item.risk} Risk
                  </span>
                  <span className="text-xs" style={{ color: "#8a8a8a" }}>{item.time}</span>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: STATUS_STYLES[item.status].bg, color: STATUS_STYLES[item.status].color }}
                  >
                    {STATUS_STYLES[item.status].label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
