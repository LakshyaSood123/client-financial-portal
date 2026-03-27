import { PortalShell } from "./PortalShell";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { TiltCard } from "@/components/shared/TiltCard";
import { Clock3, FileText, ShieldCheck, UploadCloud } from "lucide-react";

const FILES = [
  { name: "Certificate of Incorporation.pdf", category: "Corporate", status: "Accepted", uploaded: "Mar 15, 2026", requestedBy: "Onboarding" },
  { name: "Registered Address.pdf", category: "Address", status: "Accepted", uploaded: "Mar 15, 2026", requestedBy: "Onboarding" },
  { name: "Audited Financials FY25.pdf", category: "Finance", status: "Requested", uploaded: "-", requestedBy: "Annual review" },
  { name: "Director Passport.png", category: "Identity", status: "Accepted", uploaded: "Mar 16, 2026", requestedBy: "Compliance" },
];

const panel: React.CSSProperties = {
  background: "#F7F3EE",
  borderRadius: 18,
  border: "1px solid rgba(120,90,50,0.08)",
  padding: 22,
};

const panelTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 800,
  color: "#1C1917",
};

const panelSubtitle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 12.5,
  color: "#8B7355",
  lineHeight: 1.55,
};

const primaryButton: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  color: "#fff",
  fontFamily: "'Satoshi', sans-serif",
  fontWeight: 700,
};

export default function PortalUploads() {
  return (
    <PortalShell title="Uploads" subtitle="Presigned upload workflow, submitted files, and outstanding document requests" showRail={false}>
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative upload records. Live uploads should connect to the documented presign and job-ingest flows."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, marginBottom: 20 }}>
        <div style={panel}>
          <h2 style={panelTitle}>Upload Console</h2>
          <p style={panelSubtitle}>The embedded docs expect tenant uploads to be driven by presigned URLs and linked into downstream jobs.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 18 }}>
            {[
              { label: "Accepted files", value: "4" },
              { label: "Requested", value: "1" },
              { label: "Linked jobs", value: "3" },
            ].map((item) => (
              <TiltCard key={item.label} style={{ background: "#FAF8F4", borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 11, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#1C1917" }}>{item.value}</div>
              </TiltCard>
            ))}
          </div>
        </div>

        <div style={{ ...panel, background: "#EBE1D5" }}>
          <h2 style={panelTitle}>Next Required Upload</h2>
          <p style={panelSubtitle}>Audited financials are still outstanding for the current annual review cycle.</p>
          <div style={{ marginTop: 18, background: "rgba(255,255,255,0.45)", borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UploadCloud style={{ width: 18, height: 18, color: "#F59E0B" }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1917" }}>Audited Financials FY25</div>
                <div style={{ fontSize: 12, color: "#8B7355" }}>Requested Mar 20, 2026 by annual review workflow.</div>
              </div>
            </div>
            <button className="cta-3d btn-primary" style={primaryButton}>Generate presigned upload</button>
          </div>
        </div>
      </div>

      <div style={{ ...panel, padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 140px 140px 140px 140px", padding: "12px 20px", borderBottom: "1px solid rgba(120,90,50,0.08)" }}>
          {["File", "Category", "Status", "Uploaded", "Requested by"].map((heading) => (
            <span key={heading} style={{ fontSize: 10.5, fontWeight: 700, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {heading}
            </span>
          ))}
        </div>
        {FILES.map((file, index) => (
          <div
            className="data-row-3d"
            key={file.name}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 140px 140px 140px 140px",
              padding: "14px 20px",
              alignItems: "center",
              borderBottom: index < FILES.length - 1 ? "1px solid rgba(120,90,50,0.06)" : "none",
              background: "#FAF8F4",
              animationDelay: `${index * 60}ms`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText style={{ width: 16, height: 16, color: "#22C55E" }} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1C1917" }}>{file.name}</span>
            </div>
            <span style={{ fontSize: 12.5, color: "#8B7355" }}>{file.category}</span>
            <div className={`status-badge-3d ${file.status === "Accepted" ? "badge-completed" : "badge-queued"}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content", padding: "4px 10px", borderRadius: 999, background: file.status === "Accepted" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)", color: file.status === "Accepted" ? "#22C55E" : "#F59E0B", boxShadow: file.status === "Accepted" ? "0 2px 8px rgba(34,197,94,0.35)" : "0 2px 8px rgba(245,158,11,0.35)" }}>
              {file.status === "Accepted" ? <ShieldCheck style={{ width: 12, height: 12 }} /> : <Clock3 style={{ width: 12, height: 12 }} />}
              <span style={{ fontSize: 11.5, fontWeight: 700 }}>{file.status}</span>
            </div>
            <span style={{ fontSize: 12.5, color: "#8B7355" }}>{file.uploaded}</span>
            <span style={{ fontSize: 12.5, color: "#8B7355" }}>{file.requestedBy}</span>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}
