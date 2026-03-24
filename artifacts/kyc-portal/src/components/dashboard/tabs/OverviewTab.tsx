import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/KPICard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { WebhookDonut } from "@/components/dashboard/WebhookDonut";
import { AccountSummaryCard } from "@/components/dashboard/AccountSummaryCard";
import {
  Key, Webhook, Upload, FileText, RefreshCw,
  BookOpen, AlertTriangle, ScrollText, ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

// ── Warm surface tokens ────────────────────────────────────────
const CREAM = "#FAF8F4";
const BLUSH = "#EBE1D5";

const mkCard = (bg: string): React.CSSProperties => ({
  background: bg,
  border: "1px solid rgba(120,90,50,0.08)",
  borderRadius: 20,
  boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
});

// ── Bottom summary cards ───────────────────────────────────────
const BOTTOM_CARDS = [
  {
    label: "Billing Balance",
    value: "₹0.00",
    sub: "₹250 credit included · resets Apr 1",
    badge: "No overages",
    badgeColor: "#D97706",
    badgeBg: "rgba(245,158,11,0.1)",
    href: "/billing",
    icon: BookOpen,
    iconColor: "#F97316",
  },
  {
    label: "API Keys Active",
    value: "3",
    sub: "2 production · 1 sandbox",
    badge: "All valid",
    badgeColor: "#16a34a",
    badgeBg: "rgba(34,197,94,0.12)",
    href: "/api-keys",
    icon: Key,
    iconColor: "#22C55E",
  },
  {
    label: "Webhook Failures",
    value: "23",
    sub: "Last 30 days · 1.8% fail rate",
    badge: "Review needed",
    badgeColor: "#f54a4a",
    badgeBg: "rgba(245,74,74,0.1)",
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
    badgeBg: "rgba(139,111,244,0.1)",
    href: "/audit-logs",
    icon: ScrollText,
    iconColor: "#8b6ff4",
  },
];

// ── Recent activity ────────────────────────────────────────────
const ACTIVITY = [
  { id: 1, label: "API key rotated",       detail: "prod_key_**** → new key",          time: "Mar 22", icon: Key,       color: "#F97316", bg: "rgba(249,115,22,0.1)" },
  { id: 2, label: "Webhook test sent",     detail: "endpoint: /hooks/kyb",             time: "Mar 21", icon: Webhook,   color: "#8b6ff4", bg: "rgba(139,111,244,0.1)" },
  { id: 3, label: "KYB document uploaded", detail: "Certificate of Incorporation",     time: "Mar 20", icon: Upload,    color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  { id: 4, label: "Audit log exported",    detail: "March 2026 · 847 events",          time: "Mar 19", icon: FileText,  color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { id: 5, label: "Delivery replayed",     detail: "evt_8xKp2mNq · success",           time: "Mar 18", icon: RefreshCw, color: "#f54a4a", bg: "rgba(245,74,74,0.1)" },
];

export function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ paddingTop: 22 }}
    >

      {/* ── Row 1: 4 KPI ring cards ─────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KPICard title="KYB Status" value="Verified" percent={100} color="#22C55E"  trend={5}   delay={0.05} />
        <KPICard title="Ops Status" value="Active"   percent={90}  color="#F59E0B"  trend={2}   delay={0.10} />
        <KPICard title="Risk Tier"  value="Low"      percent={75}  color="#8b6ff4"  trend={-1}  delay={0.15} />
        <KPICard title="Plan"       value="Growth"   percent={60}  color="#F97316"  trend={29}  delay={0.20} />
      </div>

      {/* ── Row 2: Jobs Processed chart + Webhook Donut ──────────── */}
      <div className="grid grid-cols-12 gap-5 mb-5">
        <UsageChart />
        <WebhookDonut />
      </div>

      {/* ── Row 3: Bottom summary cards (blush) ─────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {BOTTOM_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            className="p-5 flex flex-col gap-3 cursor-pointer"
            style={{ ...mkCard(BLUSH), transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.07 }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(120,90,50,0.09)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(120,90,50,0.05)";
            }}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.badgeBg }}>
                <card.icon className="w-4 h-4" style={{ color: card.iconColor }} />
              </div>
              <Link href={card.href} className="text-[10px] font-semibold transition-colors hover:opacity-70" style={{ color: card.iconColor }}>
                View →
              </Link>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-1" style={{ color: "#A09080" }}>
                {card.label}
              </p>
              <p className="font-display font-bold" style={{
                fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1, color: "#1C1917",
                fontFamily: card.label === "Billing Balance" ? "'JetBrains Mono', monospace" : undefined,
              }}>
                {card.value}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "#A09080" }}>{card.sub}</p>
            </div>
            <div className="px-2.5 py-1 rounded-full text-[10px] font-bold w-fit" style={{ background: card.badgeBg, color: card.badgeColor }}>
              {card.badge}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Row 4: Account Summary + Recent Activity ──────────────── */}
      <div className="grid grid-cols-12 gap-5">

        {/* Account Summary — col-4 */}
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <AccountSummaryCard />
        </motion.div>

        {/* Recent Activity — col-8, cream */}
        <motion.div
          className="col-span-8"
          style={mkCard(CREAM)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(120,90,50,0.07)" }}>
            <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#1C1917" }}>Recent Activity</h3>
            <Link href="/audit-logs" className="flex items-center gap-0.5 text-xs font-semibold transition-colors hover:text-[#1C1917]" style={{ color: "#F97316" }}>
              Audit Logs <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="px-4 py-3">
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 h-14 px-2 rounded-xl cursor-pointer transition-all duration-150"
                style={{ borderLeft: "2px solid transparent" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(120,90,50,0.04)";
                  (e.currentTarget as HTMLElement).style.borderLeftColor = "#F97316";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#1C1917" }}>{item.label}</p>
                  <p className="text-[10px] truncate" style={{ color: "#A09080" }}>{item.detail}</p>
                </div>
                <span className="text-[10px] flex-shrink-0 font-mono" style={{ color: "#A09080" }}>{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
