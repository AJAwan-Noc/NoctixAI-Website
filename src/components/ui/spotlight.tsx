import { useRef, useState, useEffect, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
  size?: number;
}

export function Spotlight({ className, fill = "white", size = 600 }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onEnter = () => setOpacity(1);
    const onLeave = () => setOpacity(0);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const style: CSSProperties = {
    background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${fill}, transparent 70%)`,
    opacity,
    transition: "opacity 400ms ease",
  };

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={style}
    />
  );
}
