import { motion } from "framer-motion";
import { Key, Webhook, Copy, CheckCircle2, Circle, RefreshCw, Plus, Activity } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const lightCard = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 20,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
} as React.CSSProperties;

const API_KEYS = [
  { name: "Production Key",  key: "pk_live_4x8aK9mN••••••••", env: "production", created: "Jan 12, 2026", lastUsed: "2 min ago",     status: "active" },
  { name: "Sandbox Key",     key: "pk_test_7pRjQ2xW••••••••", env: "sandbox",    created: "Jan 12, 2026", lastUsed: "Mar 18, 2026",  status: "active" },
  { name: "CI / Test Runner",key: "pk_test_9mZvL3kB••••••••", env: "sandbox",    created: "Feb 3, 2026",  lastUsed: "Mar 22, 2026",  status: "active" },
];

const WEBHOOKS = [
  { url: "https://api.acme.co/hooks/kyb-events", events: ["kyb.verified", "kyb.rejected"],    health: "healthy",  deliveries: 1248, failures: 3 },
  { url: "https://api.acme.co/hooks/billing",    events: ["billing.invoice.created"],          health: "degraded", deliveries: 412,  failures: 20 },
  { url: "https://staging.acme.co/hooks/test",   events: ["*"],                                health: "healthy",  deliveries: 89,   failures: 0 },
];

const HEALTH_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  healthy:  { color: "#00b896", bg: "rgba(0,184,150,0.1)",   label: "Healthy" },
  degraded: { color: "#f59b20", bg: "rgba(245,155,32,0.1)",  label: "Degraded" },
  failing:  { color: "#f54a4a", bg: "rgba(245,74,74,0.1)",   label: "Failing" },
};

const deliveryData = [
  { h: "00:00", delivered: 18, failed: 0 },
  { h: "04:00", delivered: 6,  failed: 1 },
  { h: "08:00", delivered: 47, failed: 2 },
  { h: "12:00", delivered: 93, failed: 8 },
  { h: "16:00", delivered: 112,failed: 6 },
  { h: "20:00", delivered: 74, failed: 4 },
  { h: "Now",   delivered: 38, failed: 2 },
];

const RECENT_DELIVERIES = [
  { id: "evt_8xKp2mNq", endpoint: "/hooks/kyb-events", event: "kyb.verified",            status: "delivered", time: "2 min ago" },
  { id: "evt_7wJm1kLp", endpoint: "/hooks/billing",    event: "billing.invoice.created",  status: "failed",    time: "14 min ago" },
  { id: "evt_6vHl0jKo", endpoint: "/hooks/kyb-events", event: "kyb.document.uploaded",   status: "delivered", time: "1 hour ago" },
  { id: "evt_5uGk9iJn", endpoint: "/hooks/test",       event: "kyb.verified",            status: "delivered", time: "2 hours ago" },
];

const DELIVERY_STATUS: Record<string, { color: string; bg: string }> = {
  delivered: { color: "#00b896", bg: "rgba(0,184,150,0.1)" },
  failed:    { color: "#f54a4a", bg: "rgba(245,74,74,0.1)" },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
};

