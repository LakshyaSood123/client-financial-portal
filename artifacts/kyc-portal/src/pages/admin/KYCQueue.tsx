import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "./AdminLayout";
import {
  CheckCircle2, XCircle, Eye, Filter, Download,
  Building2, User, FileText, Clock, ChevronDown,
} from "lucide-react";

const card = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 16,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
} as React.CSSProperties;

const QUEUE_ITEMS = [
  {
    id: "KYC-2846", name: "David Chen", type: "Individual", email: "david.chen@email.com",
    submitted: "2 hours ago", docs: 3, risk: "Medium", country: "Singapore",
    flags: ["PEP Check Required"],
  },
  {
    id: "KYC-2843", name: "GlobalPay Inc", type: "Business", email: "compliance@globalpay.io",
    submitted: "4 hours ago", docs: 7, risk: "Medium", country: "UK",
    flags: ["Director Verification Needed"],
  },
  {
    id: "KYC-2840", name: "Maria Santos", type: "Individual", email: "m.santos@mail.com",
    submitted: "6 hours ago", docs: 2, risk: "Low", country: "Brazil",
    flags: [],
  },
  {
    id: "KYC-2838", name: "Vertex Capital", type: "Business", email: "kyc@vertexcap.com",
    submitted: "8 hours ago", docs: 9, risk: "High", country: "Cayman Islands",
    flags: ["High Risk Jurisdiction", "Complex Structure"],
  },
  {
    id: "KYC-2835", name: "Priya Sharma", type: "Individual", email: "priya.s@outlook.com",
    submitted: "10 hours ago", docs: 3, risk: "Low", country: "India",
    flags: [],
  },
  {
    id: "KYC-2831", name: "NexGen Logistics", type: "Business", email: "admin@nexgen.co",
    submitted: "12 hours ago", docs: 6, risk: "Medium", country: "UAE",
    flags: ["UBO Verification Pending"],
  },
  {
    id: "KYC-2828", name: "Thomas Baker", type: "Individual", email: "t.baker@gmail.com",
    submitted: "14 hours ago", docs: 3, risk: "Low", country: "USA",
    flags: [],
  },
];

const RISK_STYLES: Record<string, { color: string; bg: string }> = {
  Low: { color: "#00b896", bg: "rgba(0,184,150,0.1)" },
  Medium: { color: "#d97706", bg: "rgba(217,119,6,0.1)" },
  High: { color: "#f54a4a", bg: "rgba(245,74,74,0.1)" },
};

export default function KYCQueue() {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});

  const filtered = filter === "All" ? QUEUE_ITEMS
    : QUEUE_ITEMS.filter(i => i.risk === filter || i.type === filter);

  const approve = (id: string) => setDecisions(d => ({ ...d, [id]: "approved" }));
  const reject = (id: string) => setDecisions(d => ({ ...d, [id]: "rejected" }));

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="font-display" style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#1a1a1a" }}>
              KYC Review Queue
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "#8a8a8a" }}>
              {QUEUE_ITEMS.length} applications awaiting review — prioritised by risk
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.09)", color: "#8a8a8a" }}
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.09)", color: "#8a8a8a" }}
            >
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {["All", "Individual", "Business", "High", "Medium", "Low"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={filter === f ? {
                background: "#1a1a1a",
                color: "#ffffff",
              } : {
                background: "#ffffff",
                color: "#8a8a8a",
                border: "1px solid rgba(0,0,0,0.09)",
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Queue */}
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const decision = decisions[item.id];
            const riskStyle = RISK_STYLES[item.risk];
            const isExpanded = expanded === item.id;

            return (
              <motion.div
                key={item.id}
                style={{ ...card, opacity: decision ? 0.55 : 1 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: decision ? 0.55 : 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
              >
                {/* Main row */}
                <div className="flex items-center px-5 h-16 gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.type === "Business" ? "rgba(139,111,244,0.12)" : "rgba(0,184,150,0.1)" }}
                  >
                    {item.type === "Business"
                      ? <Building2 className="w-5 h-5" style={{ color: "#8b6ff4" }} />
                      : <User className="w-5 h-5" style={{ color: "#00b896" }} />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold" style={{ color: "#1a1a1a" }}>{item.name}</p>
                      <span className="font-mono text-[10px]" style={{ color: "#c0c0c0" }}>{item.id}</span>
                      {item.flags.length > 0 && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(217,119,6,0.1)", color: "#d97706" }}>
                          {item.flags.length} flag{item.flags.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "#8a8a8a" }}>
                      {item.email} · {item.country}
                    </p>
                  </div>

                  <div className="hidden lg:flex items-center gap-6 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8a8a8a" }}>
                      <FileText className="w-3.5 h-3.5" />
                      {item.docs} docs
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8a8a8a" }}>
                      <Clock className="w-3.5 h-3.5" />
                      {item.submitted}
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: riskStyle.bg, color: riskStyle.color }}
                    >
                      {item.risk} Risk
                    </div>
                  </div>

                  {decision ? (
                    <div
                      className="px-4 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        background: decision === "approved" ? "rgba(22,163,74,0.1)" : "rgba(245,74,74,0.1)",
                        color: decision === "approved" ? "#16a34a" : "#f54a4a",
                      }}
                    >
                      {decision === "approved" ? "✓ Approved" : "✗ Rejected"}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ color: "#8a8a8a", background: "rgba(0,0,0,0.04)" }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reject(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                        style={{ background: "rgba(245,74,74,0.1)", color: "#f54a4a", border: "1px solid rgba(245,74,74,0.2)" }}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => approve(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                        style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setExpanded(isExpanded ? null : item.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ color: "#8a8a8a" }}
                  >
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>
                </div>

                {/* Expanded detail panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mx-5 mb-4 p-4 rounded-2xl grid grid-cols-3 gap-6"
                        style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.06)" }}
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8a8a8a" }}>Submitted Documents</p>
                          <div className="space-y-1.5">
                            {["National ID", "Proof of Address", item.type === "Business" ? "Company Registration" : null]
                              .filter(Boolean).slice(0, item.docs).map((doc, di) => (
                              <div key={di} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#16a34a" }} />
                                <span style={{ color: "#1a1a1a" }}>{doc}</span>
                              </div>
                            ))}
                            {item.docs > 3 && (
                              <p className="text-xs" style={{ color: "#8a8a8a" }}>+{item.docs - 3} more documents</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8a8a8a" }}>Risk Flags</p>
                          {item.flags.length === 0 ? (
                            <p className="text-sm font-medium" style={{ color: "#00b896" }}>✓ No flags raised</p>
                          ) : (
                            <div className="space-y-1.5">
                              {item.flags.map((flag, fi) => (
                                <div key={fi} className="flex items-center gap-2 text-xs">
                                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#d97706" }} />
                                  <span style={{ color: "#d97706" }}>{flag}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8a8a8a" }}>Details</p>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                              <span style={{ color: "#8a8a8a" }}>Country</span>
                              <span style={{ color: "#1a1a1a" }}>{item.country}</span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{ color: "#8a8a8a" }}>Type</span>
                              <span style={{ color: "#1a1a1a" }}>{item.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{ color: "#8a8a8a" }}>Risk</span>
                              <span style={{ color: RISK_STYLES[item.risk].color }}>{item.risk}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
