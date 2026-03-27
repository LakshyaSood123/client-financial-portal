import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { PortalShell } from "./PortalShell";
import { BackendPlaceholder } from "@/components/shared/BackendPlaceholder";
import { OneTimeSecretReveal, MaskedSecret } from "@/components/shared/OneTimeSecretReveal";

const MOCK_KEYS = [
  { id: "key_3xKp2", name: "Production",  prefix: "sk_live_3xKp2", status: "active",   created: "Feb 14 2026", lastUsed: "Mar 23 2026" },
  { id: "key_9mNq8", name: "Sandbox",     prefix: "sk_test_9mNq8", status: "active",   created: "Jan 5 2026",  lastUsed: "Mar 20 2026" },
  { id: "key_7bRp1", name: "Legacy CI",   prefix: "sk_live_7bRp1", status: "revoked",  created: "Oct 2 2025",  lastUsed: "Dec 31 2025" },
];

type SecretReveal = { label: string; value: string } | null;

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  active:  { color: "#22C55E", bg: "rgba(34,197,94,0.1)",   label: "Active"  },
  revoked: { color: "#f87171", bg: "rgba(248,113,113,0.1)", label: "Revoked" },
};

export default function PortalApiKeys() {
  const [reveal, setReveal]     = useState<SecretReveal>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName]   = useState("");

  const simulateCreate = () => {
    if (!newName.trim()) return;
    const fakeSecret = `sk_live_${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 14)}`;
    setCreating(false);
    setNewName("");
    setReveal({ label: `New API key — "${newName}"`, value: fakeSecret });
  };

  const simulateRotate = (name: string, prefix: string) => {
    const fakeSecret = `sk_live_${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 14)}`;
    setReveal({ label: `Rotated key — "${name}"`, value: fakeSecret });
  };

  return (
    <PortalShell
      title="API Keys"
      subtitle="Manage your API keys — create, rotate, and revoke access credentials"
      showRail={false}
    >
      <BackendPlaceholder
        type="mock"
        description="Displaying illustrative keys. Live self-service requires portal API key endpoints. Create/rotate actions are simulated."
      />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1C1917", fontFamily: "'Satoshi', sans-serif" }}>
            Your API Keys
          </h2>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#A09080", fontFamily: "'Satoshi', sans-serif" }}>
            {MOCK_KEYS.filter(k => k.status === "active").length} active · {MOCK_KEYS.length} total
          </p>
        </div>
        <button
          className="cta-3d btn-primary"
          onClick={() => setCreating(true)}
          style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
            borderRadius: 12, border: "none", cursor: "pointer",
            color: "#fff", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 13,
          }}
        >
          <Plus style={{ width: 15, height: 15 }} /> Create New Key
        </button>
      </div>

      {/* Create new key form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 16 }}
          >
            <div style={{
              background: "#F7F3EE", borderRadius: 14, padding: 20,
              border: "1px solid rgba(249,115,22,0.18)",
            }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1C1917", marginBottom: 12, fontFamily: "'Satoshi', sans-serif" }}>
                New API Key
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Key name (e.g. Production, CI/CD)"
                  style={{
                    flex: 1, padding: "9px 14px", borderRadius: 10,
                    border: "1px solid rgba(120,90,50,0.15)", background: "#FAF8F4",
                    fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#1C1917", outline: "none",
                  }}
                />
                <button className="cta-3d btn-primary" onClick={simulateCreate} style={{
                  padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                  color: "#fff", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 13,
                }}>
                  Generate
                </button>
                <button onClick={() => setCreating(false)} style={{
                  padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(120,90,50,0.15)",
                  background: "transparent", color: "#A09080", cursor: "pointer",
                  fontFamily: "'Satoshi', sans-serif", fontSize: 13,
                }}>
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keys table */}
      <div style={{ background: "#F7F3EE", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(120,90,50,0.07)" }}>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "180px 1fr 120px 120px 120px 100px",
          padding: "10px 20px", borderBottom: "1px solid rgba(120,90,50,0.07)",
        }}>
          {["Name", "Key ID / Prefix", "Status", "Created", "Last Used", "Actions"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#B0A090", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Satoshi', sans-serif" }}>
              {h}
            </span>
          ))}
        </div>

        {MOCK_KEYS.map((key, i) => {
          const st = STATUS_STYLE[key.status] ?? STATUS_STYLE.revoked;
          return (
            <motion.div
              key={key.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="data-row-3d"
              style={{
                display: "grid", gridTemplateColumns: "180px 1fr 120px 120px 120px 100px",
                padding: "14px 20px", alignItems: "center",
                borderBottom: i < MOCK_KEYS.length - 1 ? "1px solid rgba(120,90,50,0.06)" : "none",
                background: "#FAF8F4",
                animationDelay: `${i * 60}ms`,
              }}
            >
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1C1917", fontFamily: "'Satoshi', sans-serif" }}>
                {key.name}
              </span>
              <MaskedSecret prefix={key.prefix} suffix="••••••••" />
              <div className={`status-badge-3d ${key.status === "active" ? "badge-active" : "badge-failed"}`} style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: st.bg, borderRadius: 20, padding: "3px 10px", width: "fit-content", boxShadow: `0 2px 8px ${st.color}59`,
              }}>
                {key.status === "active"
                  ? <CheckCircle2 style={{ width: 11, height: 11, color: st.color }} />
                  : <XCircle style={{ width: 11, height: 11, color: st.color }} />}
                <span style={{ fontSize: 11.5, fontWeight: 700, color: st.color, fontFamily: "'Satoshi', sans-serif" }}>
                  {st.label}
                </span>
              </div>
              <span style={{ fontSize: 12.5, color: "#8B7355", fontFamily: "'JetBrains Mono', monospace" }}>{key.created}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Clock style={{ width: 11, height: 11, color: "#B0A090" }} />
                <span style={{ fontSize: 12.5, color: "#8B7355", fontFamily: "'JetBrains Mono', monospace" }}>{key.lastUsed}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {key.status === "active" && (
                  <button
                    className="cta-3d"
                    onClick={() => simulateRotate(key.name, key.prefix)}
                    title="Rotate"
                    style={{ background: "rgba(249,115,22,0.1)", border: "none", borderRadius: 8, cursor: "pointer", padding: "6px 8px", color: "#F97316" }}
                  >
                    <RotateCcw style={{ width: 13, height: 13 }} />
                  </button>
                )}
                <button
                  className="cta-3d"
                  title="Revoke"
                  style={{ background: "rgba(248,113,113,0.1)", border: "none", borderRadius: 8, cursor: "pointer", padding: "6px 8px", color: "#f87171" }}
                >
                  <Trash2 style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: "#C4B5A5", marginTop: 14, fontFamily: "'Satoshi', sans-serif" }}>
        Secret values are shown only once at creation/rotation. Subsequent views show prefix and masked suffix only.
      </p>

      {/* One-time reveal modal */}
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
