import { GlassPanel } from "@/components/GlassPanel";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const data = [
  { name: "Mar", value: 800 },
  { name: "Apr", value: 1200 },
  { name: "May", value: 1600 },
  { name: "Jun", value: 1400 },
  { name: "Jul", value: 2240 },
  { name: "Aug", value: 950 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-2 text-sm font-bold text-foreground shadow-2xl rounded-xl"
        style={{
          background: "rgba(10,24,28,0.95)",
          border: "1px solid rgba(61,232,232,0.3)",
          backdropFilter: "blur(16px)",
        }}
      >
        +${payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <GlassPanel className="p-6 col-span-12 lg:col-span-8 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-foreground" style={{ fontSize: '20px' }}>Revenue Flow</h3>
        <div className="flex items-center gap-3">
          <button className="text-xs font-semibold text-[#00d4aa] hover:text-[#a8ff3e] transition-colors flex items-center gap-1">
            View All <span className="opacity-60">›</span>
          </button>
          <div className="text-xs font-medium text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            Mar 1 – Mar 23
          </div>
        </div>
      </div>

      <div className="flex-1 w-full" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
            <defs>
              <pattern id="hatch-pattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="rgba(155,127,244,0.12)" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#9b7ff4" strokeWidth="2.5" opacity="0.5" />
              </pattern>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b8a82', fontSize: 12, fontFamily: 'DM Sans' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#3d5a52', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(val) => `${(val / 1000).toFixed(1)}K`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Jul" ? "#9b7ff4" : "url(#hatch-pattern)"}
                  style={entry.name === "Jul" ? { filter: "drop-shadow(0 0 12px rgba(155,127,244,0.6))" } : undefined}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
