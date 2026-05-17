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
  MoreHorizontal,
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
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const isPhone = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(max-width: 1279px)");

  if (isPhone) {
    const mobileStatusPills = [
      { label: "KYB", value: "Cleared", dot: "#22C55E", bg: "rgba(34,197,94,0.10)" },
      { label: "Billing", value: "Healthy", dot: "#22C55E", bg: "rgba(34,197,94,0.10)" },
      { label: "Env", value: "Prod Live", dot: "#2563eb", bg: "rgba(37,99,235,0.12)" },
    ];

    const mobileWebhookData = [
      { name: "Delivered", value: 1248, color: "#22C55E" },
      { name: "Failed", value: 23, color: "#ef4444" },
      { name: "Pending", value: 91, color: "#F59E0B" },
    ];
    const mobileWebhookTotal = mobileWebhookData.reduce((sum, item) => sum + item.value, 0);

    const labelStyle: React.CSSProperties = {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.09em",
      textTransform: "uppercase",
      color: "#A09080",
      margin: "0 0 10px",
    };

    const viewLinkStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 12,
      fontWeight: 700,
      color: "#8B7355",
      textDecoration: "none",
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ paddingTop: 18, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <section>
          <p style={labelStyle}>Platform status</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            {mobileStatusPills.map((pill) => (
              <div
                key={pill.label}
                style={{
                  ...cardShell("#FFFFFF"),
                  background: pill.bg,
                  borderRadius: 16,
                  padding: "12px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: pill.dot,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#8B7355", minWidth: 0 }}>{pill.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#1C1917", lineHeight: 1.2 }}>{pill.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p style={labelStyle}>Balance</p>
          <div
            style={{
              ...cardShell(CREAM),
              padding: "18px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "rgba(34,197,94,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Wallet style={{ width: 18, height: 18, color: "#22C55E" }} />
              </div>
              <Link href="/portal/billing" style={viewLinkStyle}>
                View {"->"}
              </Link>
            </div>

            <div>
              <p style={{ ...labelStyle, margin: "0 0 6px" }}>Current balance</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "#1C1917" }}>INR 2,480</span>
                <span
                  className="status-badge-3d badge-active"
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(34,197,94,0.12)",
                    color: "#16a34a",
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Healthy
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: "#8B7355", margin: 0 }}>Soft threshold note: balance remains safely above the alert floor.</p>
            </div>

            <div style={{ borderTop: "1px solid rgba(120,90,50,0.09)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                <span style={{ color: "#8B7355" }}>Soft threshold</span>
                <strong style={{ color: "#1C1917" }}>INR 1,000</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                <span style={{ color: "#8B7355" }}>Hard negative limit</span>
                <strong style={{ color: "#ef4444" }}>INR -500</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                <span style={{ color: "#8B7355" }}>Daily cap remaining</span>
                <strong style={{ color: "#1C1917" }}>18,420 jobs</strong>
              </div>
            </div>
          </div>
        </section>

        <section>
          <p style={labelStyle}>Environment</p>
          <div
            style={{
              ...cardShell(BLUSH),
              padding: "18px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "rgba(37,99,235,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Globe style={{ width: 18, height: 18, color: "#2563eb" }} />
              </div>
              <Link href="/portal/settings" style={viewLinkStyle}>
                View {"->"}
              </Link>
            </div>

            <div>
              <p style={{ ...labelStyle, margin: "0 0 6px" }}>Environment access</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: "#1C1917" }}>Sandbox + Prod</span>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(37,99,235,0.12)",
                    color: "#2563eb",
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Live
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: "#8B7355", margin: 0 }}>Production approved Mar 18, 2026</p>
            </div>
          </div>
        </section>

        <section>
          <p style={labelStyle}>Jobs this cycle</p>
          <div style={{ ...cardShell(CREAM), padding: "16px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid rgba(120,90,50,0.08)", padding: "14px 12px" }}>
              <p style={{ ...labelStyle, margin: "0 0 6px" }}>Processed</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#1C1917", margin: "0 0 6px" }}>1,124</p>
              <p style={{ fontSize: 12, color: "#22C55E", fontWeight: 700, margin: 0 }}>+29% vs prev</p>
            </div>
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid rgba(120,90,50,0.08)", padding: "14px 12px" }}>
              <p style={{ ...labelStyle, margin: "0 0 6px" }}>Compliance Holds</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#1C1917", margin: "0 0 6px" }}>0</p>
              <p style={{ fontSize: 12, color: "#22C55E", fontWeight: 700, margin: 0 }}>All clear</p>
            </div>
          </div>
        </section>

        <section>
          <p style={labelStyle}>Webhooks</p>
          <div
            style={{
              ...cardShell(BLUSH),
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p style={{ ...labelStyle, margin: "0 0 4px" }}>Total events</p>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "#1C1917", lineHeight: 1 }}>
                  {mobileWebhookTotal.toLocaleString()}
                </div>
              </div>
              <Link href="/portal/webhooks" style={viewLinkStyle}>
                View {"->"}
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
              {mobileWebhookData.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "#FFFFFF",
                    border: "1px solid rgba(120,90,50,0.07)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: "#8B7355", minWidth: 0 }}>{item.name}</span>
                  </div>
                  <strong style={{ fontSize: 13, color: "#1C1917" }}>{item.value.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <p style={labelStyle}>Operational readiness</p>
          <div style={{ ...cardShell(WARM), padding: "18px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", margin: "0 0 4px" }}>Tenant gates</h3>
              <p style={{ fontSize: 12.5, color: "#8B7355", margin: 0 }}>3 items need attention</p>
            </div>

            <Link href="/portal/settings" style={{ textDecoration: "none" }}>
              <button
                className="cta-3d btn-primary"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13.5,
                }}
              >
                Review tenant settings
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </Link>

            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {READINESS_ROWS.map((row) => {
                const rowStyle = STATUS_STYLE[row.status as keyof typeof STATUS_STYLE];
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "18px minmax(0, 1fr) auto 18px",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 12px",
                      borderRadius: 14,
                      background: row.status === "warn" ? "rgba(245,158,11,0.12)" : "#FFFFFF",
                      border: "1px solid rgba(120,90,50,0.08)",
                    }}
                  >
                    <rowStyle.icon style={{ width: 16, height: 16, color: rowStyle.color }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1C1917" }}>{row.label}</div>
                      <div style={{ fontSize: 11.5, color: "#8B7355", marginTop: 2 }}>{row.value}</div>
                    </div>
                    <MoreHorizontal style={{ width: 0, height: 0, opacity: 0 }} />
                    <rowStyle.icon style={{ width: 14, height: 14, color: rowStyle.color }} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <div style={{ ...cardShell(BLUSH), padding: "18px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "rgba(245,158,11,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Webhook style={{ width: 18, height: 18, color: "#d97706" }} />
              </div>
              <Link href="/portal/webhooks" style={viewLinkStyle}>
                View {"->"}
              </Link>
            </div>

            <div>
              <p style={{ ...labelStyle, margin: "0 0 6px" }}>Next action</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "#1C1917" }}>Verify webhooks</span>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(245,158,11,0.12)",
                    color: "#d97706",
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Recommended
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: "#8B7355", margin: 0 }}>2 endpoints on sandbox secret rotation</p>
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ paddingTop: 22 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isPhone ? "1fr" : isTablet ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr)) 1.1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
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
            gridColumn: isPhone ? "auto" : isTablet ? "1 / -1" : "auto",
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        <UsageChart />
        <WebhookDonut />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          style={{ ...cardShell(WARM), padding: "24px 28px" }}
          className="xl:col-span-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 mb-5">
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
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{
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
          style={{ ...cardShell(CREAM), padding: "24px 24px 20px" }}
          className="xl:col-span-4"
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
