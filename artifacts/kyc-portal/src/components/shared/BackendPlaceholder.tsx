import { Server } from "lucide-react";

interface BackendPlaceholderProps {
  title?: string;
  description?: string;
  type?: "pending" | "decision" | "mock";
  compact?: boolean;
}

const typeConfig = {
  pending:  { bg: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.18)", dot: "#F97316", label: "Backend Integration Pending" },
  decision: { bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.18)", dot: "#8b5cf6", label: "Decision Needed"              },
  mock:     { bg: "rgba(180,160,120,0.06)", border: "rgba(180,160,120,0.18)", dot: "#B4A078", label: "Displaying Mock Data"         },
} as const;

export function BackendPlaceholder({
  title,
  description = "This section requires a live backend connection. Showing illustrative placeholder data.",
  type = "mock",
  compact = false,
}: BackendPlaceholderProps) {
  const t = typeConfig[type];
  return (
    <div style={{
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: compact ? 10 : 14,
      padding: compact ? "8px 14px" : "12px 18px",
      display: "flex",
      alignItems: compact ? "center" : "flex-start",
      gap: 10,
      marginBottom: compact ? 0 : 20,
    }}>
      {!compact && (
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: t.border, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Server style={{ width: 15, height: 15, color: t.dot }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot, flexShrink: 0, display: "block" }} />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: t.dot, letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "'Satoshi', sans-serif" }}>
            {title ?? t.label}
          </span>
        </div>
        {!compact && (
          <p style={{ fontSize: 12.5, color: "#A09080", margin: "3px 0 0", fontFamily: "'Satoshi', sans-serif", lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
