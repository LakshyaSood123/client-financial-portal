import { motion } from "framer-motion";
import { Link } from "wouter";
import { AlertTriangle, BadgeIndianRupee, CreditCard, Download, Wallet } from "lucide-react";
import { TiltCard } from "@/components/shared/TiltCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CREAM = "#FAF8F4";
const WARM = "#F2EBE1";

const cardShell = (background: string): React.CSSProperties => ({
  background,
  border: "1px solid rgba(120,90,50,0.08)",
  borderRadius: 20,
  boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
});

const LEDGER = [
  { description: "Cycle opening balance", type: "credit", amount: "INR 2,750", date: "Mar 1, 2026", balance: "INR 2,750" },
  { description: "Usage charges - 1,124 jobs", type: "usage", amount: "-INR 270", date: "Mar 1-23, 2026", balance: "INR 2,480" },
  { description: "Webhook replay credits", type: "adjustment", amount: "INR 18", date: "Mar 21, 2026", balance: "INR 2,498" },
  { description: "Manual billing adjustment", type: "adjustment", amount: "-INR 18", date: "Mar 22, 2026", balance: "INR 2,480" },
];

const TYPE_COLOR = {
  credit: "#22C55E",
  usage: "#F97316",
  adjustment: "#8b5cf6",
} as const;

