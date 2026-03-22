import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen text-foreground font-sans relative overflow-x-hidden" style={{ background: "#050c0e" }}>
      {/* Atmospheric gradients — red/amber tinted for admin */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#050c0e" }} />
        <div
          className="absolute"
          style={{
            width: "80%", height: "60%",
            top: "-15%", left: "-10%",
            background: "radial-gradient(ellipse 80% 60% at 10% 20%, #1a0a0a 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "60%", height: "50%",
            bottom: "-10%", right: "-10%",
            background: "radial-gradient(ellipse 60% 50% at 85% 70%, #12080a 0%, transparent 55%)",
          }}
        />
      </div>

      <AdminSidebar />
      <AdminTopBar />

      <main className="relative z-10" style={{ marginLeft: 72 }}>
        {children}
      </main>
    </div>
  );
}
