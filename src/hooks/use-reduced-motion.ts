import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * framer-motion's hook returns null during SSR (no window/matchMedia) -- coerce to true.
 * `initial={false}` (what callers use for the reduced branch) only skips applying a starting
 * style; it never forces the DOM to a state, it assumes the render is already correct. Coercing
 * to false would make SSR paint the hidden/animate-from state, and a real reduced-motion visitor
 * would then get initial={false} on hydration -- which never corrects that hidden style, since
 * nothing ever tells it to become visible. Defaulting to true keeps SSR and that visitor's first
 * render consistent (both visible, no animation), and costs the common case nothing: once
 * hydration resolves the real value, framer applies the hidden style via a layout effect before
 * paint, so the scroll-reveal still plays normally for visitors who don't prefer reduced motion.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? true;
}
