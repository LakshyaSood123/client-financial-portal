import { useEffect, useState } from "react";

interface KPICardProps {
  title: string;
  value: string;
  percent: number;
  color: string;
  trend?: number;
  delay?: number;
}

export function KPICard({ title, value, percent, color, trend, delay = 0 }: KPICardProps) {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const offset = animated
    ? circumference - (percent / 100) * circumference
    : circumference;

  return (
    <div
      className="relative flex flex-col items-center justify-center cursor-pointer"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(79,124,255,0.08)",
        borderRadius: 20,
        boxShadow: "0 1px 8px rgba(79,124,255,0.06)",
        height: 168,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px rgba(79,124,255,0.1), 0 0 20px ${color}20`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 8px rgba(79,124,255,0.06)";
      }}
    >
      {/* Subtle color glow */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20,
        opacity: 0.05,
        background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Ring */}
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 6px ${color}40)` }}
        >
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(79,124,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: `stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
            }}
          />
        </svg>

        {/* Center text */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 800,
            fontSize: value.length > 7 ? "12px" : "18px",
            color: "#111827",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            {value}
          </span>
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "9px",
            fontWeight: 600,
            color: "#94A3B8",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: 5,
          }}>
            {title}
          </span>
        </div>
      </div>

      {/* Trend badge */}
      {trend !== undefined && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          fontSize: "10px", fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 999,
          background: trend >= 0 ? "rgba(34,197,94,0.1)" : "rgba(245,74,74,0.1)",
          color: trend >= 0 ? "#22C55E" : "#f54a4a",
          border: `1px solid ${trend >= 0 ? "rgba(34,197,94,0.2)" : "rgba(245,74,74,0.2)"}`,
        }}>
          {trend >= 0 ? "+" : ""}{trend}%
        </div>
      )}
    </div>
  );
}
