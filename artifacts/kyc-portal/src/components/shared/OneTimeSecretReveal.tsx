import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Eye, X, AlertTriangle } from "lucide-react";

interface OneTimeSecretRevealProps {
  label: string;
  secretValue: string;
  onClose: () => void;
}

export function OneTimeSecretReveal({ label, secretValue, onClose }: OneTimeSecretRevealProps) {
  const [copied, setCopied]   = useState(false);
  const [acked, setAcked]     = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(secretValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(28,25,23,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "#FAF8F4", borderRadius: 20, padding: 32,
          width: "100%", maxWidth: 520,
          boxShadow: "0 20px 60px rgba(90,65,30,0.18)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #F97316, #F59E0B)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Eye style={{ width: 16, height: 16, color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", fontFamily: "'Satoshi', sans-serif" }}>
                {label}
              </div>
              <div style={{ fontSize: 12, color: "#A09080", fontFamily: "'Satoshi', sans-serif" }}>
                Shown once — copy it now
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#B0A090", padding: 4 }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Warning */}
        <div style={{
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)",
          borderRadius: 10, padding: "10px 14px", marginBottom: 18,
          display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <AlertTriangle style={{ width: 14, height: 14, color: "#F59E0B", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12.5, color: "#92400e", fontFamily: "'Satoshi', sans-serif", lineHeight: 1.5 }}>
            This secret will <strong>not</strong> be shown again after you close this dialog. Save it somewhere secure now.
          </span>
        </div>

        {/* Secret value */}
        <div style={{
          background: "#1C1917", borderRadius: 12, padding: "14px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, marginBottom: 20,
        }}>
          <code style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            color: "#F59E0B", letterSpacing: "0.02em", wordBreak: "break-all", flex: 1,
          }}>
            {secretValue}
          </code>
          <button
            onClick={copy}
            style={{
              background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.1)",
              border: "none", borderRadius: 8, cursor: "pointer",
              padding: "6px 10px", color: copied ? "#4ade80" : "#9ca3af",
              display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              transition: "all 0.15s ease",
            }}
          >
            {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 600 }}>
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>

        {/* Acknowledgement */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={acked}
            onChange={e => setAcked(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#F97316", cursor: "pointer" }}
          />
          <span style={{ fontSize: 13, color: "#6B5F54", fontFamily: "'Satoshi', sans-serif" }}>
            I have securely saved this key. I understand it cannot be retrieved again.
          </span>
        </label>

        <button
          onClick={onClose}
          disabled={!acked}
          style={{
            width: "100%", padding: "12px 0",
            borderRadius: 12, border: "none", cursor: acked ? "pointer" : "not-allowed",
            background: acked ? "linear-gradient(135deg, #F97316, #F59E0B)" : "rgba(180,160,120,0.2)",
            color: acked ? "#fff" : "#B0A090",
            fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 14,
            transition: "all 0.2s ease",
          }}
        >
          Done — close
        </button>
      </motion.div>
    </div>
  );
}

interface MaskedSecretProps {
  prefix: string;
  suffix?: string;
}

export function MaskedSecret({ prefix, suffix = "****" }: MaskedSecretProps) {
  return (
    <code style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
      color: "#6B5F54", background: "rgba(120,90,50,0.08)",
      padding: "2px 8px", borderRadius: 6,
    }}>
      {prefix}{suffix}
    </code>
  );
}
