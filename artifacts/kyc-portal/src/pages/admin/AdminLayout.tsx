import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ background: "#edf1f9" }}>
      {/* Subtle navy-tinted vignette — top left only, echoes the sidebar */}
      <div
        className="fixed top-0 left-0 w-[420px] h-[320px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 0% 0%, rgba(28,43,74,0.07) 0%, transparent 70%)",
        }}
      />
      <AdminSidebar />
      <AdminTopBar />
      <main className="relative z-10" style={{ marginLeft: 72, paddingTop: 64 }}>
        {children}
      </main>
    </div>
  );
}
