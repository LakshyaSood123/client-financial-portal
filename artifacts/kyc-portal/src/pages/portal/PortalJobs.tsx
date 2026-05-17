import { useState } from "react";
import { PortalShell } from "./PortalShell";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { TiltCard } from "@/components/shared/TiltCard";
import { CheckCircle2, Clock3, Download, Eye, Image, Search, X, XCircle } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const JOBS = [
  {
    id: "job_9r2ka",
    source: "prod_primary",
    type: "KYB refresh",
    status: "Completed",
    submitted: "Mar 23, 14:32",
    duration: "3m 18s",
    imagesTotal: 214,
    imagesPerMin: 65,
    details: "Full KYB refresh for Anime Corp Ltd. Director identity documents re-verified against government registry. No discrepancies found.",
  },
  {
    id: "job_8w7tp",
    source: "sandbox_ci",
    type: "Document OCR",
    status: "Running",
    submitted: "Mar 23, 13:10",
    duration: "1m 09s",
    imagesTotal: 88,
    imagesPerMin: 77,
    details: "Optical character recognition pass on uploaded passport and utility bill. Extraction in progress.",
  },
  {
    id: "job_6k1ms",
    source: "prod_primary",
    type: "Face match",
    status: "Failed",
    submitted: "Mar 23, 10:45",
    duration: "42s",
    imagesTotal: 12,
    imagesPerMin: 17,
    details: "Liveness check passed but face match confidence score fell below threshold (61% < 80%). Manual review required.",
  },
  {
    id: "job_5a4qc",
    source: "prod_secondary",
    type: "AML screening",
    status: "Queued",
    submitted: "Mar 23, 09:27",
    duration: "-",
    imagesTotal: 0,
    imagesPerMin: 0,
    details: "Anti-money laundering screening queued. Awaiting slot in processing pipeline.",
  },
];

type Job = typeof JOBS[number];

const statusStyle = {
  Completed: { color: "#22C55E", bg: "rgba(34,197,94,0.12)", icon: CheckCircle2 },
  Running: { color: "#2563eb", bg: "rgba(37,99,235,0.12)", icon: Clock3 },
  Failed: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: XCircle },
  Queued: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", icon: Clock3 },
} as const;

const ghostButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 10,
  border: "1px solid rgba(120,90,50,0.12)",
  background: "rgba(120,90,50,0.04)",
  padding: "8px 12px",
  cursor: "pointer",
  color: "#8B7355",
  fontWeight: 600,
  fontFamily: "'Satoshi', sans-serif",
};

