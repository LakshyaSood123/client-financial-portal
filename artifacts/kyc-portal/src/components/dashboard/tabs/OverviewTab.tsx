import { motion } from "framer-motion";
import {
  ShieldCheck, TrendingUp, Zap, Crosshair,
  DollarSign, Activity, Calendar, SlidersHorizontal, Maximize2,
  ChevronRight, CheckCircle2, RefreshCw, Clock,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";

// ── Surface tokens ────────────────────────────────────────────
const CREAM = "#FAF8F4";
const WARM  = "#F2EBE1";

const mkCard = (bg: string): React.CSSProperties => ({
  background: bg,
  border: "1px solid rgba(120,90,50,0.08)",
  borderRadius: 20,
  boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
});

// ── Data ─────────────────────────────────────────────────────
const CHART_DATA = [
  { month: "Jan", jobs: 380,  projected: 340 },
  { month: "Feb", jobs: 520,  projected: 470 },
  { month: "Mar", jobs: 480,  projected: 510 },
  { month: "Apr", jobs: 680,  projected: 600 },
  { month: "May", jobs: 890,  projected: 720 },
  { month: "Jun", jobs: 760,  projected: 800 },
  { month: "Jul", jobs: 1020, projected: 900 },
  { month: "Aug", jobs: 1124, projected: 1050 },
];

const INSIGHTS = [
  { icon: DollarSign, value: "₹250.00",    label: "Monthly Credit Balance",  color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  { icon: Activity,   value: "1,124",      label: "API Jobs This Cycle",      color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  { icon: TrendingUp, value: "94.5%",      label: "Verification Pass Rate",   color: "#F97316", bg: "rgba(249,115,22,0.12)" },
];

const PERF_DATA = [
  { category: "Business KYB",            jobs: "312", rate: "98.2%", status: "completed" },
  { category: "Identity Verification",   jobs: "441", rate: "99.5%", status: "completed" },
  { category: "Document Check",          jobs: "248", rate: "87.5%", status: "ongoing" },
  { category: "PEP / Sanctions Screen",  jobs: "189", rate: "91.0%", status: "completed" },
  { category: "Enhanced Due Diligence",  jobs: "134", rate: "72.4%", status: "pending" },
];

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  completed: { label: "Completed", color: "#16a34a", bg: "rgba(34,197,94,0.12)",   icon: CheckCircle2 },
  ongoing:   { label: "Ongoing",   color: "#D97706", bg: "rgba(245,158,11,0.12)",  icon: RefreshCw },
  pending:   { label: "Pending",   color: "#A09080", bg: "rgba(120,90,50,0.09)",   icon: Clock },
};

// ── Custom tooltip ─────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: CREAM,
        border: "1px solid rgba(120,90,50,0.12)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(120,90,50,0.1)",
      }}>
        <p style={{ fontSize: 10, color: "#B0A090", marginBottom: 4, fontFamily: "'Satoshi', sans-serif" }}>
          This month · {label}
        </p>
        {payload.map((p) => (
          <p key={p.name} style={{
            fontSize: 16, fontWeight: 800, color: "#1C1917",
            fontFamily: "'Satoshi', sans-serif", marginBottom: 2,
          }}>
            {p.value.toLocaleString()}
            <span style={{ fontSize: 11, color: "#B0A090", fontWeight: 400, marginLeft: 4 }}>
              {p.name === "jobs" ? "jobs" : "projected"}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ paddingTop: 22 }}
    >
      {/* ── 4 KPI stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        <StatCard label="KYB Verifications"    value="1,248" delta="18.2%"  deltaPositive icon={ShieldCheck} delay={0.05} />
        <StatCard label="Workflow Optimized"   value="87"    suffix="%"      delta="2.1%"   deltaPositive icon={TrendingUp} delay={0.10} />
        <StatCard label="AI Insight Accuracy"  value="94.5"  suffix="%"      delta="1.4%"   deltaPositive icon={Zap}        delay={0.15} />
        <StatCard label="Team Productivity"    value="8.9"   suffix="/ 10"   delta="0.6%"   deltaPositive={false} icon={Crosshair} delay={0.20} />
      </div>

      {/* ── Analytics row: chart + insights ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 14, marginBottom: 18 }}>

        {/* Quarterly Verification Report — cream */}
        <motion.div
          style={mkCard(CREAM)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div style={{ padding: "22px 22px 0" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", margin: 0, letterSpacing: "-0.01em", fontFamily: "'Satoshi', sans-serif" }}>
                  Quarterly Income Report
                </h3>
                <p style={{ fontSize: 12, color: "#B0A090", marginTop: 3, fontFamily: "'Satoshi', sans-serif" }}>
                  Measuring verification volume and approval trends
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[Calendar, SlidersHorizontal, Maximize2].map((Icon, i) => (
                  <button key={i} style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(120,90,50,0.06)",
                    border: "1px solid rgba(120,90,50,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#B0A090",
                  }}>
                    <Icon style={{ width: 13, height: 13 }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 10, color: "#B0A090", fontFamily: "'Satoshi', sans-serif" }}>Last update:</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#A09080", fontFamily: "'JetBrains Mono', monospace" }}>
                  04.16.25 at 7:00 PM
                </p>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                {[{ color: "#F97316", label: "Job Volume" }, { color: "#F59E0B", label: "Projected" }].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color }} />
                    <span style={{ fontSize: 11, color: "#B0A090", fontFamily: "'Satoshi', sans-serif" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Area chart */}
          <div style={{ height: 200, paddingBottom: 4 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F97316" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(120,90,50,0.06)" strokeDasharray="0" />
                <XAxis
                  dataKey="month"
                  axisLine={false} tickLine={false}
                  tick={{ fill: "#B0A090", fontSize: 11, fontFamily: "Satoshi" }}
                  dy={8}
                />
                <YAxis
                  axisLine={false} tickLine={false}
                  tick={{ fill: "#B0A090", fontSize: 10, fontFamily: "Satoshi" }}
                  tickFormatter={v => v >= 1000 ? `${v / 1000}K` : String(v)}
                  width={36}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone" dataKey="jobs" stroke="#F97316" strokeWidth={2.5}
                  fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: "#F97316", stroke: CREAM, strokeWidth: 2 }}
                  name="jobs"
                />
                <Area
                  type="monotone" dataKey="projected" stroke="#F59E0B" strokeWidth={1.5}
                  fill="none" dot={false} strokeDasharray="5 3"
                  activeDot={{ r: 4, fill: "#F59E0B", stroke: CREAM, strokeWidth: 2 }}
                  name="projected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Profit / Verification Insights — cream */}
        <motion.div
          style={{ ...mkCard(CREAM), display: "flex", flexDirection: "column" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div style={{ padding: "22px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", margin: 0, fontFamily: "'Satoshi', sans-serif" }}>
              Profit Insights
            </h3>
            <button style={{
              fontSize: 12, fontWeight: 600, color: "#F97316",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Satoshi', sans-serif",
            }}>
              See all
            </button>
          </div>

          <div style={{ flex: 1 }}>
            {INSIGHTS.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "16px 20px",
                  borderTop: i > 0 ? "1px solid rgba(120,90,50,0.07)" : undefined,
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(120,90,50,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Circle icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: row.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <row.icon style={{ width: 20, height: 20, color: row.color }} />
                </div>

                {/* Value + label */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 20, fontWeight: 800, color: "#1C1917",
                    letterSpacing: "-0.02em", lineHeight: 1.1,
                    fontFamily: "'Satoshi', sans-serif", margin: 0,
                  }}>
                    {row.value}
                  </p>
                  <p style={{
                    fontSize: 11.5, color: "#B0A090",
                    fontFamily: "'Satoshi', sans-serif", marginTop: 2,
                  }}>
                    {row.label}
                  </p>
                </div>

                <ChevronRight style={{ width: 16, height: 16, color: "#C4B5A5", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Project Performance table ── */}
      <motion.div
        style={mkCard(CREAM)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        {/* Table header */}
        <div style={{
          padding: "18px 22px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(120,90,50,0.07)",
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", margin: 0, fontFamily: "'Satoshi', sans-serif" }}>
            Project Performance Overview
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(120,90,50,0.06)",
              border: "1px solid rgba(120,90,50,0.09)",
              borderRadius: 8, padding: "5px 10px",
              fontSize: 11, color: "#A09080", fontFamily: "'Satoshi', sans-serif",
            }}>
              <Calendar style={{ width: 11, height: 11 }} />
              Updated: Apr 16, 2025
            </div>
            <div style={{
              background: "rgba(120,90,50,0.06)",
              border: "1px solid rgba(120,90,50,0.09)",
              borderRadius: 8, padding: "5px 12px",
              fontSize: 11, fontWeight: 600, color: "#1C1917",
              cursor: "pointer", fontFamily: "'Satoshi', sans-serif",
            }}>
              This Quarter ↕
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 0.4fr 0.4fr 0.5fr",
          padding: "10px 22px", gap: 16,
        }}>
          {["Category", "Jobs", "Pass Rate", "Status"].map(h => (
            <p key={h} style={{
              fontSize: 11, fontWeight: 700, color: "#B0A090",
              textTransform: "uppercase", letterSpacing: "0.07em",
              fontFamily: "'Satoshi', sans-serif", margin: 0,
            }}>
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {PERF_DATA.map((row, i) => {
          const s = STATUS_STYLE[row.status];
          return (
            <div
              key={row.category}
              style={{
                display: "grid", gridTemplateColumns: "1fr 0.4fr 0.4fr 0.5fr",
                padding: "12px 22px", gap: 16,
                borderTop: "1px solid rgba(120,90,50,0.07)",
                alignItems: "center",
                transition: "background 0.15s ease",
                cursor: "default",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(120,90,50,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <p style={{
                fontSize: 13.5, fontWeight: 600, color: "#1C1917",
                fontFamily: "'Satoshi', sans-serif", margin: 0,
              }}>
                {row.category}
              </p>
              <p style={{
                fontSize: 13.5, fontWeight: 700, color: "#1C1917",
                fontFamily: "'JetBrains Mono', monospace", margin: 0,
              }}>
                {row.jobs}
              </p>
              <p style={{
                fontSize: 13.5, fontWeight: 700, color: "#1C1917",
                fontFamily: "'JetBrains Mono', monospace", margin: 0,
              }}>
                {row.rate}
              </p>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 10px", borderRadius: 999,
                  background: s.bg, color: s.color,
                  fontSize: 11.5, fontWeight: 700,
                  fontFamily: "'Satoshi', sans-serif",
                }}>
                  <s.icon style={{ width: 11, height: 11 }} />
                  {s.label}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
