import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, ChevronRight, Circle } from "lucide-react";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

const STEPS = [
  { id: 1, label: "Create tenant", summary: "Create the tenant record and verify the primary contact." },
  { id: 2, label: "Business profile", summary: "Capture legal name, jurisdiction, and ownership details." },
  { id: 3, label: "KYB evidence", summary: "Collect the baseline document package required for review." },
  { id: 4, label: "Review and approve", summary: "Analyst confirms the KYB package and sets the risk tier." },
  { id: 5, label: "Choose plan", summary: "Apply starter, growth, or custom commercial terms." },
  { id: 6, label: "Fund wallet", summary: "Ensure balance and threshold controls are in a healthy state." },
  { id: 7, label: "Verify integrations", summary: "Issue sandbox keys, test uploads, and confirm webhooks." },
  { id: 8, label: "Production admission", summary: "Enable production once the admission guard is satisfied." },
];

const completedStepIds = [1, 2, 3, 4, 5];

const STEP_DETAILS: Record<number, { fields: [string, string][]; note: string }> = {
  1: {
    fields: [
      ["Tenant ID", "ten_4x8a"],
      ["Primary contact", "stefan@acme.co"],
      ["Workspace region", "EU West"],
      ["Status", "Created Mar 14, 2026"],
    ],
    note: "The tenant workspace has been created and the primary business contact has already completed email verification.",
  },
  2: {
    fields: [
      ["Legal entity", "Anime Corp Ltd"],
      ["Jurisdiction", "United Kingdom"],
      ["Registration number", "12345678"],
      ["Ownership profile", "2 declared UBOs"],
    ],
    note: "The business profile is complete and matches the information supplied in the KYB package.",
  },
  3: {
    fields: [
      ["Accepted documents", "4"],
      ["Outstanding requests", "1"],
      ["Last upload", "Mar 17, 2026"],
      ["Evidence package", "Baseline complete"],
    ],
    note: "Core KYB documents are on file. Audited financials remain requested for the annual review requirement.",
  },
  4: {
    fields: [
      ["Decision", "Approved"],
      ["Risk tier", "Low"],
      ["Reviewer", "Compliance Ops"],
      ["Decision date", "Mar 18, 2026"],
    ],
    note: "Compliance approved the tenant and assigned a low-risk profile after completing sanctions, PEP, and adverse-media checks.",
  },
  5: {
    fields: [
      ["Current plan", "Growth"],
      ["Included volume", "5,000 jobs / cycle"],
      ["Billing model", "Prepaid balance"],
      ["Webhook access", "Included"],
    ],
    note: "The tenant is on the Growth plan, which supports production keys, uploads, and customer webhook endpoints.",
  },
  6: {
    fields: [
      ["Current balance", "INR 2,480"],
      ["Soft threshold", "INR 1,000"],
      ["Hard negative limit", "INR -500"],
      ["Billing status", "Healthy"],
    ],
    note: "The wallet is funded and comfortably above the alert threshold, so billing controls are not blocking go-live.",
  },
  7: {
    fields: [
      ["Sandbox keys", "2 issued"],
      ["Webhook endpoints", "2 verified"],
      ["Uploads smoke test", "Passed"],
      ["Pending action", "Rotate sandbox secret"],
    ],
    note: "Technical onboarding is nearly complete. The remaining action is a final sandbox webhook secret rotation before promotion.",
  },
  8: {
    fields: [
      ["Production gate", "Pending sign-off"],
      ["Blocking item", "Integration sign-off"],
      ["Recommended owner", "Platform Ops"],
      ["Target date", "Mar 29, 2026"],
    ],
    note: "Production admission will be enabled once the final integration checks are signed off and the admission guard is satisfied.",
  },
};

const fieldCard: React.CSSProperties = {
  background: "#F7F3EE",
  borderRadius: 14,
  padding: 16,
  border: "1px solid rgba(120,90,50,0.08)",
};

