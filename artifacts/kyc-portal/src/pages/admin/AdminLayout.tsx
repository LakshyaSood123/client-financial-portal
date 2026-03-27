import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "wouter";
import {
  ADMIN_SIDEBAR_COLLAPSED_W,
  ADMIN_SIDEBAR_EVENT,
  ADMIN_SIDEBAR_EXPANDED_W,
  AdminSidebar,
  getAdminSidebarExpanded,
} from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";
import { InternalOnlyBanner } from "@/components/shared/InternalOnlyBanner";

interface AdminLayoutProps {
  children: ReactNode;
}

// ── Multi-surface design token system ───────────────────────────
export const ADMIN_BG      = "#F3F7FC";
export const SURF_SUPPORT  = "#EEF4FB";
export const SURF_DEFAULT  = "#F8FBFF";
export const SURF_ANALYTIC = "#EEF4FB";
export const DARK_1        = "#06101E";
export const DARK_2        = "#091426";
export const TEXT          = "#0F172A";
export const MUTED         = "#7C8EA5";

export const cardShell: React.CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(13,18,33,0.07)",
  boxShadow: "0 1px 4px rgba(13,18,33,0.06)",
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => getAdminSidebarExpanded());
  const [location] = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleSidebarChange = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      setSidebarExpanded(Boolean(customEvent.detail));
    };

    window.addEventListener(ADMIN_SIDEBAR_EVENT, handleSidebarChange as EventListener);
    return () => window.removeEventListener(ADMIN_SIDEBAR_EVENT, handleSidebarChange as EventListener);
  }, []);

  const sidebarWidth = sidebarExpanded ? ADMIN_SIDEBAR_EXPANDED_W : ADMIN_SIDEBAR_COLLAPSED_W;

  return (
    <div className="min-h-screen font-sans admin-shell-layer" style={{ background: ADMIN_BG }}>
      <AdminSidebar />
      <AdminTopBar sidebarWidth={sidebarWidth} />
      <main
        style={{
          marginLeft: sidebarWidth,
          paddingTop: 64,
          transition: "margin-left 0.18s ease-out",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <InternalOnlyBanner />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location}
            initial={reduceMotion ? false : { opacity: 0, y: 8, rotateX: 1.5 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4, rotateX: -1 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: "top center", display: "block" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
