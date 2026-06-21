"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MorphingSpinner } from "./MorphingSpinner";

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
    const t = setTimeout(() => {
      setDone(true);
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    }, 2400);
    return () => {
      clearTimeout(t);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="absolute inset-0 grid-overlay opacity-20" />
          <div className="absolute inset-0 scanlines opacity-50" />

          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative flex items-center justify-center"
            >
              <MorphingSpinner size="lg" className="lime-glow" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)] flicker"
            >
              Noctix AI System Online
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 220 }}
              transition={{ delay: 0.3, duration: 1.8, ease: "easeInOut" }}
              className="h-px bg-[var(--lime)]/60"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
