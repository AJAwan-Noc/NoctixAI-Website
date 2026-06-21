"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  size?: number;
  staticity?: number;
  ease?: number;
  color?: string;
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

export function Particles({
  className,
  quantity = 60,
  size = 0.6,
  staticity = 50,
  ease = 50,
  color = "0,255,150",
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    circles.current = Array.from({ length: quantity }, () => {
      const s = Math.floor(Math.random() * 2) + size;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        translateX: 0,
        translateY: 0,
        size: s,
        alpha: 0,
        targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        magnetism: 0.1 + Math.random() * 4,
      };
    });
  }, [quantity, size, dpr]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    circles.current.forEach((c) => {
      const edge = Math.min(
        c.x + c.translateX,
        w - c.x - c.translateX,
        c.y + c.translateY,
        h - c.y - c.translateY,
      );
      const edgeAlpha = parseFloat((edge / 20).toFixed(2));
      if (edgeAlpha > 1) c.alpha += 0.02;
      else c.alpha = c.targetAlpha * edgeAlpha;
      c.x += c.dx;
      c.y += c.dy;
      c.translateX += (mouse.current.x / (staticity / c.magnetism) - c.translateX) / ease;
      c.translateY += (mouse.current.y / (staticity / c.magnetism) - c.translateY) / ease;

      if (c.x < -c.size || c.x > w + c.size || c.y < -c.size || c.y > h + c.size) {
        c.x = Math.random() * w;
        c.y = Math.random() * h;
        c.translateX = 0;
        c.translateY = 0;
      }

      ctx.beginPath();
      ctx.arc(c.x + c.translateX, c.y + c.translateY, c.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${color},${c.alpha})`;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [color, staticity, ease]);

  useEffect(() => {
    draw();
    animate();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    const onMouse = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      };
    };
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw, animate]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
