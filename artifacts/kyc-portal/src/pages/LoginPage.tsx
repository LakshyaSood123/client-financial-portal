import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, LockKeyhole, Settings2, Shield } from "lucide-react";
import { isCognitoConfigured, config } from "@/config/runtime";
import { generateVerifier, generateChallenge, buildCognitoAuthUrl } from "@/auth/session";

export default function LoginPage() {
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setConfigured(isCognitoConfigured());
  }, []);

  const handleLogin = async () => {
    if (!configured) return;
    setLoading(true);
    try {
      const verifier = generateVerifier();
      const challenge = await generateChallenge(verifier);
      const redirectUri = config.cognitoRedirect || `${window.location.origin}/login/callback`;
      sessionStorage.setItem("pkce_verifier", verifier);
      const url = buildCognitoAuthUrl(config.cognitoDomain, config.cognitoClientId, redirectUri, challenge);
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#E9E7E2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        <div
          style={{
            background: "#FAF8F4",
            borderRadius: 24,
            padding: 40,
            boxShadow: "0 4px 32px rgba(90,65,30,0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #F97316, #F59E0B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
            Access is managed through your organization&apos;s authentication setup. This screen stays provider-neutral until the live auth contract is finalized.
          </p>

          {configured ? <ConfiguredState loading={loading} onLogin={handleLogin} /> : <ConfigurationPending />}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#B0A090", marginTop: 20 }}>
          NexusKYC Portal · Internal use for authorized tenants only
        </p>
      </motion.div>
    </div>
  );
}

function ConfiguredState({ loading, onLogin }: { loading: boolean; onLogin: () => void }) {
  return (
    <>
      <button
        onClick={onLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 14,
          border: "none",
          background: "linear-gradient(135deg, #F97316, #F59E0B)",
          color: "#fff",
          fontFamily: "'Satoshi', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <Shield style={{ width: 16, height: 16 }} />
        {loading ? "Redirecting..." : "Continue with SSO"}
        {!loading && <ArrowRight style={{ width: 16, height: 16 }} />}
      </button>

      <p style={{ fontSize: 12, color: "#C4B5A5", marginTop: 16, textAlign: "center", lineHeight: 1.5 }}>
        You&apos;ll be redirected to the configured identity provider to complete sign-in.
      </p>
    </>
  );
}

function ConfigurationPending() {
  return (
    <div>
      <div
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.25)",
          borderRadius: 14,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
          <Settings2 style={{ width: 16, height: 16, color: "#F59E0B", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Authentication configuration pending</div>
            <div style={{ fontSize: 13, color: "#b45309", lineHeight: 1.5 }}>
              This preview environment does not have a live tenant sign-in flow configured yet. You can still review the portal using the local demo routes below.
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.55)",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 12.5,
            color: "#8B5E14",
            lineHeight: 1.6,
          }}
        >
          Frontend note: the live auth contract is still unresolved between identity-provider-based login and the embedded token/API-key-oriented docs.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/portal" style={{ textDecoration: "none" }}>
          <span
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #F97316, #F59E0B)",
              color: "#fff",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <LockKeyhole style={{ width: 16, height: 16 }} />
            Open demo portal
            <ArrowRight style={{ width: 16, height: 16 }} />
          </span>
        </Link>

        <Link href="/onboarding" style={{ textDecoration: "none" }}>
          <span
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 14,
              border: "1px solid rgba(120,90,50,0.15)",
              background: "transparent",
              color: "#6B5F54",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            Review onboarding preview
          </span>
        </Link>
      </div>
    </div>
  );
}
