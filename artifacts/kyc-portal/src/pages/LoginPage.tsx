import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, AlertTriangle, Terminal } from "lucide-react";
import { isCognitoConfigured, config } from "@/config/runtime";
import { generateVerifier, generateChallenge, buildCognitoAuthUrl } from "@/auth/session";

export default function LoginPage() {
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    setConfigured(isCognitoConfigured());
  }, []);

  const handleLogin = async () => {
    if (!configured) return;
    setLoading(true);
    try {
      const verifier   = generateVerifier();
      const challenge  = await generateChallenge(verifier);
      const redirectUri = config.cognitoRedirect || `${window.location.origin}/login/callback`;
      sessionStorage.setItem("pkce_verifier", verifier);
      const url = buildCognitoAuthUrl(config.cognitoDomain, config.cognitoClientId, redirectUri, challenge);
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#E9E7E2",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Satoshi', sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 460 }}
      >
        {/* Card */}
        <div style={{
          background: "#FAF8F4", borderRadius: 24,
          padding: 40, boxShadow: "0 4px 32px rgba(90,65,30,0.12)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #F97316, #F59E0B)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>N</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#1C1917", letterSpacing: "-0.02em" }}>
              Nexus<span style={{ color: "#F97316" }}>KYC</span>
            </span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.025em", margin: "0 0 8px" }}>
            Sign in to your portal
          </h1>
          <p style={{ fontSize: 14, color: "#A09080", margin: "0 0 32px", lineHeight: 1.5 }}>
            Authentication is handled securely via your identity provider. No credentials are stored in this application.
          </p>

          {configured ? (
            <>
              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: "100%", padding: "14px 0",
                  borderRadius: 14, border: "none",
                  background: "linear-gradient(135deg, #F97316, #F59E0B)",
                  color: "#fff", fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  opacity: loading ? 0.7 : 1, transition: "opacity 0.2s ease",
                }}
              >
                <Shield style={{ width: 16, height: 16 }} />
                {loading ? "Redirecting…" : "Continue with NexusKYC"}
                {!loading && <ArrowRight style={{ width: 16, height: 16 }} />}
              </button>

              <p style={{ fontSize: 12, color: "#C4B5A5", marginTop: 16, textAlign: "center", lineHeight: 1.5 }}>
                You'll be redirected to your organization's identity provider. Authorization Code + PKCE flow.
              </p>
            </>
          ) : (
            <ConfigurationRequired />
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#B0A090", marginTop: 20 }}>
          NexusKYC Portal · Internal use for authorized tenants only
        </p>
      </motion.div>
    </div>
  );
}

function ConfigurationRequired() {
  return (
    <div>
      <div style={{
        background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
        borderRadius: 14, padding: 20, marginBottom: 20,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
          <AlertTriangle style={{ width: 16, height: 16, color: "#F59E0B", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>
              Cognito Configuration Required
            </div>
            <div style={{ fontSize: 13, color: "#b45309", lineHeight: 1.5 }}>
              This portal authenticates via Cognito Hosted UI (Authorization Code + PKCE). The following environment variables must be set to enable login:
            </div>
          </div>
        </div>

        <div style={{ background: "#1C1917", borderRadius: 10, padding: "12px 16px" }}>
          {[
            "VITE_COGNITO_DOMAIN",
            "VITE_COGNITO_CLIENT_ID",
            "VITE_COGNITO_REDIRECT",
          ].map(v => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Terminal style={{ width: 12, height: 12, color: "#F59E0B", flexShrink: 0 }} />
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#F59E0B" }}>
                {v}
              </code>
            </div>
          ))}
        </div>
      </div>

      <button
        disabled
        style={{
          width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
          background: "rgba(180,160,120,0.2)", color: "#B0A090",
          fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 15,
          cursor: "not-allowed",
        }}
      >
        Sign in (configuration required)
      </button>
    </div>
  );
}
