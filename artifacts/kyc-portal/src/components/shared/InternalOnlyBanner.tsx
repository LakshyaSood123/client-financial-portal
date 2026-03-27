import { ShieldAlert } from "lucide-react";

interface InternalOnlyBannerProps {
  bffRequired?: boolean;
}

export function InternalOnlyBanner({ bffRequired = true }: InternalOnlyBannerProps) {
  return (
    <div
      className="admin-system-strip"
      style={{
        padding: "9px 24px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <ShieldAlert style={{ width: 15, height: 15, color: "#d97706", flexShrink: 0 }} />
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#92400e", fontFamily: "'Satoshi', sans-serif" }}>
        Internal Use Only — Admin Console
      </span>
      {bffRequired && (
        <>
          <span style={{ fontSize: 12.5, color: "#b45309", margin: "0 2px" }}>·</span>
          <span style={{ fontSize: 12.5, color: "#b45309", fontFamily: "'Satoshi', sans-serif" }}>
            Sensitive actions require Admin BFF authorization. Do not share this interface with tenants.
          </span>
        </>
      )}
    </div>
  );
}
