import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AuroraText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block bg-clip-text text-transparent",
        "[background-image:linear-gradient(110deg,var(--lime),45%,var(--lime-glow),55%,var(--lime))] [background-size:200%_100%]",
        "animate-[aurora-shift_6s_linear_infinite]",
        className,
      )}
      style={{
        filter: "drop-shadow(0 0 24px color-mix(in oklab, var(--lime-glow) 35%, transparent))",
      }}
    >
      {children}
    </span>
  );
}
