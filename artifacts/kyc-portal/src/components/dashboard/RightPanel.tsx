import { MouseEvent } from "react";
import { AccountSummaryCard } from "./AccountSummaryCard";
import {
  ChevronRight,
  FileText,
  Key,
  ShieldCheck,
  Upload,
  Webhook,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Link, useLocation } from "wouter";

const ACTIVITY = [
  { id: 1, label: "Webhook retry completed", detail: "billing.paid replay delivered successfully", time: "Mar 23", icon: Webhook, color: "#F97316", bg: "rgba(249,115,22,0.1)" },
  { id: 2, label: "Production key rotated", detail: "prod_primary moved to new secret version", time: "Mar 22", icon: Key, color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
  { id: 3, label: "Compliance hold reviewed", detail: "No active hold remains on the tenant record", time: "Mar 21", icon: ShieldCheck, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  { id: 4, label: "Financial document requested", detail: "Audited financials upload still outstanding", time: "Mar 20", icon: Upload, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  { id: 5, label: "Jobs report exported", detail: "Cycle-to-date volume summary exported as CSV", time: "Mar 19", icon: FileText, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
];

const ONBOARDING = [
  { label: "Tenant created and contact verified", done: true },
  { label: "KYB package approved", done: true },
  { label: "Initial balance funded", done: true },
  { label: "Sandbox key and uploads tested", done: true },
  { label: "Webhook endpoint verified", done: false },
  { label: "Production approval checklist completed", done: false },
];

export function RightPanel() {
  const done = ONBOARDING.filter((step) => step.done).length;
  const total = ONBOARDING.length;
  const [, setLocation] = useLocation();

  const handlePanelMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--panel-x", `${x}`);
    event.currentTarget.style.setProperty("--panel-y", `${y}`);
  };

  return (
    <div
      className="flex flex-col account-panel"
      style={{
        background: "#FAF8F4",
        borderLeft: "1px solid rgba(120,90,50,0.08)",
        minHeight: "100%",
      }}
      onMouseMove={handlePanelMove}
      onMouseLeave={(event) => {
        event.currentTarget.style.setProperty("--panel-x", "0.5");
        event.currentTarget.style.setProperty("--panel-y", "0.5");
      }}
    >
      <div className="flex flex-col gap-6 p-6">
        <section className="parallax-layer-1">
          <div className="flex items-center justify-between mb-4 parallax-layer-1">
            <h2 className="font-display font-bold" style={{ fontSize: 18, color: "#1C1917" }}>
              Account Summary
            </h2>
          </div>
          <AccountSummaryCard />
        </section>

        <section className="parallax-layer-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold" style={{ fontSize: 18, color: "#1C1917" }}>
              Recent Activity
            </h2>
            <button
              type="button"
              onClick={() => setLocation("/portal/audit-logs")}
              className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-[#1C1917]"
              style={{ color: "#F97316" }}
            >
              Audit Logs <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            {ACTIVITY.map((item) => (
              <div
                key={item.id}
                className="data-row-3d flex items-center gap-3 h-14 px-3 rounded-xl cursor-pointer transition-all duration-150"
                style={{ borderLeft: "2px solid transparent" }}
                onMouseEnter={(event) => {
                  (event.currentTarget as HTMLElement).style.background = "rgba(120,90,50,0.04)";
                  (event.currentTarget as HTMLElement).style.borderLeftColor = "#F97316";
                }}
                onMouseLeave={(event) => {
                  (event.currentTarget as HTMLElement).style.background = "";
                  (event.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#1C1917" }}>
                    {item.label}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "#A09080" }}>
                    {item.detail}
                  </p>
                </div>
                <span className="text-[10px] flex-shrink-0 font-mono" style={{ color: "#A09080" }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl p-4 parallax-layer-2"
          style={{
            background: "#EBE1D5",
            border: "1px solid rgba(120,90,50,0.08)",
            boxShadow: "0 1px 4px rgba(120,90,50,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold" style={{ fontSize: 16, color: "#1C1917" }}>
              Go-Live Checklist
            </h2>
            <span className="text-xs font-mono" style={{ color: "#A09080" }}>
              {done}/{total} complete
            </span>
          </div>

          <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(120,90,50,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #F97316, #F59E0B)",
                width: `${(done / total) * 100}%`,
                transition: "width 0.2s ease-out",
              }}
            />
          </div>

          <div className="space-y-2.5">
            {ONBOARDING.map((step, index) => (
              <div key={index} className="data-row-3d flex items-center gap-3" style={{ animationDelay: `${index * 60}ms` }}>
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#22C55E" }} />
                ) : (
                  <Circle className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(120,90,50,0.25)" }} />
                )}
                <span
                  className="text-xs"
                  style={{
                    color: step.done ? "#A09080" : "#57493C",
                    textDecoration: step.done ? "line-through" : undefined,
                  }}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
