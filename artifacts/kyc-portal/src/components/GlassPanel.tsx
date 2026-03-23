import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function GlassPanel({ children, className, hoverable = false, ...props }: GlassPanelProps) {
  return (
    <motion.div
      className={cn("rounded-2xl relative overflow-hidden", className)}
      style={{
        background: "#EBF2F8",
        border: "1px solid rgba(13,18,33,0.06)",
        boxShadow: "0 1px 4px rgba(13,18,33,0.04)",
        transition: hoverable ? "transform 0.25s ease, box-shadow 0.25s ease" : undefined,
        ...props.style,
      }}
      {...props}
      onMouseEnter={hoverable ? e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(13,18,33,0.08)";
        props.onMouseEnter?.(e);
      } : props.onMouseEnter}
      onMouseLeave={hoverable ? e => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(13,18,33,0.04)";
        props.onMouseLeave?.(e);
      } : props.onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
