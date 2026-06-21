import { cn } from "@/lib/utils";
import darkLogoUrl from "@/assets/logo/noctix-logo-full-transparent.png";
import lightLogoUrl from "@/assets/logo/noctix-logo-light-transparent.png";
import markUrl from "@/assets/logo/noctix-mark-transparent.png";

type Variant = "full" | "mark" | "wordmark-text";

interface NoctixLogoProps {
  className?: string;
  variant?: Variant;
  /** Ignored — kept for API compatibility. */
  accent?: boolean;
}

/**
 * Noctix AI logo. Renders the original brand lockup. Wordmark color flips
 * for light/dark mode using two CDN assets stacked behind a CSS class swap —
 * SSR-safe (no useTheme dependency, no hydration flash).
 *
 * Variants:
 *  - "full"          → full "Noctix AI" lockup (default, used in nav/footer)
 *  - "mark"          → standalone n-mark only (favicons, badges)
 *  - "wordmark-text" → mark + "Noctix AI" rendered as text
 */
export function NoctixLogo({ className = "h-7 w-auto", variant = "full" }: NoctixLogoProps) {
  if (variant === "mark") {
    return (
      <img
        src={markUrl}
        alt="Noctix AI"
        className={cn("h-full w-auto object-contain", className)}
      />
    );
  }

  if (variant === "wordmark-text") {
    return (
      <div className={cn("inline-flex items-center gap-3", className)}>
        <img src={markUrl} alt="" className="h-full w-auto object-contain" />
        <span className="font-display text-[1.15em] font-semibold tracking-tight leading-none">
          Noctix <span className="text-[var(--lime)]">AI</span>
        </span>
      </div>
    );
  }

  // "full" — stack both logo variants and toggle visibility based on `.dark` class on <html>.
  return (
    <span className={cn("relative inline-block h-7 w-auto", className)}>
      <img
        src={lightLogoUrl}
        alt="Noctix AI"
        className="h-full w-auto object-contain dark:hidden"
      />
      <img
        src={darkLogoUrl}
        alt=""
        aria-hidden="true"
        className="hidden h-full w-auto object-contain dark:block"
      />
    </span>
  );
}
