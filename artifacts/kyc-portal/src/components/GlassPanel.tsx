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
        background: "var(--nk-surface)",
        border: "1px solid var(--nk-border)",
        boxShadow: "var(--elev-2)",
        transition: hoverable ? "transform 0.25s ease, box-shadow 0.25s ease" : undefined,
        transformStyle: "preserve-3d",
        willChange: hoverable ? "transform, box-shadow" : undefined,
        ...props.style,
      }}
      {...props}
      onMouseEnter={hoverable ? e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--elev-3)";
        props.onMouseEnter?.(e);
      } : props.onMouseEnter}
      onMouseLeave={hoverable ? e => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--elev-2)";
        props.onMouseLeave?.(e);
      } : props.onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
