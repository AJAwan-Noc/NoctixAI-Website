import { cn } from "@/lib/utils";
import { NoctixLogoMark } from "@/components/noctix/NoctixLogoMark";

type Variant = "full" | "mark" | "wordmark-text";

interface NoctixLogoProps {
  className?: string;
  variant?: Variant;
  /** Ignored — kept for API compatibility. */
  accent?: boolean;
}

/**
 * Noctix AI logo. Renders the brand lockup as inline SVG — no raster
 * assets, no theme-variant swap, currentColor inherits the surrounding
 * text color so it's correct in both themes with zero extra downloads.
 *
 * Variants:
 *  - "full"          → mark + "Noctix AI" wordmark, one inline SVG (default, used in nav/footer)
 *  - "mark"          → standalone n-mark only (favicons, badges)
 *  - "wordmark-text" → mark + "Noctix AI" rendered as text
 */
export function NoctixLogo({ className = "h-7 w-auto", variant = "full" }: NoctixLogoProps) {
  if (variant === "mark") {
    return <NoctixLogoMark titled className={cn("h-full w-auto", className)} />;
  }

  if (variant === "wordmark-text") {
    return (
      <div className={cn("inline-flex items-center gap-3", className)}>
        <NoctixLogoMark className="h-full w-auto" />
        <span className="font-display text-[1.15em] font-semibold tracking-tight leading-none">
          Noctix <span className="text-[var(--lime)]">AI</span>
        </span>
      </div>
    );
  }

  // "full" — one inline SVG: the mark nested alongside an SVG <text> wordmark.
  // currentColor + var(--lime) inherit/override exactly like the mark does on its own.
  return (
    <svg viewBox="0 0 680 180" fill="currentColor" className={cn("h-7 w-auto", className)}>
      <NoctixLogoMark x={0} y={1} width={178} height={178} />
      <text
        x={210}
        y={90}
        dominantBaseline="central"
        textLength={450}
        lengthAdjust="spacingAndGlyphs"
        fontSize={128}
        className="font-display font-semibold"
      >
        Noctix <tspan fill="var(--lime)">AI</tspan>
      </text>
    </svg>
  );
}
