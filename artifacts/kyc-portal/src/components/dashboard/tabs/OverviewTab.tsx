import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/KPICard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { WebhookDonut } from "@/components/dashboard/WebhookDonut";
import {
  Key, BookOpen, AlertTriangle, ScrollText,
  CheckCircle2, AlertCircle, XCircle, ArrowRight,
  ShieldCheck, Activity, Globe, TrendingDown, CreditCard, Webhook,
  Clock,
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

const ACCOUNT_STATUS: AccountState = "ACTIVE";

const STATUS_CONFIG: Record<AccountState, {
  label: string; sub: string; badge: string;
  dot: string; valueColor: string; bg: string; ringBg: string;
}> = {
  ACTIVE: {
    label: "Active",
    sub: "Portal access healthy · no restrictions",
    badge: "Live",
    dot: "#22C55E",
    valueColor: "#16a34a",
    bg: "rgba(34,197,94,0.07)",
    ringBg: "rgba(34,197,94,0.15)",
  },
  SUSPENDED: {
    label: "Suspended",
    sub: "Restricted until operational review",
    badge: "Action required",
    dot: "#F59E0B",
    valueColor: "#d97706",
    bg: "rgba(245,158,11,0.07)",
    ringBg: "rgba(245,158,11,0.15)",
  },
  BLOCKED: {
    label: "Blocked",
    sub: "Access limited pending compliance resolution",
    badge: "Restricted",
    dot: "#f54a4a",
    valueColor: "#dc2626",
    bg: "rgba(245,74,74,0.07)",
    ringBg: "rgba(245,74,74,0.15)",
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
  { icon: ShieldCheck,  label: "KYB Verification",    value: "Verified",             status: "ok"   },
  { icon: Activity,     label: "Portal Status",        value: "Active",               status: "ok"   },
  { icon: Globe,        label: "Environment Access",   value: "Sandbox + Production", status: "ok"   },
  { icon: TrendingDown, label: "Risk Tier",            value: "Low",                  status: "ok"   },
  { icon: CreditCard,   label: "Billing Status",       value: "Healthy",              status: "ok"   },
  { icon: Webhook,      label: "Webhook Verification", value: "Test pending",         status: "warn" },
];

const ROW_STATUS_STYLE: Record<RowStatus, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  ok:    { icon: CheckCircle2, color: "#22C55E", bg: "rgba(34,197,94,0.10)"   },
  warn:  { icon: AlertCircle,  color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  error: { icon: XCircle,      color: "#f54a4a", bg: "rgba(245,74,74,0.10)"  },
};

// Backend is not wired — use placeholder treatment
const BACKEND_WIRED = true;

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
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "#A09080", marginBottom: 14,
              fontFamily: "'Satoshi', sans-serif",
            }}>
              Account Status
            </p>

            {/* Pulsing dot + value */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ position: "relative", width: 12, height: 12, flexShrink: 0 }}>
                <span style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: s.dot, opacity: 0.3,
                  animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                }} />
                <span style={{ position: "absolute", inset: "2px", borderRadius: "50%", background: s.dot }} />
              </div>
              <span style={{
                fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1,
                color: s.valueColor, fontFamily: "'Satoshi', sans-serif",
              }}>
                {s.label}
              </span>
            </div>

            <p style={{ fontSize: 11.5, color: "#A09080", lineHeight: 1.45, fontFamily: "'Satoshi', sans-serif" }}>
              {s.sub}
            </p>
          </div>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.ringBg, borderRadius: 20, padding: "4px 10px", width: "fit-content" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0, display: "block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: s.dot, fontFamily: "'Satoshi', sans-serif" }}>
              {s.badge}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Row 2: Jobs Processed chart + Webhook Donut ──────────── */}
      <div className="grid grid-cols-12 gap-5 mb-5">
        <UsageChart />
        <WebhookDonut />
      </div>

      {/* ── Row 3: Bottom summary cards ──────────────────────────── */}
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
        style={{ ...mkCard(WARM), padding: "24px 28px" }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: "linear-gradient(135deg, #F97316, #F59E0B)",
              display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
            }}>
              <Activity style={{ width: 14, height: 14, color: "#fff" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.01em", margin: "0 0 3px", fontFamily: "'Satoshi', sans-serif" }}>
                Operational Readiness
              </h3>
              <p style={{ fontSize: 12.5, color: "#A09080", margin: 0, fontFamily: "'Satoshi', sans-serif" }}>
                What currently enables or limits live production usage for this tenant.
              </p>
            </div>
          </div>

          {/* Backend-pending badge or CTA */}
          {!BACKEND_WIRED ? (
            <div style={{
              display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              background: "rgba(120,90,50,0.07)", borderRadius: 99, padding: "5px 12px",
              border: "1px solid rgba(120,90,50,0.12)",
            }}>
              <Clock style={{ width: 11, height: 11, color: "#A09080" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#A09080", fontFamily: "'Satoshi', sans-serif", whiteSpace: "nowrap" }}>
                Backend pending
              </span>
            </div>
          ) : (
            <Link href="/portal/verifications" style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
                borderRadius: 10, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #F97316, #F59E0B)",
                color: "#fff", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 12.5,
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                Review Account Status
                <ArrowRight style={{ width: 13, height: 13 }} />
              </button>
            </Link>
          )}
        </div>

        {/* Status rows — 2 columns of 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 20 }}>
          {OP_ROWS.map((row, i) => {
            const rs = ROW_STATUS_STYLE[row.status];
            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.44 + i * 0.06 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 12,
                  background: BACKEND_WIRED ? CREAM : "rgba(120,90,50,0.035)",
                  border: "1px solid rgba(120,90,50,0.07)",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: BACKEND_WIRED ? rs.bg : "rgba(120,90,50,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <row.icon style={{
                    width: 13, height: 13, flexShrink: 0,
                    color: BACKEND_WIRED ? rs.color : "#C4B5A5",
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "#A09080", fontFamily: "'Satoshi', sans-serif", marginBottom: 1 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: BACKEND_WIRED ? "#1C1917" : "#C4B5A5", fontFamily: "'Satoshi', sans-serif" }}>
                    {BACKEND_WIRED ? row.value : "—"}
                  </div>
                </div>
                {/* Status indicator or pending badge */}
                {BACKEND_WIRED ? (
                  <rs.icon style={{ width: 14, height: 14, color: rs.color, flexShrink: 0 }} />
                ) : (
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: "#C4B5A5",
                    background: "rgba(120,90,50,0.07)", borderRadius: 99, padding: "2px 8px",
                    whiteSpace: "nowrap", fontFamily: "'Satoshi', sans-serif",
                  }}>
                    Pending
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer: note + CTA */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
          paddingTop: 16, borderTop: "1px solid rgba(120,90,50,0.09)",
        }}>
          <p style={{ fontSize: 11.5, color: "#C4B5A5", margin: 0, fontFamily: "'Satoshi', sans-serif", lineHeight: 1.5 }}>
            Production access depends on account status, KYB approval, billing health, and environment permissions.
          </p>
          <Link href="/portal/verifications" style={{ textDecoration: "none", flexShrink: 0 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
              borderRadius: 11, border: "none", cursor: "pointer",
              background: BACKEND_WIRED
                ? "linear-gradient(135deg, #F97316, #F59E0B)"
                : "rgba(120,90,50,0.08)",
              color: BACKEND_WIRED ? "#fff" : "#A09080",
              fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 12.5,
              whiteSpace: "nowrap",
            }}>
              Review Account Status
              <ArrowRight style={{ width: 13, height: 13 }} />
            </button>
          </Link>
        </div>
      </motion.div>

    </motion.div>
  );
}
