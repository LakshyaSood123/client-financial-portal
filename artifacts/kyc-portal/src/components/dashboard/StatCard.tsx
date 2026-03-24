import { motion } from "framer-motion";
import { ComponentType, CSSProperties } from "react";

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: ComponentType<{ style?: CSSProperties }>;
  delay?: number;
}

export function StatCard({ label, value, suffix, delta, deltaPositive = true, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      style={{
        background: "#FAF8F4",
        border: "1px solid rgba(120,90,50,0.08)",
        borderRadius: 18,
        padding: "20px 22px",
        boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "default",
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 22px rgba(120,90,50,0.09)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(120,90,50,0.05)";
      }}
    >
      {/* Top: label + icon circle */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
        <p style={{
          fontSize: 12.5,
          fontWeight: 500,
          color: "#B0A090",
          fontFamily: "'Satoshi', sans-serif",
          lineHeight: 1.3,
          maxWidth: 120,
        }}>
          {label}
        </p>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #F97316, #F59E0B)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 10px rgba(249,115,22,0.25)",
        }}>
          <Icon style={{ width: 17, height: 17, color: "#ffffff" }} />
        </div>
      </div>

      {/* Metric */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 10 }}>
        <span style={{
          fontSize: 34,
          fontWeight: 800,
          color: "#1C1917",
          letterSpacing: "-0.025em",
          lineHeight: 1,
          fontFamily: "'Satoshi', sans-serif",
        }}>
          {value}
        </span>
        {suffix && (
          <span style={{ fontSize: 15, color: "#B0A090", fontFamily: "'Satoshi', sans-serif" }}>
            {suffix}
          </span>
        )}
      </div>

      {/* Delta */}
      {delta && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: deltaPositive ? "#22C55E" : "#f54a4a",
            fontFamily: "'Satoshi', sans-serif",
          }}>
            {deltaPositive ? "+" : "-"}{delta}
          </span>
        </div>
      )}
    </motion.div>
  );
}
