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

  // Check on mount + scroll whether there's hidden content below
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 32;
      setShowScrollHint(el.scrollHeight > el.clientHeight + 32 && !atBottom);
    };

    // Delay so children have rendered
    const timer = setTimeout(check, 300);
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [location]);

  // Re-check whenever route changes (new page may be taller/shorter)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 32;
      setShowScrollHint(el.scrollHeight > el.clientHeight + 32 && !atBottom);
    }, 350);
    return () => clearTimeout(timer);
  }, [location]);

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 320, behavior: "smooth" });
  };

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
            {/* Main scrollable area — wrapped in relative container so hint can pin to bottom */}
            <div style={{ flex: 1, position: "relative", minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: "auto", padding: "4px 28px 32px" }}
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

              {/* Scroll hint — pinned to the visible bottom of the scroll wrapper */}
              <AnimatePresence>
                {showScrollHint && (
                  <motion.div
                    key="scroll-hint"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      position: "absolute",
                      bottom: 24,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 20,
                      pointerEvents: "none",
                    }}
                  >
                    {/* Fade gradient behind pill */}
                    <div style={{
                      position: "absolute",
                      bottom: -24,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 200,
                      height: 80,
                      background: "linear-gradient(to top, rgba(250,248,244,0.95), transparent)",
                      borderRadius: 8,
                      pointerEvents: "none",
                    }} />
                    <button
                      onClick={scrollDown}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 16px 7px 12px",
                        borderRadius: 99,
                        border: "1px solid rgba(120,90,50,0.16)",
                        background: "rgba(250,248,244,0.95)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 18px rgba(120,90,50,0.13)",
                        cursor: "pointer",
                        color: "#A09080",
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "'Satoshi', sans-serif",
                        pointerEvents: "auto",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                        style={{ display: "flex" }}
                      >
                        <ChevronDown style={{ width: 14, height: 14 }} />
                      </motion.div>
                      More below
                    </button>
                  </motion.div>
                )}
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
