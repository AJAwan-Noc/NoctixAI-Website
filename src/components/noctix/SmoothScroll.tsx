"use client";

import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { ScrollProvider } from "./ScrollContext";
import { BackToTop } from "./BackToTop";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(lenisInstance);
    let raf = 0;
    const loop = (t: number) => {
      lenisInstance.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenisInstance.destroy();
    };
  }, []);

  return (
    <ScrollProvider lenis={lenis}>
      {children}
      <BackToTop />
    </ScrollProvider>
  );
}
