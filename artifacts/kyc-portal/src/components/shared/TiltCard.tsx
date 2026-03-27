import { ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTilt } from "@/hooks/useTilt";

interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  strength?: number;
}

export function TiltCard({
  children,
  className,
  strength = 6,
  style,
  ...props
}: TiltCardProps) {
  const tilt = useTilt(strength);

  return (
    <motion.div
      ref={tilt.ref}
      className={cn("tilt-card", className)}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ transformStyle: "preserve-3d", ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
