import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainHeader } from "@/components/layout/MainHeader";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { VerificationTab } from "@/components/dashboard/tabs/VerificationTab";
import { IntegrationsTab } from "@/components/dashboard/tabs/IntegrationsTab";
import { BillingTab } from "@/components/dashboard/tabs/BillingTab";

type TabId = string;

const slideVariants = {
  enter:  { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -6 },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "verification":  return <VerificationTab />;
      case "integrations":  return <IntegrationsTab />;
      case "billing":       return <BillingTab />;
      default:              return <OverviewTab />;
    }
  };

  return (
    <div
      style={{
        background: "#E9E7E2",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      {/* Master rounded container */}
      <div
        style={{
          width: "100%",
          maxWidth: 1380,
          background: "#FAF8F4",
          borderRadius: 24,
          overflow: "hidden",
          display: "flex",
          minHeight: "calc(100vh - 40px)",
          boxShadow: "0 4px 32px rgba(90,65,30,0.08)",
        }}
      >
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <MainHeader />
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 32px 32px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
