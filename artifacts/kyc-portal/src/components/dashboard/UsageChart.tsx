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

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-2.5 text-sm rounded-xl"
        style={{
          background: "#FAF8F4",
          border: "1px solid rgba(120,90,50,0.1)",
          boxShadow: "0 6px 20px rgba(120,90,50,0.08)",
        }}
      >
        <p className="text-xs mb-1" style={{ color: "#A09080" }}>
          {label}
        </p>
        <p className="font-display font-bold" style={{ color: "#1C1917" }}>
          {payload[0].value.toLocaleString()}{" "}
          <span style={{ color: "#A09080", fontWeight: 400, fontSize: 11 }}>jobs</span>
        </p>
      </div>
    );
  }
  return null;
};

export function UsageChart() {
  return (
    <GlassPanel hoverable className="p-6 col-span-12 lg:col-span-8 flex flex-col" style={{ background: "#F2EBE1" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <div>
          <h3 className="font-display font-bold" style={{ fontSize: "20px", color: "#1C1917" }}>
            Jobs Processed
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#A09080" }}>
            Verification jobs across sandbox and production in the current cycle
          </p>
        </div>
        <Link
          href="/portal/jobs"
          className="text-xs font-semibold transition-colors hover:text-[#1C1917] flex items-center gap-1"
          style={{ color: "#A09080" }}
        >
          View Jobs {"->"}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-5">
        <div>
          <span className="font-display font-bold" style={{ fontSize: 28, letterSpacing: "-0.02em", color: "#1C1917" }}>
            1,124
          </span>
          <span className="text-xs ml-2" style={{ color: "#A09080" }}>
            jobs this cycle
          </span>
        </div>
        <div className="hidden sm:block h-8 w-px" style={{ background: "rgba(120,90,50,0.12)" }} />
        <div>
          <span className="font-display font-bold" style={{ fontSize: 18, color: "#F97316" }}>
            +29%
          </span>
          <span className="text-xs ml-2" style={{ color: "#A09080" }}>
            vs previous cycle
          </span>
        </div>
      </div>

      <div className="flex-1 w-full" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
            <defs>
              <pattern id="hatch-warm" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="rgba(249,115,22,0.06)" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#F97316" strokeWidth="2.5" opacity="0.15" />
              </pattern>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A09080", fontSize: 12, fontFamily: "Satoshi" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A09080", fontSize: 11, fontFamily: "JetBrains Mono" }}
              tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value))}
            />
            <Tooltip cursor={{ fill: "rgba(120,90,50,0.04)" }} content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Mar" ? "url(#barGrad)" : "url(#hatch-warm)"}
                  style={entry.name === "Mar" ? { filter: "drop-shadow(0 0 8px rgba(249,115,22,0.3))" } : undefined}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
