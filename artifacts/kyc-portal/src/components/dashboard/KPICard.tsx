import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
      className="relative flex flex-col items-center justify-center cursor-pointer group"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        height: 168,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.5), 0 0 20px ${color}30`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)";
      }}
    >
      {/* Top inset shine */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, opacity: 0.06, background: `radial-gradient(circle at center, ${color}, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Ring */}
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 8px ${color}50)` }}
        >
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
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
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Clash Display', 'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: value.length > 7 ? '12px' : '18px',
            color: '#f0f8f5',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            {value}
          </span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '9px',
            fontWeight: 500,
            color: '#6b8a82',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: 5,
          }}>
            {title}
          </span>
        </div>
      </div>

      {/* Trend badge */}
      {trend !== undefined && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          fontSize: '10px', fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 999,
          background: trend >= 0 ? 'rgba(0,212,170,0.15)' : 'rgba(255,90,90,0.15)',
          color: trend >= 0 ? '#00d4aa' : '#ff5a5a',
          border: `1px solid ${trend >= 0 ? 'rgba(0,212,170,0.25)' : 'rgba(255,90,90,0.25)'}`,
        }}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
}