function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const tone = statusStyle[job.status as keyof typeof statusStyle];
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAF8F4",
          borderRadius: 24,
          border: "1px solid rgba(120,90,50,0.12)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          padding: 32,
          maxWidth: 520,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <code style={{ fontSize: 12, color: "#8B7355", display: "block", marginBottom: 6 }}>{job.id}</code>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1C1917" }}>{job.type}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#A09080" }}>Source: {job.source}</p>
          </div>
          <button
            onClick={onClose}
            style={{ border: "none", background: "rgba(120,90,50,0.08)", borderRadius: 10, padding: 8, cursor: "pointer", color: "#8B7355" }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#F2EAE1", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Status</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: tone.bg, color: tone.color, borderRadius: 999, padding: "4px 10px" }}>
              <tone.icon style={{ width: 12, height: 12 }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>{job.status}</span>
            </div>
          </div>
          <div style={{ background: "#F2EAE1", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Duration</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1C1917" }}>{job.duration}</div>
          </div>
          <div style={{ background: "#F2EAE1", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              <Image style={{ width: 10, height: 10, display: "inline", marginRight: 4 }} />
              Images Processed
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1C1917" }}>{job.imagesTotal.toLocaleString()}</div>
          </div>
          <div style={{ background: "#F2EAE1", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Per Minute</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1C1917" }}>{job.imagesPerMin} <span style={{ fontSize: 12, fontWeight: 500, color: "#A09080" }}>img/min</span></div>
          </div>
        </div>

        <div style={{ background: "#F2EAE1", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Submitted</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1C1917" }}>{job.submitted}</div>
        </div>

        <div style={{ background: "#F2EAE1", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Report</div>
          <p style={{ margin: 0, fontSize: 13, color: "#57493C", lineHeight: 1.6 }}>{job.details}</p>
        </div>
      </div>
    </div>
  );
}

export default function PortalJobs() {
  const mobile = useMediaQuery("(max-width: 767px)");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <PortalShell title="Jobs" subtitle="Job execution status, throughput, and recent processing activity" showRail={false}>
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative job data. Live data should map to the documented /jobs and /jobs/{jobId} APIs."
      />

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Cycle jobs", value: "1,124", note: "+29% vs previous cycle" },
          { label: "Queue backlog", value: "14", note: "Analyst review required" },
          { label: "Images processed", value: "314", note: "Total this cycle" },
          { label: "Avg throughput", value: "53/min", note: "Images per minute" },
        ].map((card) => (
          <TiltCard
            key={card.label}
            style={{
              background: "#FAF8F4",
              border: "1px solid rgba(120,90,50,0.08)",
              borderRadius: 18,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A09080", marginBottom: 10 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.02em", marginBottom: 6 }}>{card.value}</div>
            <div style={{ fontSize: 12, color: "#8B7355" }}>{card.note}</div>
          </TiltCard>
        ))}
      </div>

      <div
        style={{
          background: "#F7F3EE",
          borderRadius: 18,
          border: "1px solid rgba(120,90,50,0.08)",
          overflowX: mobile ? "auto" : "hidden",
        }}
      >
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "stretch" : "center", gap: mobile ? 14 : 0, padding: "18px 20px", borderBottom: "1px solid rgba(120,90,50,0.08)" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1C1917" }}>Recent Jobs</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#A09080" }}>Click Inspect to view full job details and report.</p>
          </div>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 8 }}>
            <button className="cta-3d" style={ghostButton}>
              <Search style={{ width: 14, height: 14 }} /> Filter
            </button>
            <button className="cta-3d" style={ghostButton}>
              <Download style={{ width: 14, height: 14 }} /> Export
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 130px 150px 90px 120px 80px", padding: "10px 20px", borderBottom: "1px solid rgba(120,90,50,0.07)", minWidth: 850 }}>
          {["Job ID", "Type", "Status", "Submitted", "Duration", "Images", "Inspect"].map((heading) => (
            <span key={heading} style={{ fontSize: 10.5, fontWeight: 700, color: "#A09080", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {heading}
            </span>
          ))}
        </div>

        {JOBS.map((job, index) => {
          const tone = statusStyle[job.status as keyof typeof statusStyle];
          return (
            <div
              className="data-row-3d"
              key={job.id}
              style={{
                display: "grid",
                gridTemplateColumns: "130px 1fr 130px 150px 90px 120px 80px",
                padding: "14px 20px",
                alignItems: "center",
                borderBottom: index < JOBS.length - 1 ? "1px solid rgba(120,90,50,0.06)" : "none",
                background: "#FAF8F4",
                animationDelay: `${index * 60}ms`,
                minWidth: 850,
              }}
            >
              <code style={{ fontSize: 12, color: "#8B7355" }}>{job.id}</code>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1C1917" }}>{job.type}</div>
                <div style={{ fontSize: 11.5, color: "#A09080" }}>Source: {job.source}</div>
              </div>
              <div className={`status-badge-3d ${job.status === "Completed" ? "badge-completed" : job.status === "Running" ? "badge-running" : job.status === "Failed" ? "badge-failed" : "badge-queued"}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: tone.bg, color: tone.color, borderRadius: 999, padding: "4px 10px", width: "fit-content", boxShadow: `0 2px 8px ${tone.color}59` }}>
                <tone.icon style={{ width: 12, height: 12 }} />
                <span style={{ fontSize: 11.5, fontWeight: 700 }}>{job.status}</span>
              </div>
              <span style={{ fontSize: 12.5, color: "#8B7355" }}>{job.submitted}</span>
              <span style={{ fontSize: 12.5, color: "#1C1917", fontWeight: 600 }}>{job.duration}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1C1917" }}>{job.imagesTotal.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#A09080" }}>{job.imagesPerMin} img/min</div>
              </div>
              <button
                className="cta-3d"
                style={{ ...ghostButton, padding: "7px 10px", width: "fit-content" }}
                onClick={() => setSelectedJob(job)}
              >
                <Eye style={{ width: 14, height: 14 }} />
              </button>
            </div>
          );
        })}
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </PortalShell>
  );
}