const buttonPrimary: React.CSSProperties = {
  padding: "11px 22px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #F97316, #F59E0B)",
  color: "#fff",
  fontFamily: "'Satoshi', sans-serif",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const buttonSecondary: React.CSSProperties = {
  padding: "11px 18px",
  borderRadius: 12,
  border: "1px solid rgba(120,90,50,0.15)",
  background: "transparent",
  color: "#6B5F54",
  fontFamily: "'Satoshi', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  textDecoration: "none",
};

export default function OnboardingPage() {
  const [step, setStep] = useState(6);
  const active = STEPS.find((item) => item.id === step) ?? STEPS[0];
  const details = STEP_DETAILS[active.id];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#E9E7E2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 1040 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #F97316, #F59E0B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>N</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1C1917" }}>
              Nexus<span style={{ color: "#F97316" }}>KYC</span> · Onboarding
            </span>
          </div>
          <Link href="/portal">
            <span style={buttonSecondary}>
              <ArrowLeft style={{ width: 15, height: 15 }} /> Back to dashboard
            </span>
          </Link>
        </div>

        <BackendPlaceholder
          type="pending"
          title="Docs-aligned onboarding shell"
          description="The embedded frontend docs describe an 8-stage onboarding and admission flow. This page now mirrors that lifecycle while backend APIs remain pending."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: 20,
            background: "#FAF8F4",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 4px 32px rgba(90,65,30,0.08)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {STEPS.map((item) => {
              const completed = completedStepIds.includes(item.id);
              const current = item.id === step;
              return (
                <button
                  key={item.id}
                  onClick={() => setStep(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: 14,
                    borderRadius: 16,
                    border: "1px solid rgba(120,90,50,0.08)",
                    background: current ? "rgba(249,115,22,0.08)" : "#F7F3EE",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ marginTop: 2 }}>
                    {completed ? (
                      <CheckCircle2 style={{ width: 16, height: 16, color: "#22C55E" }} />
                    ) : current ? (
                      <CheckCircle2 style={{ width: 16, height: 16, color: "#F97316" }} />
                    ) : (
                      <Circle style={{ width: 16, height: 16, color: "#C4B5A5" }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1C1917", marginBottom: 4 }}>
                      {item.id}. {item.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#8B7355", lineHeight: 1.5 }}>{item.summary}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A09080", marginBottom: 8 }}>
                Step {active.id} of {STEPS.length}
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", margin: "0 0 8px" }}>{active.label}</h2>
              <p style={{ fontSize: 13.5, color: "#8B7355", margin: 0, lineHeight: 1.6 }}>{active.summary}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              {details.fields.map(([label, value]) => (
                <div key={label} style={fieldCard}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A09080", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1917" }}>{value}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "rgba(249,115,22,0.06)",
                border: "1px solid rgba(249,115,22,0.18)",
                borderRadius: 16,
                padding: 18,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>Implementation note</div>
              <div style={{ fontSize: 12.5, color: "#92400e", lineHeight: 1.6 }}>
                {details.note} Submission, plan mutation, and admission guard decisions still require backend endpoints.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                {step > 1 ? (
                  <button onClick={() => setStep((current) => current - 1)} style={buttonSecondary}>
                    <ArrowLeft style={{ width: 15, height: 15 }} /> Back
                  </button>
                ) : (
                  <Link href="/login">
                    <span style={buttonSecondary}>
                      <ArrowLeft style={{ width: 15, height: 15 }} /> Login
                    </span>
                  </Link>
                )}
                <Link href="/portal">
                  <span style={buttonSecondary}>Back to dashboard</span>
                </Link>
              </div>
              {step < STEPS.length ? (
                <button onClick={() => setStep((current) => current + 1)} style={buttonPrimary}>
                  Continue <ChevronRight style={{ width: 15, height: 15 }} />
                </button>
              ) : (
                <button disabled style={{ ...buttonPrimary, opacity: 0.5, cursor: "not-allowed" }}>
                  Awaiting production admission
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
