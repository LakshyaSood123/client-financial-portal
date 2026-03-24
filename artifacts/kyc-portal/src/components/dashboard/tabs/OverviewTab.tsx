import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/KPICard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { WebhookDonut } from "@/components/dashboard/WebhookDonut";
import {
  Key, BookOpen, AlertTriangle, ScrollText,
  CheckCircle2, AlertCircle, XCircle, ArrowRight,
  ShieldCheck, Activity, Globe, TrendingDown, CreditCard, Webhook,
} from "lucide-react";
import { Link } from "wouter";

// ── Warm surface tokens ────────────────────────────────────────
const BLUSH  = "#EBE1D5";
const WARM   = "#F2EBE1";
const CREAM  = "#FAF8F4";

const mkCard = (bg: string): React.CSSProperties => ({
  background: bg,
  border: "1px solid rgba(120,90,50,0.08)",
  borderRadius: 20,
  boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
});

// ── Account Status config ──────────────────────────────────────
type AccountState = "ACTIVE" | "SUSPENDED" | "BLOCKED";

const ACCOUNT_STATUS: AccountState = "ACTIVE"; // swap to test other states

const STATUS_CONFIG: Record<AccountState, {
  label: string; sub: string; badge: string;
  dot: string; valueColor: string; bg: string; ringBg: string;
}> = {
  ACTIVE: {
    label: "Active", sub: "Portal access healthy",
    badge: "Live", dot: "#22C55E",
    valueColor: "#16a34a", bg: "rgba(34,197,94,0.07)", ringBg: "rgba(34,197,94,0.15)",
  },
  SUSPENDED: {
    label: "Suspended", sub: "Restricted until review",
    badge: "Action required", dot: "#F59E0B",
    valueColor: "#d97706", bg: "rgba(245,158,11,0.07)", ringBg: "rgba(245,158,11,0.15)",
  },
  BLOCKED: {
    label: "Blocked", sub: "Contact support to restore access",
    badge: "Action required", dot: "#f54a4a",
    valueColor: "#dc2626", bg: "rgba(245,74,74,0.07)", ringBg: "rgba(245,74,74,0.15)",
  },
};

const s = STATUS_CONFIG[ACCOUNT_STATUS];

// ── Bottom summary cards ───────────────────────────────────────
const BOTTOM_CARDS = [
  {
    label: "Billing Balance", value: "₹0.00",
    sub: "₹250 credit included · resets Apr 1",
    badge: "No overages", badgeColor: "#D97706", badgeBg: "rgba(245,158,11,0.1)",
    href: "/portal/billing", icon: BookOpen, iconColor: "#F97316",
  },
  {
    label: "API Keys Active", value: "3",
    sub: "2 production · 1 sandbox",
    badge: "All valid", badgeColor: "#16a34a", badgeBg: "rgba(34,197,94,0.12)",
    href: "/portal/apikeys", icon: Key, iconColor: "#22C55E",
  },
  {
    label: "Webhook Failures", value: "23",
    sub: "Last 30 days · 1.8% fail rate",
    badge: "Review needed", badgeColor: "#f54a4a", badgeBg: "rgba(245,74,74,0.1)",
    href: "/portal/webhooks", icon: AlertTriangle, iconColor: "#f54a4a",
  },
  {
    label: "Audit Events", value: "847",
    sub: "March 2026 · exportable",
    badge: "Up to date", badgeColor: "#8b6ff4", badgeBg: "rgba(139,111,244,0.1)",
    href: "/portal/audit-logs", icon: ScrollText, iconColor: "#8b6ff4",
  },
];

// ── Operational Readiness rows ─────────────────────────────────
type RowStatus = "ok" | "warn" | "error";
const OP_ROWS: { icon: typeof ShieldCheck; label: string; value: string; status: RowStatus }[] = [
  { icon: ShieldCheck,  label: "KYB Verification",   value: "Verified",              status: "ok"   },
  { icon: Activity,     label: "Portal Status",       value: "Active",                status: "ok"   },
  { icon: Globe,        label: "Environment Access",  value: "Sandbox + Production",  status: "ok"   },
  { icon: TrendingDown, label: "Risk Tier",           value: "Low",                   status: "ok"   },
  { icon: CreditCard,   label: "Billing Health",      value: "Healthy",               status: "ok"   },
  { icon: Webhook,      label: "Webhook Verification",value: "Test pending",          status: "warn" },
];

