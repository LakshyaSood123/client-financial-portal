import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  LayoutDashboard,
  Key,
  BriefcaseBusiness,
  Upload,
  Webhook,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/portal", label: "Overview", icon: LayoutDashboard },
  { path: "/portal/apikeys", label: "API Keys", icon: Key },
  { path: "/portal/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { path: "/portal/uploads", label: "Uploads", icon: Upload },
  { path: "/portal/webhooks", label: "Webhooks", icon: Webhook },
  { path: "/portal/compliance", label: "Compliance", icon: ShieldCheck },
];

const UTIL_ITEMS = [
  { path: "/portal/settings", label: "Settings", icon: Settings },
  { label: "Help Center", icon: HelpCircle },
  { label: "Sign Out", icon: LogOut },
];

const MOBILE_W = 44;
const COLLAPSED_W = 56;
const EXPANDED_W = 220;
const PANEL = "#F2EAE1";
const DIM = "#A09080";
const ON = "#1C1917";
const ACTIVE = "#F97316";
const HOVER = "rgba(120,90,50,0.08)";

export function Sidebar() {
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("portal-sidebar-collapsed") !== "false";
    } catch {
      return true;
    }
  });

  const persist = (value: boolean) => {
    setCollapsed(value);
    try {
      localStorage.setItem("portal-sidebar-collapsed", String(value));
    } catch {}
  };

  const isActive = (path: string) =>
    path === "/portal"
      ? location === "/portal" || location === "/"
      : location.startsWith(path);

  const collapsedState = isMobile ? true : collapsed;
  const width = isMobile ? MOBILE_W : collapsedState ? COLLAPSED_W : EXPANDED_W;

  return (
    <motion.div
      className="sidebar sidebar-depth"
      animate={{ width }}
      initial={false}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{
        flexShrink: 0,
        background: PANEL,
        borderRadius: "0 28px 28px 0",
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? "18px 6px 16px" : collapsedState ? "24px 10px 20px" : "24px 16px 20px",
        overflow: "visible",
        position: "relative",
        zIndex: 30,
        isolation: "isolate",
        boxShadow: "4px 0 24px rgba(0,0,0,0.08), 8px 0 48px rgba(249,115,22,0.04)",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsedState ? "center" : "space-between",
          marginBottom: 28,
          minHeight: 30,
        }}
      >
        <Link
          href="/portal"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: isMobile ? 24 : 30,
              height: isMobile ? 24 : 30,
              borderRadius: 10,
              flexShrink: 0,
              background: "linear-gradient(135deg, #F97316, #F59E0B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 900, fontSize: isMobile ? 12 : 14, letterSpacing: "-0.02em" }}>N</span>
          </div>
          <AnimatePresence>
            {!collapsedState && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#1C1917",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                Nexus<span style={{ color: "#F97316" }}>KYC</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <AnimatePresence>
          {!collapsedState && !isMobile && (
            <motion.button
              className="cta-3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => persist(true)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#C4B5A5",
                padding: 4,
                borderRadius: 6,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
              }}
              title="Collapse sidebar"
            >
              <ChevronLeft style={{ width: 15, height: 15 }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {collapsedState && !isMobile && (
          <motion.button
            className="cta-3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => persist(false)}
            style={{
              position: "absolute",
              top: 38,
              right: -12,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: PANEL,
              border: "1px solid rgba(120,90,50,0.18)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C4B5A5",
              zIndex: 10,
              boxShadow: "0 4px 14px rgba(90,65,30,0.12)",
            }}
            title="Expand sidebar"
          >
            <ChevronRight style={{ width: 11, height: 11 }} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!collapsedState && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#C4B5A5",
              marginBottom: 6,
              paddingLeft: 10,
              margin: "0 0 6px",
            }}
          >
            Menu
          </motion.p>
        )}
      </AnimatePresence>

      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop: collapsedState ? 0 : undefined,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <div key={item.path} style={{ position: "relative" }} title={collapsedState ? item.label : undefined}>
              {active && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background: ACTIVE,
                  }}
                />
              )}
              <Link href={item.path} style={{ textDecoration: "none" }}>
                <div
                  className={`nav-item nav-depth-item ${active ? "active nav-depth-active" : ""}`}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsedState ? "center" : "flex-start",
                    gap: 10,
                    padding: isMobile ? "10px 0" : collapsedState ? "10px 0" : "10px 14px",
                    borderRadius: 16,
                    color: active ? "#ffffff" : DIM,
                    cursor: "pointer",
                    transition: "color 0.15s ease, background 0.15s ease, transform 0.18s ease, box-shadow 0.18s ease",
                    boxShadow: active ? "inset 0 0 0 1px rgba(255,255,255,0.08), 0 10px 24px rgba(249,115,22,0.12)" : "none",
                    transformStyle: "preserve-3d",
                  }}
                  >
                    <span className="nav-depth-accent" />
                  <item.icon style={{ width: isMobile ? 15 : 16, height: isMobile ? 15 : 16, flexShrink: 0 }} />
                  <AnimatePresence>
                    {!collapsedState && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.16 }}
                        style={{
                          fontSize: 13.5,
                          fontWeight: active ? 700 : 500,
                          fontFamily: "'Satoshi', sans-serif",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 10,
          borderTop: "1px solid rgba(120,90,50,0.1)",
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {UTIL_ITEMS.map((item) => {
          const content = (
            <>
              <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsedState && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.16 }}
                    style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          );

          if (item.path) {
            const active = isActive(item.path);
            return (
              <Link key={item.label} href={item.path} style={{ textDecoration: "none" }}>
                <div
                  className={`nav-item nav-depth-item ${active ? "active nav-depth-active" : ""}`}
                  title={collapsedState ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsedState ? "center" : "flex-start",
                    gap: 10,
                    padding: isMobile ? "10px 0" : collapsedState ? "10px 0" : "10px 14px",
                    borderRadius: 16,
                    color: active ? "#1C1917" : DIM,
                    cursor: "pointer",
                    width: "100%",
                    background: active ? "rgba(120,90,50,0.08)" : "transparent",
                    transition: "all 0.15s ease, transform 0.18s ease, box-shadow 0.18s ease",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <span className="nav-depth-accent" />
                  {content}
                </div>
              </Link>
            );
          }

          return (
            <button
              className="nav-item nav-depth-item"
              key={item.label}
              title={collapsedState ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsedState ? "center" : "flex-start",
                gap: 10,
                padding: isMobile ? "10px 0" : collapsedState ? "10px 0" : "10px 14px",
                borderRadius: 16,
                border: "none",
                background: "transparent",
                color: DIM,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                fontFamily: "'Satoshi', sans-serif",
                transition: "all 0.15s ease, transform 0.18s ease, box-shadow 0.18s ease",
                transformStyle: "preserve-3d",
              }}
            >
              <span className="nav-depth-accent" />
              {content}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
