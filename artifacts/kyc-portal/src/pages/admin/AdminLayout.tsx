import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";

interface AdminLayoutProps {
  children: ReactNode;
}

// Soft pastel blue-gray page background — cards sit tonally darker
export const ADMIN_BG  = "#d6e3f0";
export const CARD_BG   = "#c3d3e6";   // embedded tonal cards
export const DARK_SURF = "#0e1219";   // near-black accent surfaces
export const TEXT      = "#0d1221";
export const MUTED     = "#7b8fad";

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
