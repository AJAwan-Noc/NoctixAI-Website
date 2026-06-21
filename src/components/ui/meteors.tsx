"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Meteors({ number = 20, className }: { number?: number; className?: string }) {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = Array.from({ length: number }, () => ({
      top: -5,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${Math.random() * 1.6}s`,
      animationDuration: `${Math.random() * 6 + 4}s`,
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style}
          className={cn(
            "pointer-events-none absolute size-0.5 rotate-[215deg] animate-[meteor_5s_linear_infinite] rounded-full bg-[var(--lime)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--lime)_30%,transparent)]",
            "before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:transform before:bg-gradient-to-r before:from-[var(--lime)] before:to-transparent before:content-['']",
            className,
          )}
        />
      ))}
    </>
  );
}
