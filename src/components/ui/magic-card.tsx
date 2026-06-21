"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children?: ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 220,
  gradientColor = "color-mix(in oklab, var(--lime) 18%, transparent)",
  gradientOpacity = 0.85,
  gradientFrom = "var(--lime)",
  gradientTo = "var(--lime-glow)",
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - left}px`);
    el.style.setProperty("--my", `${e.clientY - top}px`);
  }, []);

  const handleMouseEnter = useCallback(() => {
    cardRef.current?.style.setProperty("--mc-opacity", String(gradientOpacity));
  }, [gradientOpacity]);

  const handleMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--mc-opacity", "0");
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div
      ref={cardRef}
      style={
        {
          "--mc-size": `${gradientSize}px`,
          "--mc-color": gradientColor,
          "--mc-from": gradientFrom,
          "--mc-to": gradientTo,
          "--mc-opacity": "0",
        } as React.CSSProperties
      }
      className={cn("group relative isolate overflow-hidden", className)}
    >
      {/* Border highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--mc-opacity,0)] transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(var(--mc-size) circle at var(--mx) var(--my), var(--mc-from), transparent 60%)",
          maskImage: "linear-gradient(black, black), linear-gradient(black, black)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      {/* Inner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--mc-opacity,0)] transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(var(--mc-size) circle at var(--mx) var(--my), var(--mc-color), transparent 70%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
