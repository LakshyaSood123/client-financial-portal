import { MouseEvent, useCallback, useRef } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTilt(strength = 6) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    element.style.transform = `perspective(700px) rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(x * strength).toFixed(2)}deg) translateZ(6px)`;
    element.style.boxShadow = `${(-x * 4).toFixed(2)}px ${(y * 4 + 12).toFixed(2)}px 32px rgba(26,18,8,0.12), var(--elev-orange)`;
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.style.transform = "";
    element.style.boxShadow = "";
  }, []);

  return {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}
