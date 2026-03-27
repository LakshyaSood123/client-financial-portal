import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertTriangle, FileText, Upload, ShieldCheck, XCircle } from "lucide-react";
import { Link } from "wouter";

const CREAM = "#FAF8F4";
const WARM = "#F2EBE1";
const BLUSH = "#EBE1D5";

const mkCard = (bg: string): React.CSSProperties => ({
  background: bg,
  border: "1px solid rgba(120,90,50,0.08)",
  borderRadius: 20,
  boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
});

const DOCUMENTS = [
  { name: "Certificate of Incorporation", status: "verified", date: "Mar 15, 2026", size: "2.4 MB" },
  { name: "Proof of Registered Address", status: "verified", date: "Mar 15, 2026", size: "1.1 MB" },
  { name: "Director National ID (Stefan A.)", status: "verified", date: "Mar 16, 2026", size: "0.8 MB" },
  { name: "UBO Declaration Form", status: "verified", date: "Mar 17, 2026", size: "0.5 MB" },
  { name: "Latest Audited Financials", status: "pending", date: "Requested Mar 20", size: "-" },
];

const DOC_STATUS: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  verified: { icon: CheckCircle2, color: "#22C55E", label: "Verified" },
  pending: { icon: Clock, color: "#F59E0B", label: "Pending" },
  rejected: { icon: XCircle, color: "#ef4444", label: "Rejected" },
};

const TIMELINE = [
  { event: "KYB verification approved", date: "Mar 18, 2026", color: "#22C55E", icon: ShieldCheck },
  { event: "UBO declaration reviewed", date: "Mar 17, 2026", color: "#F97316", icon: CheckCircle2 },
  { event: "Director identity confirmed", date: "Mar 16, 2026", color: "#F97316", icon: CheckCircle2 },
  { event: "Documents submitted", date: "Mar 15, 2026", color: "#8b5cf6", icon: Upload },
  { event: "KYB application opened", date: "Mar 14, 2026", color: "#A09080", icon: FileText },
];

const RISK_FACTORS = [
  { label: "Jurisdiction", value: "United Kingdom", status: "clear" },
  { label: "PEP Screening", value: "No matches", status: "clear" },
  { label: "Sanctions Check", value: "No matches", status: "clear" },
  { label: "Adverse Media", value: "No flags", status: "clear" },
  { label: "UBO Complexity", value: "2 beneficial owners", status: "review" },
];

const item = {
  hidden: { opacity: 0, y: 16 },
  show: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.06, duration: 0.35 } }),
};

export function VerificationTab() {
  return (
    <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <div className="grid grid-cols-12 gap-5">
        <motion.div style={{ ...mkCard(CREAM), gridColumn: "span 5" }} className="col-span-5 p-6" custom={0} variants={item} initial="hidden" animate="show">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#A09080" }}>
                KYB Status
              </p>
              <div className="flex items-center gap-3">
                <h2 className="font-display font-bold" style={{ fontSize: 32, letterSpacing: "-0.02em", color: "#1C1917" }}>
                  Verified
                </h2>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.2)" }}>
                  Approved
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: "#A09080" }}>
                Verified Mar 18, 2026 · expires Mar 18, 2028
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <ShieldCheck className="w-7 h-7" style={{ color: "#22C55E" }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Entity Type", value: "Private Ltd" },
              { label: "Risk Tier", value: "Low" },
              { label: "Jurisdiction", value: "UK" },
            ].map((field) => (
              <div key={field.label} className="p-3 rounded-xl" style={{ background: "rgba(120,90,50,0.05)" }}>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#A09080" }}>
                  {field.label}
                </p>
                <p className="text-sm font-bold" style={{ color: "#1C1917" }}>
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ ...mkCard(WARM), gridColumn: "span 7" }} className="col-span-7 p-6" custom={1} variants={item} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#1C1917" }}>
              Risk Assessment
            </h3>
            <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E" }}>
              Low Risk
            </span>
          </div>
          <div className="space-y-2">
            {RISK_FACTORS.map((factor) => (
              <div key={factor.label} className="flex items-center justify-between h-10 px-3 rounded-xl" style={{ background: "rgba(120,90,50,0.05)" }}>
                <span className="text-sm" style={{ color: "#A09080" }}>
                  {factor.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "#1C1917" }}>
                    {factor.value}
                  </span>
                  {factor.status === "clear" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#22C55E" }} />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <motion.div style={{ ...mkCard(CREAM), gridColumn: "span 7" }} className="col-span-7 p-6" custom={2} variants={item} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold" style={{ fontSize: 18, color: "#1C1917" }}>
              Submitted Documents
            </h3>
            <Link href="/portal/uploads" className="text-xs font-semibold transition-colors hover:text-[#1C1917]" style={{ color: "#A09080" }}>
              Upload More {"->"}
            </Link>
          </div>
          <div className="space-y-1">
            {DOCUMENTS.map((document) => {
              const status = DOC_STATUS[document.status];
              return (
                <div
                  key={document.name}
                  className="flex items-center gap-3 h-14 px-3 rounded-xl transition-all"
                  style={{ borderLeft: "2px solid transparent" }}
                  onMouseEnter={(event) => {
                    (event.currentTarget as HTMLElement).style.borderLeftColor = "#F97316";
                    (event.currentTarget as HTMLElement).style.background = "rgba(120,90,50,0.04)";
                  }}
                  onMouseLeave={(event) => {
                    (event.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                    (event.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${status.color}14` }}>
                    <FileText className="w-4 h-4" style={{ color: status.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#1C1917" }}>
                      {document.name}
                    </p>
                    <p className="text-[10px]" style={{ color: "#A09080" }}>
                      {document.date} · {document.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0" style={{ background: `${status.color}14`, color: status.color }}>
                    <status.icon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div style={{ ...mkCard(BLUSH), gridColumn: "span 5" }} className="col-span-5 p-6" custom={3} variants={item} initial="hidden" animate="show">
          <h3 className="font-display font-bold mb-5" style={{ fontSize: 18, color: "#1C1917" }}>
            Verification Timeline
          </h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: "rgba(120,90,50,0.12)" }} />
            <div className="space-y-5">
              {TIMELINE.map((event, index) => (
                <div key={index} className="flex items-start gap-4 pl-9 relative">
                  <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${event.color}14`, border: `1.5px solid ${event.color}30` }}>
                    <event.icon className="w-3.5 h-3.5" style={{ color: event.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#1C1917" }}>
                      {event.event}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#A09080" }}>
                      {event.date}
                    </p>
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
