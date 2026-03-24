import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Building2, FileText, ChevronRight, CheckCircle2, Upload, ArrowLeft } from "lucide-react";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";

const STEPS = [
  { id: 1, label: "Business Details",   icon: Building2  },
  { id: 2, label: "KYB Documents",     icon: FileText   },
  { id: 3, label: "Review & Submit",   icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <div style={{
      minHeight: "100vh", background: "#E9E7E2",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Satoshi', sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 640 }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #F97316, #F59E0B)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>N</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#1C1917" }}>
            Nexus<span style={{ color: "#F97316" }}>KYC</span> · Onboarding
          </span>
        </div>

        <BackendPlaceholder
          type="pending"
          title="Onboarding API Pending"
          description="Tenant creation and KYB upload endpoints are required. Showing UI shell."
        />

        {/* Step progress */}
        <div style={{ display: "flex", gap: 0, marginBottom: 28, alignItems: "center" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div
                onClick={() => setStep(s.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  cursor: "pointer", flex: 1,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: step >= s.id ? "linear-gradient(135deg, #F97316, #F59E0B)" : "rgba(180,160,120,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.3s ease",
                }}>
                  <s.icon style={{ width: 16, height: 16, color: step >= s.id ? "#fff" : "#B0A090" }} />
                </div>
                <span style={{ fontSize: 11.5, fontWeight: step === s.id ? 700 : 500, color: step >= s.id ? "#1C1917" : "#B0A090" }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ height: 1, flex: 1, background: step > s.id ? "#F97316" : "rgba(180,160,120,0.2)", maxWidth: 40, marginTop: -16 }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div style={{ background: "#FAF8F4", borderRadius: 20, padding: 32, boxShadow: "0 4px 32px rgba(90,65,30,0.08)" }}>
          {step === 1 && <StepBusinessDetails />}
          {step === 2 && <StepKYBUpload />}
          {step === 3 && <StepReview />}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, gap: 12 }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} style={btnSecondary}>
                <ArrowLeft style={{ width: 15, height: 15 }} /> Back
              </button>
            ) : (
              <Link href="/login"><span style={btnSecondary}><ArrowLeft style={{ width: 15, height: 15 }} /> Login</span></Link>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} style={btnPrimary}>
                Continue <ChevronRight style={{ width: 15, height: 15 }} />
              </button>
            ) : (
              <button disabled style={{ ...btnPrimary, opacity: 0.5, cursor: "not-allowed" }}>
                Submit (backend pending)
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const field: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1px solid rgba(120,90,50,0.15)", background: "#F7F3EE",
  fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#1C1917",
  outline: "none", boxSizing: "border-box",
};

const label: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 600, color: "#6B5F54",
  display: "block", marginBottom: 5, fontFamily: "'Satoshi', sans-serif",
};

const btnPrimary: React.CSSProperties = {
  padding: "11px 24px", borderRadius: 12, border: "none",
  background: "linear-gradient(135deg, #F97316, #F59E0B)",
  color: "#fff", fontFamily: "'Satoshi', sans-serif", fontWeight: 700,
  fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
};

const btnSecondary: React.CSSProperties = {
  padding: "11px 20px", borderRadius: 12, border: "1px solid rgba(120,90,50,0.15)",
  background: "transparent", color: "#6B5F54",
  fontFamily: "'Satoshi', sans-serif", fontWeight: 600,
  fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
  textDecoration: "none",
};

function StepBusinessDetails() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1C1917", margin: "0 0 6px" }}>Business Details</h2>
      <p style={{ fontSize: 13, color: "#A09080", margin: "0 0 24px" }}>Tell us about your organization.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[["Company Name", "Acme Corp Ltd"], ["Registration Number", "12345678"], ["Jurisdiction", "United Kingdom"], ["Entity Type", "Private Limited Company"]].map(([l, p]) => (
          <div key={l}>
            <span style={label}>{l}</span>
            <input placeholder={p} style={field} />
          </div>
        ))}
        <div style={{ gridColumn: "1 / -1" }}>
          <span style={label}>Registered Address</span>
          <input placeholder="123 Business Street, London, EC1A 1BB" style={field} />
        </div>
      </div>
    </div>
  );
}

function StepKYBUpload() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1C1917", margin: "0 0 6px" }}>KYB Documents</h2>
      <p style={{ fontSize: 13, color: "#A09080", margin: "0 0 20px" }}>Upload your verification documents. Accepted: PDF, JPG, PNG (max 10 MB each).</p>
      {["Certificate of Incorporation", "Proof of Address", "Director ID (Passport / DL)"].map(docType => (
        <div key={docType} style={{
          border: "1.5px dashed rgba(120,90,50,0.2)", borderRadius: 12,
          padding: "20px 20px", marginBottom: 12, textAlign: "center",
          background: "rgba(180,160,120,0.04)",
        }}>
          <Upload style={{ width: 20, height: 20, color: "#C4B5A5", marginBottom: 8 }} />
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#6B5F54" }}>{docType}</div>
          <div style={{ fontSize: 12, color: "#B0A090", marginTop: 4 }}>Drop file here or click to browse</div>
        </div>
      ))}
    </div>
  );
}

function StepReview() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1C1917", margin: "0 0 6px" }}>Review & Submit</h2>
      <p style={{ fontSize: 13, color: "#A09080", margin: "0 0 20px" }}>Review your information before submitting for KYB verification.</p>
      <div style={{
        background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.18)",
        borderRadius: 12, padding: "14px 18px",
      }}>
        <div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
          Submission will be sent to the NexusKYC verification queue. Processing typically takes 1–3 business days.
          You'll receive an email notification once your KYB status changes.
        </div>
      </div>
    </div>
  );
}
