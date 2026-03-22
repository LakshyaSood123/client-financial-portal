import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function MyCardVisual() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to -1 to 1
    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;
    
    // Max rotation 8deg
    setTilt({ x: -yPct * 8, y: xPct * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="w-full py-4 relative perspective-1000">
      {/* Background peeking card */}
      <div className="absolute top-8 left-4 right-4 h-40 bg-gradient-to-br from-accent-purple to-[#4a3d8c] rounded-2xl opacity-40 blur-[2px] transform rotate-3 scale-95 z-0" />
      
      {/* Main Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative z-10 w-full h-48 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,212,170,0.3)] cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #00d4aa 0%, #007a64 50%, #00402e 100%)",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Card Overlay pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.8),_transparent_50%)] pointer-events-none" />
        
        <div className="flex justify-between items-start relative z-10 transform-gpu translate-z-10">
          {/* Chip */}
          <div className="w-10 h-8 bg-yellow-400/80 rounded border border-yellow-300/50 flex flex-col justify-evenly p-1">
            <div className="w-full h-[1px] bg-black/20" />
            <div className="w-full h-[1px] bg-black/20" />
            <div className="w-full h-[1px] bg-black/20" />
          </div>
          
          <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="relative z-10 transform-gpu translate-z-20">
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Total Balance</p>
          <p className="text-white text-3xl font-display font-bold tracking-tight mb-4">$22,350.50</p>
          
          <div className="flex justify-between items-end font-mono text-sm text-white/90">
            <p className="tracking-[0.2em]">4358 •••• •••• 2323</p>
            <p>08/24</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
