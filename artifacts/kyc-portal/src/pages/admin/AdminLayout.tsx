import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ background: "#f5f3ef" }}>
      {/* Subtle yellow blob — top right, same as portal */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{
          width: "45%", height: "65%",
          top: "-10%", right: "-5%",
          background: "radial-gradient(ellipse 60% 70% at 100% 0%, #f9e987 0%, #f5d855 30%, transparent 65%)",
          opacity: 0.4,
        }} />
      </div>

      <AdminSidebar />
      <AdminTopBar />

      <main className="relative z-10" style={{ marginLeft: 72, paddingTop: 64 }}>
        {children}
      </main>
    </div>
  );
}
