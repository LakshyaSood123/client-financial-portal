import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  BarChart2, 
  CreditCard, 
  Key, 
  ScrollText, 
  Upload,
  Webhook,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: BarChart2, label: "Usage", path: "/usage" },
  { icon: Webhook, label: "Webhooks", path: "/webhooks" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: Key, label: "API Keys", path: "/api-keys" },
  { icon: ScrollText, label: "Audit Logs", path: "/audit-logs" },
  { icon: Upload, label: "KYB Upload", path: "/kyb-upload" },
];

export function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [location] = useLocation();

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-50 glass-panel border-l-0 border-y-0 rounded-none flex flex-col pt-6 pb-6"
      initial={{ width: 72 }}
      animate={{ width: isHovered ? 240 : 72 }}
      transition={{ duration: 0.3, ease: "anticipate" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center px-5 mb-10 h-10 overflow-hidden shrink-0">
        <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
          {/* Animated Logo Mark */}
          <motion.div 
            className="absolute inset-0 border-2 border-accent-lime rounded-full opacity-80"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-1 border-2 border-accent-teal rounded-full opacity-60"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <div className="w-2 h-2 bg-accent-lime rounded-full box-glow" />
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.span 
              className="ml-4 font-display font-bold text-xl tracking-wide text-foreground whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              Nexus<span className="text-accent-lime">KYC</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center h-12 px-3 rounded-xl transition-all duration-200 relative group shrink-0",
                isActive 
                  ? "bg-accent-lime/10 text-accent-lime" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-accent-lime rounded-r-full box-glow"
                />
              )}
              
              <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-accent-lime" : "group-hover:text-accent-teal")} />
              
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    className="ml-4 font-medium whitespace-nowrap"
                    initial={{ opacity: 0, w: 0 }}
                    animate={{ opacity: 1, w: "auto" }}
                    exit={{ opacity: 0, w: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {!isHovered && (
                <div className="absolute left-14 px-3 py-1.5 bg-[#0a181c] border border-white/10 rounded-lg text-sm text-foreground opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 mt-auto pt-6 border-t border-white/5 space-y-2 shrink-0">
        <Link
          href="/admin"
          className="w-full flex items-center h-12 px-3 rounded-xl text-muted-foreground hover:text-[#ff5a5a] hover:bg-[rgba(255,90,90,0.1)] transition-all duration-200 group"
        >
          <Shield className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {isHovered && (
              <motion.span
                className="ml-4 font-medium whitespace-nowrap text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button className="w-full flex items-center h-12 px-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 group">
          <Settings className="w-5 h-5 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                className="ml-4 font-medium whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button className="w-full flex items-center h-12 px-3 rounded-xl text-muted-foreground hover:text-accent-red hover:bg-accent-red/10 transition-all duration-200 group">
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                className="ml-4 font-medium whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
