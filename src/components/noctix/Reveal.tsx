import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const TAG = {
  div: motion.div,
  article: motion.article,
  h2: motion.h2,
  p: motion.p,
} as const;

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Element to render -- defaults to div; use for semantic tags (article, heading, paragraph). */
  as?: keyof typeof TAG;
  /** Vertical offset in px the content slides in from -- 0 for a pure opacity fade. */
  y?: number;
  duration?: number;
  /** Viewport root margin for the whileInView trigger -- pass "" for no margin. */
  viewportMargin?: string;
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y = 20,
  duration = 0.5,
  viewportMargin = "-80px",
}: Props) {
  const reduced = useReducedMotion();
  const MotionTag = TAG[as];
  return (
    <MotionTag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, ...(viewportMargin ? { margin: viewportMargin } : {}) }}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay }}
    >
      {children}
    </MotionTag>
  );
}
