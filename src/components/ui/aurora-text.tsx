import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ReactNode } from "react";

export function AuroraText({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();

  return (
    <span
      className={cn(
        "relative inline-block text-[var(--lime)] aurora-clip",
        "[background-image:linear-gradient(110deg,var(--lime),45%,var(--lime-glow),55%,var(--lime))] [background-size:200%_100%]",
        !reduced && "animate-[aurora-shift_6s_linear_infinite]",
        className,
      )}
    >
      {children}
    </span>
  );
}
