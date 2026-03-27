import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Globe,
  Key,
  ShieldCheck,
  Upload,
  Wallet,
  Webhook,
  XCircle,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { WebhookDonut } from "@/components/dashboard/WebhookDonut";
import { TiltCard } from "@/components/shared/TiltCard";

const CREAM = "#FAF8F4";
const WARM = "#F2EBE1";
const BLUSH = "#EBE1D5";

const cardShell = (background: string): React.CSSProperties => ({
  background,
  border: "1px solid rgba(120,90,50,0.08)",
  borderRadius: 20,
  boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
});

const SUMMARY_CARDS = [
  {
    label: "Current Balance",
    value: "INR 2,480",
    sub: "Soft threshold at INR 1,000",
    badge: "Healthy",
    badgeColor: "#16a34a",
    badgeBg: "rgba(34,197,94,0.12)",
    href: "/portal/billing",
    icon: Wallet,
    iconColor: "#16a34a",
  },
  {
    label: "Environment Access",
    value: "Sandbox + Prod",
    sub: "Production approved Mar 18, 2026",
    badge: "Live",
    badgeColor: "#2563eb",
    badgeBg: "rgba(37,99,235,0.12)",
    href: "/portal/settings",
    icon: Globe,
    iconColor: "#2563eb",
  },
  {
    label: "Compliance Holds",
    value: "0",
    sub: "No active legal or operational holds",
    badge: "Clear",
    badgeColor: "#16a34a",
    badgeBg: "rgba(34,197,94,0.12)",
    href: "/portal/compliance",
    icon: ShieldCheck,
    iconColor: "#16a34a",
  },
  {
    label: "Next Action",
    value: "Verify webhooks",
    sub: "2 endpoints still on sandbox secret rotation",
    badge: "Recommended",
    badgeColor: "#d97706",
    badgeBg: "rgba(245,158,11,0.12)",
    href: "/portal/webhooks",
    icon: Webhook,
    iconColor: "#d97706",
  },
];

const READINESS_ROWS = [
  { label: "KYB status", value: "Verified", status: "ok", icon: ShieldCheck },
  { label: "Billing status", value: "Healthy balance, no overage", status: "ok", icon: CreditCard },
  { label: "Environment access", value: "Sandbox and production enabled", status: "ok", icon: Globe },
  { label: "API keys", value: "3 active keys, 1 pending rotation", status: "warn", icon: Key },
  { label: "Uploads", value: "Latest financials still requested", status: "warn", icon: Upload },
  { label: "Jobs queue", value: "14 items need analyst review", status: "warn", icon: Clock3 },
];

