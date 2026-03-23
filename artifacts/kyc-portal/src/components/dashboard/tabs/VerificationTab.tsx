import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertTriangle, FileText, Upload, ShieldCheck, XCircle } from "lucide-react";
import { Link } from "wouter";

const lightCard = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 20,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
} as React.CSSProperties;

const DOCUMENTS = [
  { name: "Certificate of Incorporation",       status: "verified", date: "Mar 15, 2026", size: "2.4 MB" },
  { name: "Proof of Registered Address",         status: "verified", date: "Mar 15, 2026", size: "1.1 MB" },
  { name: "Director — National ID (Stefan A.)",  status: "verified", date: "Mar 16, 2026", size: "0.8 MB" },
  { name: "UBO Declaration Form",                status: "verified", date: "Mar 17, 2026", size: "0.5 MB" },
  { name: "Latest Audited Financials",           status: "pending",  date: "Requested Mar 20", size: "—" },
];

const DOC_STATUS: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  verified: { icon: CheckCircle2, color: "#00b896", label: "Verified" },
  pending:  { icon: Clock,        color: "#f59b20", label: "Pending" },
  rejected: { icon: XCircle,      color: "#f54a4a", label: "Rejected" },
};

const TIMELINE = [
  { event: "KYB verification approved",     date: "Mar 18, 2026", color: "#00b896", icon: ShieldCheck },
  { event: "UBO declaration reviewed",      date: "Mar 17, 2026", color: "#efc92d", icon: CheckCircle2 },
  { event: "Director identity confirmed",   date: "Mar 16, 2026", color: "#efc92d", icon: CheckCircle2 },
  { event: "Documents submitted",           date: "Mar 15, 2026", color: "#8b6ff4", icon: Upload },
  { event: "KYB application opened",        date: "Mar 14, 2026", color: "#b5b2ab", icon: FileText },
];

const RISK_FACTORS = [
  { label: "Jurisdiction",  value: "United Kingdom",       status: "clear" },
  { label: "PEP Screening", value: "No matches",           status: "clear" },
  { label: "Sanctions Check", value: "No matches",         status: "clear" },
  { label: "Adverse Media", value: "No flags",             status: "clear" },
  { label: "UBO Complexity", value: "2 beneficial owners", status: "review" },
];

const item = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

export function VerificationTab() {
  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Status hero + risk summary row */}
      <div className="grid grid-cols-12 gap-5">

        {/* KYB status card */}
        <motion.div
          style={{ ...lightCard, gridColumn: "span 5" }}
          className="col-span-5 p-6"
          custom={0} variants={item} initial="hidden" animate="show"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#8a8a8a" }}>KYB Status</p>
              <div className="flex items-center gap-3">
                <h2 className="font-display font-bold" style={{ fontSize: 32, letterSpacing: "-0.02em", color: "#1a1a1a" }}>Verified</h2>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(0,184,150,0.1)", color: "#00b896", border: "1px solid rgba(0,184,150,0.2)" }}>
                  ✓ Approved
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: "#8a8a8a" }}>Verified Mar 18, 2026 · expires Mar 18, 2028</p>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,184,150,0.1)", border: "1px solid rgba(0,184,150,0.15)" }}
            >
              <ShieldCheck className="w-7 h-7" style={{ color: "#00b896" }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Entity Type", value: "Private Ltd" },
              { label: "Risk Tier",   value: "Low" },
              { label: "Jurisdiction", value: "UK" },
            ].map(f => (
              <div key={f.label} className="p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.03)" }}>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#8a8a8a" }}>{f.label}</p>
                <p className="text-sm font-bold" style={{ color: "#1a1a1a" }}>{f.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk factors */}
        <motion.div
          style={{ ...lightCard, gridColumn: "span 7" }}
          className="col-span-7 p-6"
          custom={1} variants={item} initial="hidden" animate="show"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#1a1a1a" }}>Risk Assessment</h3>
            <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: "rgba(0,184,150,0.1)", color: "#00b896" }}>Low Risk</span>
          </div>
          <div className="space-y-2">
            {RISK_FACTORS.map((rf) => (
              <div key={rf.label} className="flex items-center justify-between h-10 px-3 rounded-xl" style={{ background: "rgba(0,0,0,0.02)" }}>
                <span className="text-sm" style={{ color: "#8a8a8a" }}>{rf.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{rf.value}</span>
                  {rf.status === "clear"
                    ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#00b896" }} />
                    : <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f59b20" }} />
                  }
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Documents + Timeline */}
      <div className="grid grid-cols-12 gap-5">

        {/* Documents */}
        <motion.div
          style={{ ...lightCard, gridColumn: "span 7" }}
          className="col-span-7 p-6"
          custom={2} variants={item} initial="hidden" animate="show"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#1a1a1a" }}>Submitted Documents</h3>
            <Link href="/kyb-upload" className="text-xs font-semibold transition-colors hover:text-[#1a1a1a]" style={{ color: "#8a8a8a" }}>
              Upload More →
            </Link>
          </div>
          <div className="space-y-1">
            {DOCUMENTS.map((doc) => {
              const s = DOC_STATUS[doc.status];
              return (
                <div
                  key={doc.name}
                  className="flex items-center gap-3 h-14 px-3 rounded-xl group transition-all"
                  style={{ borderLeft: "2px solid transparent" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "#00b896";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.02)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                    (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
                    <FileText className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-[#00b896] transition-colors" style={{ color: "#1a1a1a" }}>{doc.name}</p>
                    <p className="text-[10px]" style={{ color: "#8a8a8a" }}>{doc.date} · {doc.size}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
                    <s.icon className="w-3 h-3" />
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Verification timeline */}
        <motion.div
          style={{ ...lightCard, gridColumn: "span 5" }}
          className="col-span-5 p-6"
          custom={3} variants={item} initial="hidden" animate="show"
        >
          <h3 className="font-display font-bold mb-5" style={{ fontSize: 18, color: "#1a1a1a" }}>Verification Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: "rgba(0,0,0,0.08)" }} />
            <div className="space-y-5">
              {TIMELINE.map((ev, i) => (
                <div key={i} className="flex items-start gap-4 pl-9 relative">
                  <div
                    className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ev.color}15`, border: `1.5px solid ${ev.color}35` }}
                  >
                    <ev.icon className="w-3.5 h-3.5" style={{ color: ev.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#1a1a1a" }}>{ev.event}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#8a8a8a" }}>{ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