export function BillingTab() {
  const mobile = useMediaQuery("(max-width: 767px)");

  if (mobile) {
    const statCards = [
      {
        label: "Current balance",
        value: "INR 2,480",
        note: "Above soft threshold",
        background: "rgba(34,197,94,0.10)",
        valueColor: "#1C1917",
        noteColor: "#22C55E",
      },
      {
        label: "Soft threshold",
        value: "INR 1,000",
        note: "Alert dispatched below",
        background: "rgba(245,158,11,0.10)",
        valueColor: "#1C1917",
        noteColor: "#F59E0B",
      },
      {
        label: "Hard negative limit",
        value: "INR -500",
        note: "Admission guard floor",
        background: "rgba(239,68,68,0.10)",
        valueColor: "#ef4444",
        noteColor: "#ef4444",
      },
      {
        label: "Daily cap left",
        value: "18,420",
        note: "jobs remaining",
        background: CREAM,
        valueColor: "#1C1917",
        noteColor: "#8B7355",
      },
    ];

    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                ...cardShell(card.background),
                padding: "14px 12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#A09080",
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: card.valueColor,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  marginBottom: 6,
                }}
              >
                {card.value}
              </div>
              <div style={{ fontSize: 12, color: card.noteColor, lineHeight: 1.35 }}>{card.note}</div>
            </div>
          ))}
        </div>

        <div style={{ ...cardShell(CREAM), padding: "16px 14px", border: "1px solid rgba(249,115,22,0.22)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#A09080",
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                Current plan
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                Growth
              </div>
              <div style={{ fontSize: 12.5, color: "#8B7355", marginTop: 4 }}>5,000 jobs included this cycle</div>
            </div>
            <span
              className="status-badge-3d badge-queued"
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(249,115,22,0.12)",
                color: "#F97316",
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Active
            </span>
          </div>
        </div>

        <div style={{ ...cardShell(WARM), padding: "16px 14px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 17, fontWeight: 800, color: "#1C1917" }}>Cycle Limits</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Billing status", "Healthy", "#22C55E"],
              ["Projected end-of-cycle", "INR 1,920", "#1C1917"],
              ["Daily cap remaining", "18,420 jobs", "#1C1917"],
              ["Usage-rated overage", "Enabled after allowance", "#F97316"],
            ].map(([label, value, color]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 14,
                  background: CREAM,
                  border: "1px solid rgba(120,90,50,0.08)",
                }}
              >
                <span style={{ fontSize: 12.5, color: "#8B7355" }}>{label}</span>
                <strong style={{ fontSize: 12.5, color }}>{value}</strong>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "11px 12px",
              borderRadius: 14,
              background: "rgba(249,115,22,0.12)",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12.5, color: "#8B7355", fontWeight: 700 }}>Next balance reset</span>
            <strong style={{ fontSize: 12.5, color: "#1C1917" }}>Apr 1, 2026</strong>
          </div>
        </div>

        <div style={{ ...cardShell(CREAM), padding: "16px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1C1917" }}>This cycle</h3>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#A09080" }}>
                Balance-affecting entries for the current reporting window.
              </p>
            </div>
            <button
              className="cta-3d"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(120,90,50,0.12)",
                background: "rgba(120,90,50,0.04)",
                color: "#8B7355",
                cursor: "pointer",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              <Download style={{ width: 14, height: 14 }} /> Export
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 10,
              marginBottom: 6,
              borderBottom: "1px solid rgba(120,90,50,0.08)",
            }}
          >
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Description
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Date
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {LEDGER.map((row, index) => (
              <div
                key={row.description}
                style={{
                  display: "grid",
                  gridTemplateColumns: "10px minmax(0, 1fr) auto",
                  gap: 10,
                  alignItems: "start",
                  padding: "12px 0",
                  borderBottom: index < LEDGER.length - 1 ? "1px solid rgba(120,90,50,0.06)" : "none",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: TYPE_COLOR[row.type as keyof typeof TYPE_COLOR],
                    marginTop: 4,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: "#1C1917", fontWeight: 700 }}>{row.description}</div>
                  <div style={{ fontSize: 12.5, color: TYPE_COLOR[row.type as keyof typeof TYPE_COLOR], fontWeight: 700, marginTop: 3 }}>
                    {row.amount}
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: "#8B7355", whiteSpace: "nowrap", textAlign: "right" }}>{row.date}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px solid rgba(120,90,50,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12, color: "#A09080" }}>Plan snapshot and invoice APIs still need backend wiring.</span>
            <Link href="/portal/settings" style={{ fontSize: 12, fontWeight: 700, color: "#F97316", textDecoration: "none", flexShrink: 0 }}>
              Review tenant settings {"->"}
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: "Current balance", value: "INR 2,480", note: "Healthy and above soft threshold", icon: Wallet, bg: CREAM, color: "#22C55E" },
          { label: "Soft threshold", value: "INR 1,000", note: "Alert dispatch starts below this point", icon: AlertTriangle, bg: WARM, color: "#F59E0B" },
          { label: "Hard negative limit", value: "INR -500", note: "Admission guard blocks beyond this floor", icon: CreditCard, bg: WARM, color: "#ef4444" },
          { label: "Current plan", value: "Growth", note: "5,000 jobs included this cycle", icon: BadgeIndianRupee, bg: CREAM, color: "#2563eb" },
        ].map((card) => (
          <TiltCard key={card.label} style={{ ...cardShell(card.bg), padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A09080", marginBottom: 8 }}>{card.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.02em" }}>{card.value}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <card.icon style={{ width: 18, height: 18, color: card.color }} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#8B7355", lineHeight: 1.5 }}>{card.note}</div>
          </TiltCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-5" style={{ ...cardShell(WARM), padding: 22 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800, color: "#1C1917" }}>Cycle Limits</h3>
          <p style={{ margin: "0 0 18px", fontSize: 12.5, color: "#A09080" }}>
            The embedded billing spec centers on thresholds, caps, and balance status rather than a generic invoice-only view.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Billing status", "Healthy"],
              ["Projected end-of-cycle balance", "INR 1,920"],
              ["Daily cap remaining", "18,420 jobs"],
              ["Usage-rated overage", "Enabled after plan allowance"],
              ["Next balance reset", "Apr 1, 2026"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: 14, background: CREAM }}>
                <span style={{ fontSize: 12.5, color: "#8B7355" }}>{label}</span>
                <strong style={{ fontSize: 12.5, color: "#1C1917" }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-7" style={{ ...cardShell(CREAM), padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1C1917" }}>Ledger Snapshot</h3>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#A09080" }}>Balance-affecting entries for the current reporting window.</p>
            </div>
            <button
              className="cta-3d"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(120,90,50,0.12)",
                background: "rgba(120,90,50,0.04)",
                color: "#8B7355",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <Download style={{ width: 14, height: 14 }} /> Export
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 140px 160px 140px", padding: "0 10px 12px", borderBottom: "1px solid rgba(120,90,50,0.08)" }}>
            {["Description", "Date", "Amount", "Balance"].map((heading) => (
              <span key={heading} style={{ fontSize: 10.5, fontWeight: 700, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {heading}
              </span>
            ))}
          </div>

          <div>
            {LEDGER.map((row, index) => (
              <div
                className="data-row-3d"
                key={row.description}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 140px 160px 140px",
                  padding: "14px 10px",
                  borderBottom: index < LEDGER.length - 1 ? "1px solid rgba(120,90,50,0.06)" : "none",
                  animationDelay: `${index * 60}ms`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLOR[row.type as keyof typeof TYPE_COLOR] }} />
                  <span style={{ fontSize: 13.5, color: "#1C1917", fontWeight: 700 }}>{row.description}</span>
                </div>
                <span style={{ fontSize: 12.5, color: "#8B7355" }}>{row.date}</span>
                <span style={{ fontSize: 12.5, color: TYPE_COLOR[row.type as keyof typeof TYPE_COLOR], fontWeight: 700 }}>{row.amount}</span>
                <span style={{ fontSize: 12.5, color: "#1C1917", fontWeight: 700 }}>{row.balance}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(120,90,50,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#A09080" }}>Plan snapshot and invoice APIs still need backend wiring.</span>
            <Link href="/portal/settings" style={{ fontSize: 12, fontWeight: 700, color: "#F97316", textDecoration: "none" }}>
              Review tenant settings {"->"}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