const STATUS_STYLE = {
  ok: { icon: CheckCircle2, color: "#22C55E", bg: "rgba(34,197,94,0.10)" },
  warn: { icon: AlertCircle, color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  error: { icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,0.10)" },
} as const;

const PRIORITIES = [
  { title: "Rotate sandbox signing secret", detail: "Keeps webhook test traffic separate from production deliveries.", href: "/portal/webhooks" },
  { title: "Upload audited financials", detail: "This is the last requested onboarding artifact before the annual review closes.", href: "/portal/uploads" },
  { title: "Review pending jobs", detail: "14 cases remain in analyst queue and affect SLA reporting.", href: "/portal/jobs" },
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr) 1.1fr", gap: 16, marginBottom: 20 }}>
        <KPICard title="KYB Status" value="Cleared" percent={100} color="#22C55E" delay={0.05} />
        <KPICard title="Billing Status" value="Healthy" percent={100} color="#F97316" delay={0.1} />
        <KPICard title="Env Access" value="Prod Live" percent={100} color="#2563eb" delay={0.15} />
        <KPICard title="Daily Cap Left" value="18,420" percent={61} color="#8b5cf6" delay={0.2} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="tilt-card balance-card"
          style={{
            ...cardShell(BLUSH),
            padding: "22px 20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "linear-gradient(145deg, #FFFFFF 0%, #FAF7F2 100%)",
            border: "1px solid rgba(249,115,22,0.22)",
            transform: "perspective(800px) rotateX(1.5deg)",
            boxShadow: "var(--elev-3), var(--elev-orange)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#A09080",
                marginBottom: 14,
              }}
            >
              Balance Controls
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#22C55E",
                  boxShadow: "0 0 0 6px rgba(34,197,94,0.18)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1, color: "#166534" }}>
                In Limits
              </span>
            </div>
            <p style={{ fontSize: 11.5, color: "#8B7355", lineHeight: 1.45 }}>
              Hard negative floor at INR -500 and current projected end-of-cycle balance remains positive.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6B5F54" }}>
              <span>Soft threshold</span>
              <strong>INR 1,000</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6B5F54" }}>
              <span>Hard negative limit</span>
              <strong>INR -500</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6B5F54" }}>
              <span>Daily cap remaining</span>
              <strong>18,420 jobs</strong>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <UsageChart />
        <WebhookDonut />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        {SUMMARY_CARDS.map((card, index) => (
          <TiltCard
            key={card.label}
            className="p-5 flex flex-col gap-3 cursor-pointer"
            style={{ ...cardShell(index % 2 === 0 ? CREAM : BLUSH), transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
            strength={5}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.badgeBg }}>
                <card.icon className="w-4 h-4" style={{ color: card.iconColor }} />
              </div>
              <Link href={card.href} className="text-[10px] font-semibold transition-colors hover:opacity-70" style={{ color: card.iconColor }}>
                View {"->"}
              </Link>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] mb-1" style={{ color: "#A09080" }}>
                {card.label}
              </p>
              <p className="font-display font-bold" style={{ fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#1C1917" }}>
                {card.value}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "#8B7355" }}>
                {card.sub}
              </p>
            </div>
            <div
              className={`status-badge-3d ${card.badge === "Healthy" ? "badge-active" : card.badge === "Live" ? "badge-running" : card.badge === "Clear" ? "badge-completed" : "badge-queued"} px-2.5 py-1 rounded-full text-[10px] font-bold w-fit`}
              style={{ background: card.badgeBg, color: card.badgeColor, boxShadow: `0 2px 8px ${card.badgeColor}59` }}
            >
              {card.badge}
            </div>
          </TiltCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          style={{ ...cardShell(WARM), padding: "24px 28px", gridColumn: "span 8" }}
          className="col-span-8"
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.01em", margin: "0 0 3px" }}>
                Operational Readiness
              </h3>
              <p style={{ fontSize: 12.5, color: "#8B7355", margin: 0 }}>
                Canonical tenant gates from the embedded frontend spec: KYB, billing, ops, environment access, and outstanding review work.
              </p>
            </div>

            <Link href="/portal/settings" style={{ textDecoration: "none" }}>
              <button
                  className="cta-3d btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12.5,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Review tenant settings
                <ArrowRight style={{ width: 13, height: 13 }} />
              </button>
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 20 }}>
            {READINESS_ROWS.map((row, index) => {
              const rowStyle = STATUS_STYLE[row.status as keyof typeof STATUS_STYLE];
              return (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.44 + index * 0.06 }}
                  className="data-row-3d"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: CREAM,
                    border: "1px solid rgba(120,90,50,0.07)",
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: rowStyle.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <row.icon style={{ width: 13, height: 13, color: rowStyle.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "#A09080", marginBottom: 1 }}>{row.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917" }}>{row.value}</div>
                  </div>
                  <rowStyle.icon style={{ width: 14, height: 14, color: rowStyle.color, flexShrink: 0 }} />
                </motion.div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              paddingTop: 16,
              borderTop: "1px solid rgba(120,90,50,0.09)",
            }}
          >
            <p style={{ fontSize: 11.5, color: "#8B7355", margin: 0, lineHeight: 1.5 }}>
              Production usage is modeled from environment access, balance controls, active keys, and unresolved manual review work from the current cycle.
            </p>
            <Link href="/portal/compliance" style={{ textDecoration: "none", flexShrink: 0 }}>
              <button
                  className="cta-3d btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 18px",
                  borderRadius: 11,
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12.5,
                  whiteSpace: "nowrap",
                }}
              >
                Open compliance view
                <ArrowRight style={{ width: 13, height: 13 }} />
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          style={{ ...cardShell(CREAM), padding: "24px 24px 20px", gridColumn: "span 4" }}
          className="col-span-4"
        >
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1C1917", margin: "0 0 4px" }}>Recommended Next Steps</h3>
            <p style={{ fontSize: 12.5, color: "#8B7355", margin: 0 }}>
              Priority tasks derived from the embedded onboarding, billing, and webhook docs.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PRIORITIES.map((item) => (
              <Link key={item.title} href={item.href} style={{ textDecoration: "none" }}>
                <div
                  className="data-row-3d"
                  style={{
                    borderRadius: 14,
                    padding: "14px 14px 12px",
                    background: "rgba(120,90,50,0.04)",
                    border: "1px solid rgba(120,90,50,0.08)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <strong style={{ color: "#1C1917", fontSize: 13.5 }}>{item.title}</strong>
                    <ArrowRight style={{ width: 14, height: 14, color: "#F97316", flexShrink: 0 }} />
                  </div>
                  <p style={{ color: "#8B7355", fontSize: 11.5, lineHeight: 1.5, margin: "6px 0 0" }}>{item.detail}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
