import { useEffect, useState } from "react";
import { TiltCard } from "@/components/shared/TiltCard";

interface KPICardProps {
  title: string;
  value: string;
  percent: number;
  color: string;
  delay?: number;
}

export function KPICard({ title, value, percent, color, delay = 0 }: KPICardProps) {
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
    <TiltCard
      className="relative flex flex-col items-center justify-center cursor-pointer"
      style={{
        background: "#FAF8F4",
        border: "1px solid rgba(120,90,50,0.08)",
        borderRadius: 20,
        boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
        height: 168,
        overflow: "visible",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      strength={5}
    >
      {/* Subtle color glow */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20,
        opacity: 0.07,
        background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Ring */}
      <div className="status-ring-wrap" style={{ position: "relative", width: size, height: size, animationDelay: `${delay + 0.1}s`, overflow: "visible" }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 5px ${color}35)` }}
        >
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(120,90,50,0.1)"
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
            color: "#1C1917",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            {value}
          </span>
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "9px",
            fontWeight: 600,
            color: "#A09080",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: 5,
          }}>
            {title}
          </span>
        </div>
      </div>
    </TiltCard>
  );
}
