import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";
import { InternalOnlyBanner } from "@/components/shared/InternalOnlyBanner";

interface AdminLayoutProps {
  children: ReactNode;
}

// ── Multi-surface design token system ───────────────────────────
export const ADMIN_BG      = "#EFF5FB";
export const SURF_SUPPORT  = "#E3EDF5";
export const SURF_DEFAULT  = "#DCE8F2";
export const SURF_ANALYTIC = "#CFDDEA";
export const DARK_1        = "#0A0F18";
export const DARK_2        = "#101722";
export const TEXT          = "#0d1221";
export const MUTED         = "#7b8fad";

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
        <InternalOnlyBanner />
        {children}
      </main>
    </div>
  );
}
