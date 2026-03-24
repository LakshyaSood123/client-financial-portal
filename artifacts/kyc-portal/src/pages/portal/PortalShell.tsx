import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainHeader } from "@/components/layout/MainHeader";
import { RightPanel } from "@/components/dashboard/RightPanel";

interface PortalShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showRail?: boolean;
}

export function PortalShell({ children, title, subtitle, showRail = true }: PortalShellProps) {
  const [location] = useLocation();

  return (
    <div style={{
      background: "#FAF8F4",
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Satoshi', sans-serif",
    }}>
      <div style={{
        width: "100%",
        background: "#FAF8F4",
        display: "flex",
        minHeight: "100vh",
      }}>
        <Sidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <MainHeader title={title} subtitle={subtitle} />

          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 28px 32px", minWidth: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>

            {showRail && (
              <div style={{
                width: 320,
                borderLeft: "1px solid rgba(120,90,50,0.08)",
                overflowY: "auto",
                flexShrink: 0,
                background: "#FAF8F4",
              }}>
                <RightPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
