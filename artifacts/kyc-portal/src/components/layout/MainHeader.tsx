import { motion } from "framer-motion";
import { Search, Bell, Settings } from "lucide-react";

export function MainHeader() {
  return (
    <motion.div
      style={{
        padding: "28px 32px 22px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(120,90,50,0.07)",
        flexShrink: 0,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left: Greeting */}
      <div>
        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#1C1917",
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
          fontFamily: "'Satoshi', sans-serif",
          margin: 0,
        }}>
          Account Overview
        </h1>
        <p style={{
          fontSize: 13,
          color: "#B0A090",
          marginTop: 4,
          fontFamily: "'Satoshi', sans-serif",
        }}>
          KYB progress, integration health, billing status, and recent activity
        </p>
      </div>

      {/* Right: Search + Icons + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginTop: 2 }}>

        {/* Pill search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#F0E9E0",
          borderRadius: 999,
          padding: "9px 18px",
          border: "1px solid rgba(120,90,50,0.1)",
          width: 210,
        }}>
          <Search style={{ width: 15, height: 15, color: "#B0A090", flexShrink: 0 }} />
          <input
            placeholder="Search..."
            style={{
              background: "transparent", border: "none", outline: "none",
              fontSize: 13, color: "#1C1917", width: "100%",
              fontFamily: "'Satoshi', sans-serif",
            }}
          />
        </div>

        {/* Bell */}
        <button style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#F0E9E0",
          border: "1px solid rgba(120,90,50,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", flexShrink: 0,
          color: "#A09080",
        }}>
          <Bell style={{ width: 16, height: 16 }} />
          <span style={{
            position: "absolute", top: 6, right: 7,
            width: 7, height: 7, borderRadius: "50%",
            background: "#f54a4a",
            border: "1.5px solid #FAF8F4",
          }} />
        </button>

        {/* Settings */}
        <button style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#F0E9E0",
          border: "1px solid rgba(120,90,50,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
          color: "#A09080",
        }}>
          <Settings style={{ width: 16, height: 16 }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(135deg, #F97316, #F59E0B)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 15,
          fontFamily: "'Satoshi', sans-serif",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
          cursor: "pointer",
        }}>
          C
        </div>
      </div>
    </motion.div>
  );
}
