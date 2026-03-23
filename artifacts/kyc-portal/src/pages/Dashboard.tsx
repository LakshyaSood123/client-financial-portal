import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { VerificationTab } from "@/components/dashboard/tabs/VerificationTab";
import { IntegrationsTab } from "@/components/dashboard/tabs/IntegrationsTab";
import { BillingTab } from "@/components/dashboard/tabs/BillingTab";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview",      label: "Overview" },
  { id: "verification",  label: "Verification" },
  { id: "integrations",  label: "Integrations" },
  { id: "billing",       label: "Billing" },
] as const;

type TabId = typeof TABS[number]["id"];

const TAB_SUBTITLES: Record<TabId, string> = {
  overview:     "KYB progress, integration health, billing status, and recent activity",
  verification: "KYB verification state, submitted documents, risk assessment, and history",
  integrations: "API keys, webhook endpoints, delivery health, and developer activity",
  billing:      "Current balance, plan details, usage this cycle, and billing history",
};

const slideVariants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function TabPanel({ id, activeId }: { id: TabId; activeId: TabId }) {
  if (id !== activeId) return null;
  return (
    <motion.div
      key={id}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {id === "overview"     && <OverviewTab />}
      {id === "verification" && <VerificationTab />}
      {id === "integrations" && <IntegrationsTab />}
      {id === "billing"      && <BillingTab />}
    </motion.div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen text-foreground font-sans relative overflow-x-hidden" style={{ background: "#050c0e" }}>
      {/* Atmospheric mesh gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#050c0e" }} />
        <div className="absolute" style={{
          width: "80%", height: "60%", top: "-10%", left: "-10%",
          background: "radial-gradient(ellipse 80% 60% at 10% 20%, #0d3830 0%, transparent 60%)",
        }} />
        <div className="absolute" style={{
          width: "60%", height: "50%", bottom: "-10%", right: "-10%",
          background: "radial-gradient(ellipse 60% 50% at 85% 70%, #0a2a22 0%, transparent 55%)",
        }} />
      </div>

      <Sidebar />
      <TopBar />

      <main className="relative z-10" style={{ marginLeft: 72 }}>
        <div className="flex min-h-screen">
          {/* Main content */}
          <div className="flex-1 min-w-0 p-8 pr-4" style={{ minWidth: 0 }}>

            {/* Page header */}
            <div className="flex flex-col gap-2 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              >
                <h1
                  className="font-display font-bold text-foreground"
                  style={{ fontSize: 38, letterSpacing: "-0.03em", lineHeight: 1.1 }}
                >
                  Account Overview
                </h1>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeTab}
                    className="text-sm font-sans mt-1"
                    style={{ color: "#6b8a82" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {TAB_SUBTITLES[activeTab]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* Tab strip */}
              <motion.div
                className="flex items-center gap-1 mt-3 p-1 rounded-xl self-start"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                role="tablist"
                aria-label="Dashboard sections"
              >
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8ff3e]/50",
                      activeTab === tab.id ? "text-[#050c0e]" : "text-[#6b8a82] hover:text-foreground"
                    )}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="active-tab-bg"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ background: "#a8ff3e", boxShadow: "0 0 20px rgba(168,255,62,0.35)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {tab.label}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Tab content with animated transitions */}
            <AnimatePresence mode="wait">
              <TabPanel key={activeTab} id={activeTab} activeId={activeTab} />
            </AnimatePresence>
          </div>

          {/* Right rail — persistent across all tabs */}
          <div className="flex-shrink-0" style={{ width: 348 }}>
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
