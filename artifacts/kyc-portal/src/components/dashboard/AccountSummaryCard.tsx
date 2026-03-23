import { motion } from "framer-motion";
import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const TENANT_ID = "ten_4x8aK9mNpQ2r";

const FIELDS = [
  { label: "Tenant ID",       value: TENANT_ID,            mono: true,  copyable: true },
  { label: "Environment",     value: "Production",          mono: false, copyable: false },
  { label: "Plan",            value: "Growth",              mono: false, copyable: false },
  { label: "Billing Balance", value: "$0.00 / $250 credit", mono: true,  copyable: false },
  { label: "Cycle resets",    value: "Apr 1, 2026",         mono: false, copyable: false },
];

export function AccountSummaryCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(TENANT_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Yellow accent glow top-right */}
      <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 80% 20%, rgba(239,201,45,0.15) 0%, transparent 70%)",
      }} />

      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#00b896", boxShadow: "0 0 6px rgba(0,184,150,0.6)" }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#00b896" }}>Active</span>
        </div>
        <p className="font-display font-bold" style={{ fontSize: 18, letterSpacing: "-0.01em", color: "#1a1a1a" }}>
          Acme Corp Ltd
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#8a8a8a" }}>KYB Verified · Growth Plan</p>
      </div>

      {/* Fields */}
      <div className="px-5 py-4 space-y-3">
        {FIELDS.map((field) => (
          <div key={field.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#8a8a8a" }}>{field.label}</span>
            <div className="flex items-center gap-1.5">
              <span
                className="text-xs font-semibold"
                style={{
                  color: "#1a1a1a",
                  fontFamily: field.mono ? "'JetBrains Mono', monospace" : undefined,
                  fontSize: field.mono ? 11 : 12,
                }}
              >
                {field.value}
              </span>
              {field.copyable && (
                <button
                  onClick={handleCopy}
                  className="p-0.5 rounded transition-colors"
                  style={{ color: copied ? "#efc92d" : "#b5b2ab" }}
                  title="Copy Tenant ID"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Usage bar */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#8a8a8a" }}>Monthly Usage</span>
          <span className="text-[10px] font-mono" style={{ color: "#00b896" }}>1,124 / 5,000 jobs</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #00b896, #efc92d)" }}
            initial={{ width: 0 }}
            animate={{ width: "22.5%" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "#b5b2ab" }}>22% of plan limit · resets Apr 1</p>
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-4">
        <Link
          href="/billing"
          className="flex items-center justify-center w-full h-8 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
          style={{ background: "rgba(239,201,45,0.12)", color: "#c9a200", border: "1px solid rgba(239,201,45,0.25)" }}
        >
          View Billing & Plan →
        </Link>
      </div>
    </motion.div>
  );
}
