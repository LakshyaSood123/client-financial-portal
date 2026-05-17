import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  RotateCcw,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
} from "lucide-react";
import { PortalShell } from "./PortalShell";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import {
  OneTimeSecretReveal,
  MaskedSecret,
} from "@/components/shared/OneTimeSecretReveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const MOCK_KEYS = [
  {
    id: "key_3xKp2",
    name: "Production",
    prefix: "sk_live_3xKp2",
    status: "active",
    created: "Feb 14, 2026",
    lastUsed: "Mar 23, 2026",
  },
  {
    id: "key_9mNq8",
    name: "Sandbox",
    prefix: "sk_test_9mNq8",
    status: "active",
    created: "Jan 5, 2026",
    lastUsed: "Mar 20, 2026",
  },
  {
    id: "key_7bRp1",
    name: "Legacy CI",
    prefix: "sk_live_7bRp1",
    status: "revoked",
    created: "Oct 2, 2025",
    lastUsed: "Dec 31, 2025",
  },
] as const;

type SecretReveal = { label: string; value: string } | null;

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: "#22C55E", bg: "rgba(34,197,94,0.1)", label: "Active" },
  revoked: { color: "#f87171", bg: "rgba(248,113,113,0.1)", label: "Revoked" },
};

function MobileKeyCard({
  apiKey,
  copiedKey,
  onCopy,
  onRotate,
}: {
  apiKey: (typeof MOCK_KEYS)[number];
  copiedKey: string | null;
  onCopy: (prefix: string) => void;
  onRotate: (name: string, prefix: string) => void;
}) {
  const status = STATUS_STYLE[apiKey.status];
  const isRevoked = apiKey.status === "revoked";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isRevoked ? 0.7 : 1, y: 0 }}
      style={{
        background: "#F7F3EE",
        borderRadius: 16,
        border: "1px solid rgba(120,90,50,0.08)",
        overflow: "hidden",
        opacity: isRevoked ? 0.7 : 1,
      }}
    >
      <div style={{ padding: "16px 16px 14px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <strong
            style={{
              fontSize: 16,
              color: "#1C1917",
              fontFamily: "'Satoshi', sans-serif",
              textDecoration: isRevoked ? "line-through" : undefined,
            }}
          >
            {apiKey.name}
          </strong>
          <div
            className={`status-badge-3d ${
              apiKey.status === "active" ? "badge-active" : "badge-failed"
            }`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: status.bg,
              borderRadius: 20,
              padding: "4px 10px",
              boxShadow: `0 2px 8px ${status.color}59`,
            }}
          >
            {apiKey.status === "active" ? (
              <CheckCircle2 style={{ width: 11, height: 11, color: status.color }} />
            ) : (
              <XCircle style={{ width: 11, height: 11, color: status.color }} />
            )}
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: status.color,
                fontFamily: "'Satoshi', sans-serif",
              }}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 12,
            background: "#FAF8F4",
            border: "1px solid rgba(120,90,50,0.08)",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#1C1917",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
            }}
          >
            [{apiKey.prefix}••••••••]
          </span>
          <button
            type="button"
            onClick={() => onCopy(apiKey.prefix)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid rgba(120,90,50,0.08)",
              background: "#FFFFFF",
              color: copiedKey === apiKey.prefix ? "#22C55E" : "#A09080",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            title={copiedKey === apiKey.prefix ? "Copied!" : "Copy key prefix"}
          >
            {copiedKey === apiKey.prefix ? (
              <CheckCircle2 style={{ width: 14, height: 14 }} />
            ) : (
              <Copy style={{ width: 14, height: 14 }} />
            )}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            borderTop: "1px solid rgba(120,90,50,0.08)",
          }}
        >
          <div
            style={{
              padding: "12px 10px 10px 0",
              borderRight: "1px solid rgba(120,90,50,0.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 10.5,
                color: "#B0A090",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              Created
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#1C1917",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {apiKey.created}
            </p>
          </div>
          <div style={{ padding: "12px 0 10px 10px" }}>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 10.5,
                color: "#B0A090",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              Last Used
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#1C1917",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {apiKey.lastUsed}
            </p>
          </div>
        </div>
      </div>

      {!isRevoked && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            borderTop: "1px solid rgba(120,90,50,0.08)",
          }}
        >
          <button
            type="button"
            onClick={() => onRotate(apiKey.name, apiKey.prefix)}
            style={{
              height: 48,
              border: "none",
              background: "transparent",
              color: "#F97316",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            ↻ Rotate key
          </button>
          <div style={{ background: "rgba(120,90,50,0.08)" }} />
          <button
            type="button"
            style={{
              height: 48,
              border: "none",
              background: "transparent",
              color: "#f87171",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            Revoke
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function PortalApiKeys() {
  const mobile = useMediaQuery("(max-width: 767px)");
  const [reveal, setReveal] = useState<SecretReveal>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeKeys = MOCK_KEYS.filter((key) => key.status === "active");
  const revokedKeys = MOCK_KEYS.filter((key) => key.status === "revoked");

  const simulateCreate = () => {
    if (!newName.trim()) return;
    const fakeSecret = `sk_live_${Math.random().toString(36).slice(2, 14)}${Math.random()
      .toString(36)
      .slice(2, 14)}`;
    setCreating(false);
    setNewName("");
    setReveal({ label: `New API key - "${newName}"`, value: fakeSecret });
  };

  const simulateRotate = (name: string, prefix: string) => {
    const fakeSecret = `sk_live_${Math.random().toString(36).slice(2, 14)}${Math.random()
      .toString(36)
      .slice(2, 14)}`;
    setReveal({ label: `Rotated key - "${name}"`, value: fakeSecret });
  };

  const handleCopy = async (prefix: string) => {
    try {
      await navigator.clipboard.writeText(prefix);
      setCopiedKey(prefix);
      window.setTimeout(() => setCopiedKey(null), 1000);
    } catch {
      setCopiedKey(null);
    }
  };

  return (
    <PortalShell
      title="API Keys"
      subtitle="Manage your API keys - create, rotate, and revoke access credentials"
      showRail={false}
    >
      {!mobile && (
        <BackendPlaceholder
          type="mock"
          description="Displaying illustrative keys. Live self-service requires portal API key endpoints. Create/rotate actions are simulated."
        />
      )}

      <div
        style={{
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          alignItems: mobile ? "stretch" : "center",
          justifyContent: "space-between",
          gap: mobile ? 14 : 0,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 800,
              color: "#1C1917",
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            Your API Keys
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22C55E",
                flexShrink: 0,
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 12.5,
                color: "#A09080",
                fontFamily: "'Satoshi', sans-serif",
              }}
            >
              {activeKeys.length} active · {MOCK_KEYS.length} total
            </p>
          </div>
        </div>

        <button
          className="cta-3d btn-primary"
          onClick={() => setCreating(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 18px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            width: mobile ? "100%" : "fit-content",
            justifyContent: "center",
          }}
        >
          <Plus style={{ width: 15, height: 15 }} /> Create New Key
        </button>
      </div>

      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 16 }}
          >
            <div
              style={{
                background: "#F7F3EE",
                borderRadius: 14,
                padding: 20,
                border: "1px solid rgba(249,115,22,0.18)",
              }}
            >
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "#1C1917",
                  marginBottom: 12,
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                New API Key
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: mobile ? "column" : "row",
                  gap: 10,
                }}
              >
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Key name (e.g. Production, CI/CD)"
                  style={{
                    flex: 1,
                    padding: "9px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(120,90,50,0.15)",
                    background: "#FAF8F4",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 13.5,
                    color: "#1C1917",
                    outline: "none",
                  }}
                />
                <button
                  className="cta-3d btn-primary"
                  onClick={simulateCreate}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    width: mobile ? "100%" : "fit-content",
                  }}
                >
                  Generate
                </button>
                <button
                  onClick={() => setCreating(false)}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(120,90,50,0.15)",
                    background: "transparent",
                    color: "#A09080",
                    cursor: "pointer",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 13,
                    width: mobile ? "100%" : "fit-content",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <section>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "#B0A090",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "'Satoshi', sans-serif",
              }}
            >
              Active Keys
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeKeys.map((key) => (
                <MobileKeyCard
                  key={key.id}
                  apiKey={key}
                  copiedKey={copiedKey}
                  onCopy={handleCopy}
                  onRotate={simulateRotate}
                />
              ))}
            </div>
          </section>

          <section>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "#B0A090",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "'Satoshi', sans-serif",
              }}
            >
              Revoked
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {revokedKeys.map((key) => (
                <MobileKeyCard
                  key={key.id}
                  apiKey={key}
                  copiedKey={copiedKey}
                  onCopy={handleCopy}
                  onRotate={simulateRotate}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div
          style={{
            background: "#F7F3EE",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(120,90,50,0.07)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr 120px 120px 120px 100px",
              padding: "10px 20px",
              borderBottom: "1px solid rgba(120,90,50,0.07)",
              minWidth: 760,
            }}
          >
            {["Name", "Key ID / Prefix", "Status", "Created", "Last Used", "Actions"].map(
              (header) => (
                <span
                  key={header}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#B0A090",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  {header}
                </span>
              ),
            )}
          </div>

          {MOCK_KEYS.map((key, index) => {
            const status = STATUS_STYLE[key.status] ?? STATUS_STYLE.revoked;
            return (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className="data-row-3d"
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr 120px 120px 120px 100px",
                  padding: "14px 20px",
                  alignItems: "center",
                  borderBottom:
                    index < MOCK_KEYS.length - 1
                      ? "1px solid rgba(120,90,50,0.06)"
                      : "none",
                  background: "#FAF8F4",
                  animationDelay: `${index * 60}ms`,
                  minWidth: 760,
                }}
              >
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#1C1917",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  {key.name}
                </span>
                <MaskedSecret prefix={key.prefix} suffix="••••••••" />
                <div
                  className={`status-badge-3d ${
                    key.status === "active" ? "badge-active" : "badge-failed"
                  }`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: status.bg,
                    borderRadius: 20,
                    padding: "3px 10px",
                    width: "fit-content",
                    boxShadow: `0 2px 8px ${status.color}59`,
                  }}
                >
                  {key.status === "active" ? (
                    <CheckCircle2
                      style={{ width: 11, height: 11, color: status.color }}
                    />
                  ) : (
                    <XCircle style={{ width: 11, height: 11, color: status.color }} />
                  )}
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: status.color,
                      fontFamily: "'Satoshi', sans-serif",
                    }}
                  >
                    {status.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12.5,
                    color: "#8B7355",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {key.created}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock style={{ width: 11, height: 11, color: "#B0A090" }} />
                  <span
                    style={{
                      fontSize: 12.5,
                      color: "#8B7355",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {key.lastUsed}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {key.status === "active" && (
                    <button
                      className="cta-3d"
                      onClick={() => simulateRotate(key.name, key.prefix)}
                      title="Rotate"
                      style={{
                        background: "rgba(249,115,22,0.1)",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        padding: "6px 8px",
                        color: "#F97316",
                      }}
                    >
                      <RotateCcw style={{ width: 13, height: 13 }} />
                    </button>
                  )}
                  <button
                    className="cta-3d"
                    title="Revoke"
                    style={{
                      background: "rgba(248,113,113,0.1)",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      padding: "6px 8px",
                      color: "#f87171",
                    }}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <p
        style={{
          fontSize: 12,
          color: "#C4B5A5",
          marginTop: 14,
          fontFamily: "'Satoshi', sans-serif",
        }}
      >
        Secret values are shown only once at creation/rotation. Subsequent views
        show prefix and masked suffix only.
      </p>

      <AnimatePresence>
        {reveal && (
          <OneTimeSecretReveal
            label={reveal.label}
            secretValue={reveal.value}
            onClose={() => setReveal(null)}
          />
        )}
      </AnimatePresence>
    </PortalShell>
  );
}
