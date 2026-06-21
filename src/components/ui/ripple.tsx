import { cn } from "@/lib/utils";

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
}

export function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.18,
  numCircles = 7,
  className,
}: RippleProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,white,transparent)]",
        className,
      )}
    >
      {Array.from({ length: numCircles }).map((_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.02;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 animate-[ripple_3s_ease_calc(var(--i)*0.2s)_infinite] rounded-full border [border-color:color-mix(in_oklab,var(--lime)_45%,transparent)] [box-shadow:0_0_30px_-5px_color-mix(in_oklab,var(--lime)_25%,transparent)]"
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                transform: "translate(-50%, -50%) scale(1)",
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
