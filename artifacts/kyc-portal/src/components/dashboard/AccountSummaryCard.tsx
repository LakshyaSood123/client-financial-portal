import { motion } from "framer-motion";
import { Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { useState } from "react";

const FIELDS = [
  { label: "Tenant ID", value: "ten_4x8aK9mNpQ2r", mono: true, copyable: true },
  { label: "Environment", value: "Production", mono: false, copyable: false },
  { label: "Plan", value: "Growth", mono: false, copyable: false },
  { label: "Billing Balance", value: "$0.00 / $250 credit", mono: true, copyable: false },
  { label: "Resets", value: "Apr 1, 2026", mono: false, copyable: false },
];

export function AccountSummaryCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("ten_4x8aK9mNpQ2r");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #0d3830 0%, #072620 40%, #050c0e 100%)",
        border: "1px solid rgba(0,212,170,0.2)",
        boxShadow: "0 0 40px rgba(0,212,170,0.08), 0 8px 32px rgba(0,0,0,0.5)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Ambient glow top-right */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 80% 20%, rgba(0,212,170,0.12) 0%, transparent 70%)",
      }} />

      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: "#a8ff3e", boxShadow: "0 0 8px rgba(168,255,62,0.6)" }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#a8ff3e" }}>Active</span>
            </div>
            <p className="font-display font-bold text-foreground" style={{ fontSize: 18, letterSpacing: "-0.01em" }}>
              Acme Corp Ltd
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6b8a82" }}>KYB Verified · Growth Plan</p>
          </div>
          <button className="p-1.5 rounded-lg text-[#6b8a82] hover:text-[#00d4aa] transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="px-5 py-4 space-y-3">
        {FIELDS.map((field, i) => (
          <div key={field.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#6b8a82" }}>{field.label}</span>
            <div className="flex items-center gap-1.5">
              <span
                className="text-xs font-semibold"
                style={{
                  color: "#f0f8f5",
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
                  style={{ color: copied ? "#a8ff3e" : "#3d5a52" }}
                >
                  {copied
                    ? <CheckCircle2 className="w-3 h-3" />
                    : <Copy className="w-3 h-3" />
                  }
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Usage bar */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#6b8a82" }}>Monthly Usage</span>
          <span className="text-[10px] font-mono" style={{ color: "#00d4aa" }}>1,124 / 5,000 jobs</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #00d4aa, #a8ff3e)", boxShadow: "0 0 8px rgba(0,212,170,0.5)" }}
            initial={{ width: 0 }}
            animate={{ width: "22.5%" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "#3d5a52" }}>22% of plan limit · resets Apr 1</p>
      </div>
    </motion.div>
  );
}
