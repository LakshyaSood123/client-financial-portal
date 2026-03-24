import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "@/components/layout/TopNav";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { VerificationTab } from "@/components/dashboard/tabs/VerificationTab";
import { IntegrationsTab } from "@/components/dashboard/tabs/IntegrationsTab";
import { BillingTab } from "@/components/dashboard/tabs/BillingTab";

const TAB_SUBTITLES = {
  overview:     "KYB progress, integration health, billing status, and recent activity",
  verification: "KYB verification state, submitted documents, risk assessment, and history",
  integrations: "API keys, webhook endpoints, delivery health, and developer activity",
  billing:      "Current balance, plan details, usage this cycle, and billing history",
} as const;

const slideVariants = {
  enter:  { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -8 },
};

type TabId = "overview" | "verification" | "integrations" | "billing";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ background: "#EDEBE6" }}>
      {/* Warm gradient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{
          width: "50%", height: "60%",
          top: "-10%", right: "-5%",
          background: "radial-gradient(ellipse 55% 60% at 100% 0%, rgba(249,115,22,0.06) 0%, rgba(245,158,11,0.03) 45%, transparent 75%)",
        }} />
        <div className="absolute" style={{
          width: "35%", height: "45%",
          bottom: "5%", left: "3%",
          background: "radial-gradient(ellipse 60% 55% at 0% 100%, rgba(249,115,22,0.05) 0%, transparent 70%)",
        }} />
      </div>

      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative z-10">
        <div className="flex min-h-[calc(100vh-64px)]">

          {/* Main content */}
          <div className="flex-1 min-w-0 p-8 pr-4">

            {/* Page header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <h1
                className="font-display"
                style={{ fontSize: 54, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#1C1917" }}
              >
                Account Overview
              </h1>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTab}
                  className="text-sm font-sans mt-1"
                  style={{ color: "#A09080" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {TAB_SUBTITLES[activeTab]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === "overview"     && <OverviewTab />}
                {activeTab === "verification" && <VerificationTab />}
                {activeTab === "integrations" && <IntegrationsTab />}
                {activeTab === "billing"      && <BillingTab />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right rail */}
          <div className="flex-shrink-0" style={{ width: 348 }}>
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
