import { useCallback, useRef, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";

export function useAdminTilt(strength = 4) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const onMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((event.clientX - left) / width - 0.5) * 2;
    const y = ((event.clientY - top) / height - 0.5) * 2;
    el.style.transform = `perspective(800px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateY(-2px)`;
  }, [reduceMotion, strength]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }, []);

  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}
