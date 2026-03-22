import { motion } from "framer-motion";
import { MyCardVisual } from "./MyCardVisual";
import { ChevronRight, ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const TRANSACTIONS = [
  { id: 1, name: "Figma", date: "Mar 20", amount: -15.00, initial: "F", bg: "#9b7ff4" },
  { id: 2, name: "Grammarly", date: "Mar 18", amount: -10.00, initial: "G", bg: "#00d4aa" },
  { id: 3, name: "Blender", date: "Mar 15", amount: -15.00, initial: "B", bg: "#ff6b35" },
];

const sparklineData = Array.from({ length: 18 }, (_, i) => ({
  val: 40 + Math.sin(i * 0.7) * 25 + i * 1.5,
}));

const panelStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(20px)",
  borderLeft: "1px solid rgba(255,255,255,0.07)",
};

const glassRow: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

export function RightPanel() {
  return (
    <motion.div
      className="flex flex-col"
      style={{ ...panelStyle, minHeight: '100vh' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="flex flex-col gap-6 p-6">
        {/* My Card */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-foreground" style={{ fontSize: 18 }}>My Card</h2>
            <button className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-[#a8ff3e]" style={{ color: '#00d4aa' }}>
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <MyCardVisual />
        </section>

        {/* Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-foreground" style={{ fontSize: 18 }}>Transactions</h2>
            <button className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-[#a8ff3e]" style={{ color: '#00d4aa' }}>
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {TRANSACTIONS.map((tx, i) => (
              <motion.div
                key={tx.id}
                className="flex items-center justify-between h-14 px-3 rounded-xl cursor-pointer group transition-all duration-150"
                style={{
                  borderLeft: "2px solid transparent",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{
                  background: "rgba(255,255,255,0.04)",
                  borderLeftColor: "#00d4aa",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: tx.bg }}
                  >
                    {tx.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-[#00d4aa] transition-colors">{tx.name}</p>
                    <p className="text-xs" style={{ color: '#6b8a82' }}>{tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: tx.amount < 0 ? '#ff5a5a' : '#00d4aa' }}
                  >
                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                  {tx.amount < 0
                    ? <ArrowDownRight className="w-3.5 h-3.5" style={{ color: '#ff5a5a' }} />
                    : <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#00d4aa' }} />
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom row: Add Friends + Spending */}
        <div className="grid grid-cols-2 gap-3">
          {/* Add Friends */}
          <motion.div
            className="p-4 rounded-2xl flex flex-col gap-3 cursor-pointer hover:bg-white/[0.07] transition-colors"
            style={glassRow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div>
              <p className="text-sm font-bold text-foreground">Add friends</p>
              <p className="text-[10px] leading-tight mt-0.5" style={{ color: '#6b8a82' }}>
                Invite friends to join and earn rewards together
              </p>
            </div>
            <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 overflow-hidden flex-shrink-0" style={{ borderColor: '#050c0e', background: '#9b7ff4', zIndex: 30 }}>
                <img src="https://i.pravatar.cc/80?img=1" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 overflow-hidden flex-shrink-0" style={{ borderColor: '#050c0e', background: '#00d4aa', zIndex: 20 }}>
                <img src="https://i.pravatar.cc/80?img=2" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 overflow-hidden flex-shrink-0" style={{ borderColor: '#050c0e', background: '#ffb547', zIndex: 10 }}>
                <img src="https://i.pravatar.cc/80?img=3" alt="" className="w-full h-full object-cover" />
              </div>
              <div
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: '#6b8a82', borderStyle: 'dashed', color: '#6b8a82' }}
              >
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>

          {/* Spending sparkline */}
          <motion.div
            className="p-4 rounded-2xl flex flex-col justify-between overflow-hidden relative"
            style={glassRow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <p className="text-sm font-bold text-foreground relative z-10">Spending</p>
            <div className="absolute inset-x-0 bottom-0 h-14 opacity-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#00d4aa"
                    strokeWidth={2}
                    fill="url(#spendGrad)"
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
