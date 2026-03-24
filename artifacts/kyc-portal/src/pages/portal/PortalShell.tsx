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
  const [showScrollHint, setShowScrollHint] = useState(false);

  // After mount + on navigation: scroll to top, then decide if pill is needed
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    // Show pill only when content is taller than the container
    const needsScroll = el.scrollHeight > el.clientHeight + 60;
    setShowScrollHint(needsScroll);
  }, [location]);

  // Hide once user scrolls near the bottom; re-show if they scroll back up
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      setShowScrollHint(!atBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 380, behavior: "smooth" });
  };

  return (
    /*
     * Root must be height:100vh (not minHeight) so the flex children get a
     * constrained height, enabling overflowY:auto to actually scroll.
     */
    <div style={{
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      background: "#FAF8F4",
      fontFamily: "'Satoshi', sans-serif",
    }}>
      <Sidebar />

      {/* Column: header + scrollable body */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        height: "100%",
      }}>
        <MainHeader title={title} subtitle={subtitle} />

        {/* Row: main scroll area + optional right rail */}
        <div style={{
          flex: 1,
          display: "flex",
          minHeight: 0,     /* ← critical: lets flex children shrink below content height */
          overflow: "hidden",
        }}>
          {/* Scrollable main content */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              minWidth: 0,
              minHeight: 0,
              padding: "4px 28px 32px",
            }}
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
              flexShrink: 0,
              borderLeft: "1px solid rgba(120,90,50,0.08)",
              overflowY: "auto",
              background: "#FAF8F4",
            }}>
              <RightPanel />
            </div>
          )}
        </div>
      </div>

      {/* Scroll hint pill — fixed to viewport, always on top */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
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
