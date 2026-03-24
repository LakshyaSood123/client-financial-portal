import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface MaskedValueProps {
  value: string;
  visibleChars?: number;
  prefix?: string;
  copyable?: boolean;
  mono?: boolean;
}

export function MaskedValue({ value, visibleChars = 6, prefix = "", copyable = false, mono = true }: MaskedValueProps) {
  const [copied, setCopied] = useState(false);
  const shown   = value.slice(0, visibleChars);
  const masked  = "•".repeat(Math.max(8, value.length - visibleChars));
  const display = prefix + shown + masked;

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        fontFamily: mono ? "'JetBrains Mono', monospace" : "'Satoshi', sans-serif",
        fontSize: 12.5, color: "#6B5F54",
        background: "rgba(120,90,50,0.08)",
        padding: "2px 8px", borderRadius: 6,
        letterSpacing: mono ? "0.02em" : undefined,
      }}>
        {display}
      </span>
      {copyable && (
        <button
          onClick={copy}
          title="Copy"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: copied ? "#22C55E" : "#B0A090", padding: 2,
            display: "flex", alignItems: "center",
          }}
        >
          {copied
            ? <Check style={{ width: 13, height: 13 }} />
            : <Copy style={{ width: 13, height: 13 }} />}
        </button>
      )}
    </span>
  );
}

export function RedactedId({ id, label = "ID" }: { id: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const short = id.slice(0, 12) + "…";

  const copy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#B0A090", fontFamily: "'Satoshi', sans-serif" }}>
        {label}
      </span>
      <code style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
        color: "#6B5F54", background: "rgba(120,90,50,0.08)",
        padding: "1px 7px", borderRadius: 5,
      }}>
        {short}
      </code>
      <button
        onClick={copy}
        style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#22C55E" : "#C4B5A5", padding: 1 }}
      >
        {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
      </button>
    </span>
  );
}
