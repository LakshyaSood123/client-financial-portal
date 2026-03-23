import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";

interface AdminLayoutProps {
  children: ReactNode;
}

// ── Multi-surface design token system ───────────────────────────
// Page background: lightest — cards layer on top with increasing depth
export const ADMIN_BG      = "#EFF5FB";   // page wash
export const SURF_SUPPORT  = "#E3EDF5";   // secondary info, lists, wrappers
export const SURF_DEFAULT  = "#DCE8F2";   // main content, KPI cards
export const SURF_ANALYTIC = "#CFDDEA";   // charts, heavy analytic emphasis
export const DARK_1        = "#0A0F18";   // primary dark anchor
export const DARK_2        = "#101722";   // secondary dark anchor
export const TEXT          = "#0d1221";
export const MUTED         = "#7b8fad";

// Shared light-card shell — border + shadow only, no bg (set per-surface)
export const cardShell: React.CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(13,18,33,0.07)",
  boxShadow: "0 1px 4px rgba(13,18,33,0.06)",
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen font-sans" style={{ background: ADMIN_BG }}>
      <AdminSidebar />
      <AdminTopBar />
      <main style={{ marginLeft: 72, paddingTop: 64 }}>
        {children}
      </main>
    </div>
  );
}
