import { ReactNode, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainHeader } from "@/components/layout/MainHeader";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { ChevronDown } from "lucide-react";

interface PortalShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showRail?: boolean;
}

export function PortalShell({ children, title, subtitle, showRail = true }: PortalShellProps) {
  const [location] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Reset to visible + scroll to top on every page navigation
  useEffect(() => {
    setShowScrollHint(true);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [location]);

  // Hide once user scrolls near the bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
        setShowScrollHint(false);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 360, behavior: "smooth" });
  };

  return (
    <div style={{
      background: "#FAF8F4",
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Satoshi', sans-serif",
    }}>
      <div style={{ width: "100%", background: "#FAF8F4", display: "flex", minHeight: "100vh" }}>
        <Sidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <MainHeader title={title} subtitle={subtitle} />

          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Main scrollable content */}
            <div
              ref={scrollRef}
              style={{ flex: 1, overflowY: "auto", padding: "4px 28px 32px", minWidth: 0 }}
            >
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

            {/* Right rail */}
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

      {/* ── Scroll hint pill — fixed so it's always visible regardless of stacking ── */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            key="scroll-hint"
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              bottom: 28,
              left: showRail
                ? `calc(220px + (100vw - 220px - 320px) / 2)`
                : `calc(220px + (100vw - 220px) / 2)`,
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
          >
            <button
              onClick={scrollDown}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 18px 8px 13px",
                borderRadius: 99,
                border: "1.5px solid rgba(120,90,50,0.18)",
                background: "#FAF8F4",
                boxShadow: "0 4px 20px rgba(120,90,50,0.15)",
                cursor: "pointer",
                color: "#B0A090",
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: "'Satoshi', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <ChevronDown style={{ width: 14, height: 14 }} />
              </motion.span>
              More below
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
