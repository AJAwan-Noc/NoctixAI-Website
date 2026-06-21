import { cn } from "@/lib/utils";

interface MorphingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MorphingSpinner({ size = "md", className }: MorphingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "rounded-full border-transparent border-t-[var(--lime)] border-r-[var(--lime)]/30 animate-spin",
        sizeClasses[size],
        className,
      )}
      style={{ boxShadow: "0 0 18px rgba(51, 68, 255, 0.35)" }}
    />
  );
}
