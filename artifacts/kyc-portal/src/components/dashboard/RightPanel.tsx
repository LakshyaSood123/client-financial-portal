import { motion } from "framer-motion";
import { AccountSummaryCard } from "./AccountSummaryCard";
import { ChevronRight, Key, Webhook, Upload, FileText, RefreshCw } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const ACTIVITY = [
  { id: 1, label: "API key rotated", detail: "prod_key_**** → new key", time: "Mar 22", icon: Key, color: "#a8ff3e", bg: "rgba(168,255,62,0.15)" },
  { id: 2, label: "Webhook test sent", detail: "endpoint: /hooks/kyb", time: "Mar 21", icon: Webhook, color: "#9b7ff4", bg: "rgba(155,127,244,0.15)" },
  { id: 3, label: "KYB document uploaded", detail: "Certificate of Incorporation", time: "Mar 20", icon: Upload, color: "#00d4aa", bg: "rgba(0,212,170,0.15)" },
  { id: 4, label: "Audit log exported", detail: "March 2026 · 847 events", time: "Mar 19", icon: FileText, color: "#ffb547", bg: "rgba(255,181,71,0.15)" },
  { id: 5, label: "Delivery replayed", detail: "evt_8xKp2mNq · success", time: "Mar 18", icon: RefreshCw, color: "#ff5a5a", bg: "rgba(255,90,90,0.15)" },
];

const sparklineData = Array.from({ length: 18 }, (_, i) => ({
  val: 40 + Math.sin(i * 0.7) * 25 + i * 1.5,
}));

const panelStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(20px)",
  borderLeft: "1px solid rgba(255,255,255,0.07)",
};

const glassRow: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

export function RightPanel() {
  return (
    <motion.div
      className="flex flex-col"
      style={{ ...panelStyle, minHeight: "100vh" }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="flex flex-col gap-6 p-6">
        {/* Account Summary */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-foreground" style={{ fontSize: 18 }}>Account Summary</h2>
            <button className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-[#a8ff3e]" style={{ color: "#00d4aa" }}>
              Manage <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <AccountSummaryCard />
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-foreground" style={{ fontSize: 18 }}>Recent Activity</h2>
            <button className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-[#a8ff3e]" style={{ color: "#00d4aa" }}>
              Audit Logs <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 h-14 px-3 rounded-xl cursor-pointer group transition-all duration-150"
                style={{ borderLeft: "2px solid transparent" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                whileHover={{
                  background: "rgba(255,255,255,0.04)",
                  borderLeftColor: "#00d4aa",
                } as React.CSSProperties}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-[#00d4aa] transition-colors truncate">
                    {item.label}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "#6b8a82" }}>{item.detail}</p>
                </div>
                <span className="text-[10px] flex-shrink-0 font-mono" style={{ color: "#3d5a52" }}>{item.time}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom row: Quick action + API sparkline */}
        <div className="grid grid-cols-2 gap-3">
          {/* Quick actions */}
          <motion.div
            className="p-4 rounded-2xl flex flex-col gap-3 cursor-pointer hover:bg-white/[0.07] transition-colors"
            style={glassRow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div>
              <p className="text-sm font-bold text-foreground">Quick Actions</p>
              <p className="text-[10px] leading-tight mt-0.5" style={{ color: "#6b8a82" }}>
                Run a test webhook or rotate your API key
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                className="w-full text-[10px] font-bold py-1.5 rounded-lg text-left px-2 transition-colors hover:bg-white/10"
                style={{ color: "#9b7ff4", background: "rgba(155,127,244,0.1)" }}
              >
                ↗ Test Webhook
              </button>
              <button
                className="w-full text-[10px] font-bold py-1.5 rounded-lg text-left px-2 transition-colors hover:bg-white/10"
                style={{ color: "#a8ff3e", background: "rgba(168,255,62,0.1)" }}
              >
                ⟳ Rotate API Key
              </button>
            </div>
          </motion.div>

          {/* API usage sparkline */}
          <motion.div
            className="p-4 rounded-2xl flex flex-col justify-between overflow-hidden relative"
            style={glassRow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="relative z-10">
              <p className="text-sm font-bold text-foreground">API Usage</p>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: "#00d4aa" }}>↑ trending</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-14 opacity-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#00d4aa"
                    strokeWidth={2}
                    fill="url(#apiGrad)"
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
