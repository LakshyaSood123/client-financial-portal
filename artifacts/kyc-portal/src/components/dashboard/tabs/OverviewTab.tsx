import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/KPICard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { WebhookDonut } from "@/components/dashboard/WebhookDonut";
import { Link } from "wouter";
import { Key, AlertTriangle, ScrollText, BookOpen } from "lucide-react";

const lightCard = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 20,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
} as React.CSSProperties;

const BOTTOM_CARDS = [
  {
    label: "Billing Balance",
    value: "$0.00",
    sub: "$250 credit included · resets Apr 1",
    badge: "No overages",
    badgeColor: "#c9a200",
    badgeBg: "rgba(239,201,45,0.12)",
    href: "/billing",
    icon: BookOpen,
    iconColor: "#efc92d",
  },
  {
    label: "API Keys Active",
    value: "3",
    sub: "2 production · 1 sandbox",
    badge: "All valid",
    badgeColor: "#00b896",
    badgeBg: "rgba(0,184,150,0.12)",
    href: "/api-keys",
    icon: Key,
    iconColor: "#00b896",
  },
  {
    label: "Webhook Failures",
    value: "23",
    sub: "Last 30 days · 1.8% fail rate",
    badge: "Review needed",
    badgeColor: "#f54a4a",
    badgeBg: "rgba(245,74,74,0.12)",
    href: "/webhooks",
    icon: AlertTriangle,
    iconColor: "#f54a4a",
  },
  {
    label: "Audit Events",
    value: "847",
    sub: "March 2026 · exportable",
    badge: "Up to date",
    badgeColor: "#8b6ff4",
    badgeBg: "rgba(139,111,244,0.12)",
    href: "/audit-logs",
    icon: ScrollText,
    iconColor: "#8b6ff4",
  },
];

export function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="KYB Status" value="Verified" percent={100} color="#00b896" delay={0.05} />
        <KPICard title="Ops Status" value="Active"   percent={90}  color="#efc92d" delay={0.1} />
        <KPICard title="Risk Tier"  value="Low"      percent={75}  color="#8b6ff4" delay={0.15} />
        <KPICard title="Plan"       value="Growth"   percent={60}  color="#f59b20" delay={0.2} />
      </div>

      {/* Usage Chart + Webhook Donut */}
      <div className="grid grid-cols-12 gap-5 mb-5">
        <UsageChart />
        <WebhookDonut />
      </div>

      {/* Bottom summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {BOTTOM_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            className="p-5 flex flex-col gap-3 cursor-pointer"
            style={{ ...lightCard, transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.07 }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px rgba(0,0,0,0.1), 0 0 16px ${card.iconColor}18`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
            }}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.badgeBg }}>
                <card.icon className="w-4 h-4" style={{ color: card.iconColor }} />
              </div>
              <Link
                href={card.href}
                className="text-[10px] font-semibold transition-colors hover:opacity-70"
                style={{ color: card.iconColor }}
              >
                View →
              </Link>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-1" style={{ color: "#8a8a8a" }}>
                {card.label}
              </p>
              <p
                className="font-display font-bold"
                style={{
                  fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1, color: "#1a1a1a",
                  fontFamily: card.label === "Billing Balance" ? "'JetBrains Mono', monospace" : undefined,
                }}
              >
                {card.value}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "#8a8a8a" }}>{card.sub}</p>
            </div>

            <div className="px-2.5 py-1 rounded-full text-[10px] font-bold w-fit" style={{ background: card.badgeBg, color: card.badgeColor }}>
              {card.badge}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
