import { motion } from "framer-motion";
import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";

const TENANT_ID = "ten_4x8aK9mNpQ2r";

const FIELDS = [
  { label: "Tenant ID", value: TENANT_ID, mono: true, copyable: true },
  { label: "Environment", value: "Production", mono: false, copyable: false },
  { label: "Plan", value: "Growth", mono: false, copyable: false },
  { label: "Billing Balance", value: "₹0.00 / ₹250 credit", mono: true, copyable: false },
  { label: "Cycle resets", value: "Apr 1, 2026", mono: false, copyable: false },
];

export function AccountSummaryCard() {
  const [copied, setCopied] = useState(false);
  const [, setLocation] = useLocation();

  const handleCopy = async () => {
    let copiedOk = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(TENANT_ID);
        copiedOk = true;
      } else {
        const input = document.createElement("textarea");
        input.value = TENANT_ID;
        input.setAttribute("readonly", "");
        input.style.position = "absolute";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();
        copiedOk = document.execCommand("copy");
        document.body.removeChild(input);
      }
    } catch {
      copiedOk = false;
    }

    if (!copiedOk) {
      toast({
        title: "Copy failed",
        description: "Tenant ID could not be copied from this browser context.",
      });
      return;
    }

    setCopied(true);
    toast({
      title: "Tenant ID copied",
      description: TENANT_ID,
    });
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative account-panel"
      style={{
        background: "#FAF8F4",
        border: "1px solid rgba(120,90,50,0.08)",
        boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div
        className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(120,90,50,0.07)" }}>
        <div className="flex items-center gap-2 mb-1 parallax-layer-1">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "#22C55E", boxShadow: "0 0 6px rgba(34,197,94,0.4)" }}
          />
          <span
            className="status-badge-3d badge-active text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "#22C55E", boxShadow: "0 2px 8px rgba(34,197,94,0.35)", borderRadius: 999, padding: "2px 8px" }}
          >
            Active
          </span>
        </div>
        <p
          className="font-display font-bold parallax-layer-2"
          style={{ fontSize: 18, letterSpacing: "-0.01em", color: "#1C1917" }}
        >
          Anime Corp Ltd
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#A09080" }}>
          KYB Verified - Growth Plan
        </p>
      </div>

      <div className="px-5 py-4 space-y-3">
        {FIELDS.map((field) => (
          <div key={field.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#A09080" }}>
              {field.label}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="text-xs font-semibold"
                style={{
                  color: "#1C1917",
                  fontFamily: field.mono ? "'JetBrains Mono', monospace" : undefined,
                  fontSize: field.mono ? 11 : 12,
                }}
              >
                {field.value}
              </span>
              {field.copyable ? (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-0.5 rounded transition-colors"
                  style={{ color: copied ? "#F97316" : "#A09080", cursor: "pointer" }}
                  title="Copy Tenant ID"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#A09080" }}>
            Monthly Usage
          </span>
          <span className="text-[10px] font-mono" style={{ color: "#F97316" }}>
            1,124 / 5,000 jobs
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(120,90,50,0.1)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #F97316, #F59E0B)" }}
            initial={{ width: 0 }}
            animate={{ width: "22.5%" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "#A09080" }}>
          22% of plan limit - resets Apr 1
        </p>
      </div>

      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={() => setLocation("/portal/billing")}
          className="cta-3d flex items-center justify-center w-full h-8 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
          style={{
            background: "#F2EBE1",
            color: "#F97316",
            border: "1px solid rgba(249,115,22,0.2)",
            cursor: "pointer",
            position: "relative",
            zIndex: 2,
            pointerEvents: "auto",
          }}
        >
          View Billing & Plan {"->"}
        </button>
      </div>
    </motion.div>
  );
}
