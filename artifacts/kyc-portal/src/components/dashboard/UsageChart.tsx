import { GlassPanel } from "@/components/GlassPanel";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Link } from "wouter";

const data = [
  { name: "Oct", value: 312 },
  { name: "Nov", value: 548 },
  { name: "Dec", value: 491 },
  { name: "Jan", value: 703 },
  { name: "Feb", value: 867 },
  { name: "Mar", value: 1124 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-2.5 text-sm rounded-xl"
        style={{
          background: "#EBF2F8",
          border: "1px solid rgba(13,18,33,0.08)",
          boxShadow: "0 6px 20px rgba(13,18,33,0.08)",
        }}
      >
        <p className="text-xs mb-1" style={{ color: "#94A3B8" }}>{label}</p>
        <p className="font-display font-bold" style={{ color: "#111827" }}>
          {payload[0].value.toLocaleString()}{" "}
          <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: 11 }}>jobs</span>
        </p>
      </div>
    );
  }
  return null;
};

export function UsageChart() {
  return (
    <GlassPanel
      className="p-6 col-span-12 lg:col-span-8 flex flex-col"
      style={{ background: "#D9E9F5" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-display font-bold" style={{ fontSize: "20px", color: "#111827" }}>Jobs Processed</h3>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Verification jobs run via API — last 6 months</p>
        </div>
        <Link
          href="/usage"
          className="text-xs font-semibold transition-colors hover:text-[#111827] flex items-center gap-1"
          style={{ color: "#94A3B8" }}
        >
          View Usage →
        </Link>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <div>
          <span className="font-display font-bold" style={{ fontSize: 28, letterSpacing: "-0.02em", color: "#111827" }}>1,124</span>
          <span className="text-xs ml-2" style={{ color: "#94A3B8" }}>jobs this month</span>
        </div>
        <div className="h-8 w-px" style={{ background: "rgba(13,18,33,0.1)" }} />
        <div>
          <span className="font-display font-bold" style={{ fontSize: 18, color: "#4F7CFF" }}>+29%</span>
          <span className="text-xs ml-2" style={{ color: "#94A3B8" }}>vs last month</span>
        </div>
      </div>

      <div className="flex-1 w-full" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
            <defs>
              <pattern id="hatch-pattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="rgba(79,124,255,0.06)" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#4F7CFF" strokeWidth="2.5" opacity="0.18" />
              </pattern>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12, fontFamily: "Satoshi" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "JetBrains Mono" }}
              tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}K` : String(val)}
            />
            <Tooltip cursor={{ fill: "rgba(13,18,33,0.03)" }} content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Mar" ? "#4F7CFF" : "url(#hatch-pattern)"}
                  style={entry.name === "Mar" ? { filter: "drop-shadow(0 0 8px rgba(79,124,255,0.3))" } : undefined}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