const ROW_STATUS_STYLE: Record<RowStatus, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  ok:    { icon: CheckCircle2, color: "#22C55E", bg: "rgba(34,197,94,0.10)"   },
  warn:  { icon: AlertCircle,  color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  error: { icon: XCircle,      color: "#f54a4a", bg: "rgba(245,74,74,0.10)"  },
};

const okCount = OP_ROWS.filter(r => r.status === "ok").length;

export function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ paddingTop: 22 }}
    >
      {/* ── Row 1: 4 KPI ring cards + Account Status ──────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr) 1.1fr", gap: 16, marginBottom: 20 }}>
        <KPICard title="KYB Status" value="Verified" percent={100} color="#22C55E"  trend={5}   delay={0.05} />
        <KPICard title="Ops Status" value="Active"   percent={90}  color="#F59E0B"  trend={2}   delay={0.10} />
        <KPICard title="Risk Tier"  value="Low"      percent={75}  color="#8b6ff4"  trend={-1}  delay={0.15} />
        <KPICard title="Plan"       value="Growth"   percent={60}  color="#F97316"  trend={29}  delay={0.20} />

        {/* Account Status card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            ...mkCard(s.bg),
            padding: "22px 20px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* Header */}
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "#A09080",
              marginBottom: 14, fontFamily: "'Satoshi', sans-serif",
            }}>
              Account Status
            </p>

            {/* Animated status dot + value */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ position: "relative", width: 12, height: 12, flexShrink: 0 }}>
                <span style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: s.dot, opacity: 0.3,
                  animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                }} />
                <span style={{
                  position: "absolute", inset: "2px", borderRadius: "50%",
                  background: s.dot,
                }} />
              </div>
              <span style={{
                fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em",
                lineHeight: 1, color: s.valueColor,
                fontFamily: "'Satoshi', sans-serif",
              }}>
                {s.label}
              </span>
            </div>

            <p style={{ fontSize: 11.5, color: "#A09080", fontFamily: "'Satoshi', sans-serif" }}>
              {s.sub}
            </p>
          </div>

          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: s.ringBg, borderRadius: 20, padding: "4px 10px",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0, display: "block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: s.dot, fontFamily: "'Satoshi', sans-serif" }}>
                {s.badge}
              </span>
            </div>
          </div>
        </motion.div>
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

      {/* ── Row 4: Operational Readiness panel ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        style={{
          ...mkCard(WARM),
          padding: "24px 28px",
          display: "flex",
          gap: 40,
          alignItems: "flex-start",
        }}
      >
        {/* Left: title + description */}
        <div style={{ flexShrink: 0, width: 210 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg, #F97316, #F59E0B)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Activity style={{ width: 13, height: 13, color: "#fff" }} />
            </div>
            <span style={{
              fontSize: 14, fontWeight: 800, color: "#1C1917",
              letterSpacing: "-0.01em", fontFamily: "'Satoshi', sans-serif",
            }}>
              Operational Readiness
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: "#A09080", lineHeight: 1.55, fontFamily: "'Satoshi', sans-serif", margin: "0 0 20px" }}>
            What currently allows or blocks live production usage
          </p>

          {/* Progress bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "#A09080", fontFamily: "'Satoshi', sans-serif" }}>Setup progress</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#22C55E", fontFamily: "'Satoshi', sans-serif" }}>
                {okCount}/{OP_ROWS.length}
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 99, background: "rgba(120,90,50,0.1)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(okCount / OP_ROWS.length) * 100}%` }}
                transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #22C55E, #4ade80)" }}
              />
            </div>
          </div>
        </div>

        {/* Right: status rows — 2 columns of 3 */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 32px" }}>
          {OP_ROWS.map((row, i) => {
            const rs = ROW_STATUS_STYLE[row.status];
            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + i * 0.06 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 12, background: CREAM,
                  border: "1px solid rgba(120,90,50,0.07)",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: rs.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <row.icon style={{ width: 14, height: 14, color: rs.color, flexShrink: 0 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, color: "#A09080", fontFamily: "'Satoshi', sans-serif", marginBottom: 1 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", fontFamily: "'Satoshi', sans-serif" }}>
                    {row.value}
                  </div>
                </div>
                <rs.icon style={{ width: 14, height: 14, color: rs.color, flexShrink: 0 }} />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", alignSelf: "stretch", paddingTop: 2 }}>
          <div />
          <Link href="/portal/webhooks" style={{ textDecoration: "none" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #F97316, #F59E0B)",
              color: "#fff", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 13,
              whiteSpace: "nowrap",
            }}>
              Resolve Remaining Setup
              <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </Link>
        </div>
      </motion.div>

    </motion.div>
  );
}
