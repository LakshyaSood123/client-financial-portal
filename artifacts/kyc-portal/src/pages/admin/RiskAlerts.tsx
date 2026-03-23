import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "./AdminLayout";
import {
  AlertTriangle, Shield, Globe, TrendingUp,
  CheckCircle2, Clock, Zap,
} from "lucide-react";

const card = {
  background: "#ffffff",
  border: "1px solid rgba(28,43,74,0.07)",
  borderRadius: 16,
  boxShadow: "0 2px 16px rgba(28,43,74,0.08)",
} as React.CSSProperties;

const ALERTS = [
  {
    id: "ALT-001",
    severity: "critical",
    title: "High-Risk Jurisdiction Detected",
    description: "Application KYC-2838 from Cayman Islands flagged. Vertex Capital shows complex ownership structure with 5 layers of beneficial ownership.",
    client: "Vertex Capital",
    time: "15 min ago",
    category: "Jurisdiction",
    actions: ["Block Application", "Escalate to Compliance", "Request Additional Docs"],
  },
  {
    id: "ALT-002",
    severity: "high",
    title: "PEP Match Detected",
    description: "Automated screening matched David Chen against PEP database (Singapore government official, retired 2021). Manual review required.",
    client: "David Chen",
    time: "2 hours ago",
    category: "PEP/Sanctions",
    actions: ["Review PEP Status", "Request Declaration", "Dismiss Match"],
  },
  {
    id: "ALT-003",
    severity: "medium",
    title: "Transaction Volume Spike",
    description: "Client CLT-008 (TechBridge Solutions) shows 340% increase in transaction volume over the last 7 days. Pattern deviates from established baseline.",
    client: "TechBridge Solutions",
    time: "4 hours ago",
    category: "Behavioral",
    actions: ["Freeze Account", "Request Explanation", "Monitor Only"],
  },
];

const SEVERITY_STYLES: Record<string, { color: string; bg: string; border: string; label: string; icon: typeof AlertTriangle }> = {
  critical: { color: "#f54a4a", bg: "rgba(245,74,74,0.05)", border: "rgba(245,74,74,0.2)", label: "Critical", icon: AlertTriangle },
  high: { color: "#d97706", bg: "rgba(217,119,6,0.05)", border: "rgba(217,119,6,0.2)", label: "High", icon: Zap },
  medium: { color: "#8b6ff4", bg: "rgba(139,111,244,0.05)", border: "rgba(139,111,244,0.2)", label: "Medium", icon: TrendingUp },
};

const CATEGORY_ICONS: Record<string, typeof Shield> = {
  "Jurisdiction": Globe,
  "PEP/Sanctions": Shield,
  "Behavioral": TrendingUp,
};

const RISK_METRICS = [
  { label: "Critical Alerts", value: "1", color: "#f54a4a", bg: "rgba(245,74,74,0.1)", icon: AlertTriangle },
  { label: "High Priority", value: "2", color: "#d97706", bg: "rgba(217,119,6,0.1)", icon: Zap },
  { label: "Under Review", value: "7", color: "#8b6ff4", bg: "rgba(139,111,244,0.1)", icon: Clock },
  { label: "Resolved Today", value: "12", color: "#00b896", bg: "rgba(0,184,150,0.1)", icon: CheckCircle2 },
];

export default function RiskAlerts() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  return (
    <AdminLayout>
      <div className="p-8 space-y-7">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="font-display" style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#1a1a1a" }}>
            Risk Alerts
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "#8a8a8a" }}>
            Active compliance and risk flags requiring attention
          </p>
        </motion.div>

        {/* Risk metric cards */}
        <div className="grid grid-cols-4 gap-5">
          {RISK_METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              style={card}
              className="p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform cursor-pointer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: m.bg }}
              >
                <m.icon className="w-5 h-5" style={{ color: m.color }} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#8a8a8a" }}>{m.label}</p>
                <p className="font-display font-bold" style={{ fontSize: 28, letterSpacing: "-0.03em", lineHeight: 1.1, color: m.color }}>
                  {m.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alert cards */}
        <div className="space-y-4">
          {ALERTS.filter(a => !dismissed.has(a.id)).map((alert, i) => {
            const sev = SEVERITY_STYLES[alert.severity];
            const CategoryIcon = CATEGORY_ICONS[alert.category] || AlertTriangle;

            return (
              <motion.div
                key={alert.id}
                style={{
                  ...card,
                  border: `1px solid ${sev.border}`,
                  background: sev.bg,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${sev.color}15` }}
                      >
                        <sev.icon className="w-5 h-5" style={{ color: sev.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display font-bold" style={{ fontSize: 15, color: "#1a1a1a" }}>
                            {alert.title}
                          </h3>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            style={{ background: `${sev.color}15`, color: sev.color }}
                          >
                            {sev.label}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ background: "rgba(0,0,0,0.05)", color: "#8a8a8a" }}
                          >
                            {alert.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: "#8a8a8a" }}>
                          <CategoryIcon className="w-3.5 h-3.5" />
                          <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{alert.client}</span>
                          <span>·</span>
                          <span>{alert.time}</span>
                          <span>·</span>
                          <span className="font-mono" style={{ color: "#c0c0c0" }}>{alert.id}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setDismissed(d => new Set([...d, alert.id]))}
                      className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-black/5"
                      style={{ color: "#8a8a8a" }}
                    >
                      Dismiss
                    </button>
                  </div>

                  <p className="text-sm leading-relaxed mb-5 ml-14" style={{ color: "#5a5a5a" }}>
                    {alert.description}
                  </p>

                  <div className="flex items-center gap-3 ml-14">
                    {alert.actions.map((action, ai) => (
                      <button
                        key={action}
                        className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                        style={ai === 0 ? {
                          background: `${sev.color}15`,
                          color: sev.color,
                          border: `1px solid ${sev.color}25`,
                        } : {
                          background: "#ffffff",
                          color: "#8a8a8a",
                          border: "1px solid rgba(0,0,0,0.09)",
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {dismissed.size === ALERTS.length && (
            <motion.div
              className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle2 className="w-12 h-12 mb-4" style={{ color: "#00b896" }} />
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: "#1a1a1a" }}>All clear!</h3>
              <p className="text-sm" style={{ color: "#8a8a8a" }}>All risk alerts have been resolved.</p>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