export function IntegrationsTab() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* API Keys */}
      <motion.div style={lightCard} className="p-6" custom={0} variants={item} initial="hidden" animate="show">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#1a1a1a" }}>API Keys</h3>
            <p className="text-xs mt-0.5" style={{ color: "#8a8a8a" }}>3 active keys across production and sandbox</p>
          </div>
          <Link
            href="/api-keys"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: "rgba(239,201,45,0.12)", color: "#c9a200", border: "1px solid rgba(239,201,45,0.2)" }}
          >
            <Plus className="w-3 h-3" /> New Key
          </Link>
        </div>

        <div className="space-y-2">
          {API_KEYS.map((k) => (
            <div
              key={k.key}
              className="flex items-center gap-4 h-14 px-4 rounded-xl group transition-all"
              style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: k.env === "production" ? "rgba(239,201,45,0.12)" : "rgba(139,111,244,0.12)" }}>
                <Key className="w-4 h-4" style={{ color: k.env === "production" ? "#c9a200" : "#8b6ff4" }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold" style={{ color: "#1a1a1a" }}>{k.name}</p>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded" style={{
                    background: k.env === "production" ? "rgba(239,201,45,0.1)" : "rgba(139,111,244,0.1)",
                    color: k.env === "production" ? "#c9a200" : "#8b6ff4",
                  }}>{k.env}</span>
                </div>
                <p className="text-[10px] font-mono" style={{ color: "#8a8a8a" }}>{k.key}</p>
              </div>

              <div className="text-right hidden lg:block">
                <p className="text-xs" style={{ color: "#8a8a8a" }}>Last used</p>
                <p className="text-xs font-semibold" style={{ color: "#1a1a1a" }}>{k.lastUsed}</p>
              </div>

              <button
                onClick={() => handleCopy(k.key)}
                className="p-2 rounded-lg transition-colors hover:bg-black/5"
                style={{ color: copiedKey === k.key ? "#efc92d" : "#b5b2ab" }}
              >
                {copiedKey === k.key ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Webhook endpoints + delivery health */}
      <div className="grid grid-cols-12 gap-5">

        {/* Endpoints */}
        <motion.div style={{ ...lightCard, gridColumn: "span 7" }} className="col-span-7 p-6" custom={1} variants={item} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#1a1a1a" }}>Webhook Endpoints</h3>
              <p className="text-xs mt-0.5" style={{ color: "#8a8a8a" }}>3 configured · 1 degraded</p>
            </div>
            <Link href="/webhooks" className="text-xs font-semibold transition-colors hover:text-[#1a1a1a]" style={{ color: "#8a8a8a" }}>
              Manage →
            </Link>
          </div>

          <div className="space-y-3">
            {WEBHOOKS.map((wh) => {
              const hs = HEALTH_STYLES[wh.health];
              return (
                <div key={wh.url} className="p-4 rounded-2xl" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Webhook className="w-4 h-4 flex-shrink-0" style={{ color: "#b5b2ab" }} />
                      <p className="text-sm font-mono font-semibold truncate" style={{ color: "#1a1a1a" }}>{wh.url}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ml-3" style={{ background: hs.bg, color: hs.color }}>
                      <Circle className="w-1.5 h-1.5 fill-current" />{hs.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px]" style={{ color: "#8a8a8a" }}>
                    <span>{wh.deliveries.toLocaleString()} delivered</span>
                    <span style={{ color: wh.failures > 0 ? "#f54a4a" : "#b5b2ab" }}>{wh.failures} failed</span>
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map(ev => (
                        <span key={ev} className="px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(139,111,244,0.08)", color: "#8b6ff4" }}>{ev}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Delivery health chart + recent */}
        <motion.div style={{ ...lightCard, gridColumn: "span 5" }} className="col-span-5 p-6" custom={2} variants={item} initial="hidden" animate="show">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4" style={{ color: "#8b6ff4" }} />
            <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#1a1a1a" }}>Delivery Activity</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: "#8a8a8a" }}>Last 24 hours</p>

          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deliveryData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="delGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b6ff4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b6ff4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="h" tick={{ fill: "#b5b2ab", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, fontSize: 11, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  labelStyle={{ color: "#8a8a8a" }}
                />
                <Area type="monotone" dataKey="delivered" stroke="#8b6ff4" strokeWidth={2} fill="url(#delGrad)" dot={false} name="Delivered" />
                <Area type="monotone" dataKey="failed"    stroke="#f54a4a" strokeWidth={1.5} fill="rgba(245,74,74,0.06)" dot={false} name="Failed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#8a8a8a" }}>Recent Events</p>
            {RECENT_DELIVERIES.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: DELIVERY_STATUS[ev.status].color }} />
                  <span className="text-[10px] font-mono truncate" style={{ color: "#8a8a8a" }}>{ev.event}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: DELIVERY_STATUS[ev.status].bg, color: DELIVERY_STATUS[ev.status].color }}>
                    {ev.status}
                  </span>
                  <span className="text-[9px]" style={{ color: "#b5b2ab" }}>{ev.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 flex items-center justify-center gap-1.5 h-8 rounded-xl text-xs font-semibold transition-all hover:opacity-90" style={{ background: "rgba(139,111,244,0.1)", color: "#8b6ff4", border: "1px solid rgba(139,111,244,0.2)" }}>
            <RefreshCw className="w-3 h-3" /> Replay Failed Events
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
