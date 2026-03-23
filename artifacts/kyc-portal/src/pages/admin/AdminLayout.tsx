import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ background: "#e8eef7" }}>
      <AdminSidebar />
      <AdminTopBar />
      <main className="relative z-10" style={{ marginLeft: 72, paddingTop: 64 }}>
        {children}
      </main>
    </div>
  );
}
