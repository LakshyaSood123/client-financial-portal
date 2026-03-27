import { ReactNode, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  const [headerElevated, setHeaderElevated] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTop = 0;
    const needsScroll = element.scrollHeight > element.clientHeight + 60;
    setShowScrollHint(needsScroll);
  }, [location]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const onScroll = () => {
      const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 80;
      setShowScrollHint(!atBottom);
      setHeaderElevated(element.scrollTop > 20);
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 380, behavior: "smooth" });
  };

  return (
    <div
      className="portal-3d-root"
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        background: "transparent",
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      <Sidebar />

      <div
        className="portal-3d-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <MainHeader title={title} subtitle={subtitle} elevated={headerElevated} />

        <div
          style={{
            flex: 1,
            display: "flex",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location}
                initial={reduceMotion ? false : { opacity: 0, y: 10, rotateX: 2, transformPerspective: 800 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, rotateX: -1 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "center center", transformStyle: "preserve-3d" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {showRail && (
            <div
              style={{
                width: 320,
                flexShrink: 0,
                borderLeft: "1px solid rgba(120,90,50,0.08)",
                overflowY: "auto",
                background: "#FAF8F4",
              }}
            >
              <RightPanel />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
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
                border: "1px solid var(--nk-border)",
                background: "#FFFFFF",
                boxShadow: "var(--elev-2)",
                cursor: "pointer",
                color: "#B0A090",
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: "'Satoshi', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              <ChevronDown style={{ width: 14, height: 14 }} />
              More below
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
