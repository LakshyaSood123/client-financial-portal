import { GlassPanel } from "@/components/GlassPanel";
import { PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Link } from "wouter";

const data = [
  { name: "Delivered", value: 1248, color: "#22C55E" },
  { name: "Failed",    value: 23,   color: "#f54a4a" },
  { name: "Pending",   value: 91,   color: "#4F7CFF" },
];

export function WebhookDonut() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const INNER = 52;
  const OUTER = 70;

  return (
    <GlassPanel hoverable className="p-5 col-span-12 lg:col-span-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#111827" }}>Webhooks</h3>
          <p className="text-xs uppercase tracking-wider" style={{ color: "#94A3B8", letterSpacing: "0.06em" }}>
            Delivery Status
          </p>
        </div>
        <Link
          href="/webhooks"
          className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-[#111827]"
          style={{ color: "#94A3B8" }}
        >
          View All →
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-1">
        {/* Donut */}
        <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              cx={75}
              cy={75}
              innerRadius={INNER}
              outerRadius={OUTER}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={true}
              animationBegin={300}
              animationDuration={1400}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.color}
                  style={{ filter: `drop-shadow(0 0 4px ${entry.color}50)` }}
                />
              ))}
            </Pie>
          </PieChart>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 800, fontSize: 18, color: "#111827", lineHeight: 1.1 }}>
              {total.toLocaleString()}
            </span>
            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 9, color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3 }}>
              Total Events
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4 flex-1">
          {data.map((item, i) => (
            <motion.div
              key={item.name}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                backgroundColor: item.color,
                boxShadow: `0 0 5px ${item.color}60`,
              }} />
              <div>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, color: "#94A3B8" }}>{item.name}</p>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, color: "#111827" }}>
                  {item.value.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
