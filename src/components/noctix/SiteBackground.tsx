import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Site-wide animated background:
 * - Animated pixel grid that subtly pulses
 * - Drifting lime particles
 * - Vertical "scan" beam sweeping across
 * - Mouse parallax
 * Fixed-position, sits behind all content. Pointer-events disabled.
 */
export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const CELL = 48; // grid cell size in CSS px

    type Particle = { x: number; y: number; vx: number; vy: number; s: number; a: number };
    let particles: Particle[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(80, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.2,
        s: Math.random() < 0.85 ? 1 : 2,
        a: 0.2 + Math.random() * 0.6,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / w - 0.5) * 2;
      pointer.ty = (e.clientY / h - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer);

    let raf = 0;
    let t = 0;
    const render = () => {
      t += 1;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      ctx.clearRect(0, 0, w, h);

      const isDark = themeRef.current === "dark";
      const gridStroke = isDark ? "rgba(255,255,255,0.045)" : "rgba(20,30,90,0.06)";
      const litFill = (a: number) =>
        isDark ? `rgba(80,90,255,${a.toFixed(3)})` : `rgba(60,75,255,${(a * 0.7).toFixed(3)})`;
      const beamColor = isDark ? "80,90,255" : "60,75,255";
      const particleColor = isDark ? "150,160,255" : "70,90,200";

      // Vignette base
      const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      if (isDark) {
        grd.addColorStop(0, "rgba(8,10,8,0)");
        grd.addColorStop(1, "rgba(0,0,0,0.55)");
      } else {
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(1, "rgba(220,225,240,0.4)");
      }
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // Pixel grid with parallax + occasional lit cells
      const ox = pointer.x * 12;
      const oy = pointer.y * 12;
      ctx.strokeStyle = gridStroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const startX = -((CELL - (ox % CELL)) % CELL);
      const startY = -((CELL - (oy % CELL)) % CELL);
      for (let x = startX; x < w; x += CELL) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
      }
      for (let y = startY; y < h; y += CELL) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
      }
      ctx.stroke();

      // Lit pixels at intersections — slow twinkle
      const cols = Math.ceil(w / CELL) + 2;
      const rows = Math.ceil(h / CELL) + 2;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const seed = i * 92821 + j * 13331;
          const r = Math.sin(seed) * 43758.5453;
          const f = r - Math.floor(r);
          if (f > 0.985) {
            const phase = (t * 0.02 + f * 50) % (Math.PI * 2);
            const a = 0.15 + Math.abs(Math.sin(phase)) * 0.55;
            const px = i * CELL + startX;
            const py = j * CELL + startY;
            ctx.fillStyle = litFill(a);
            ctx.fillRect(px - 1, py - 1, 3, 3);
          }
        }
      }

      // Scan beam (slow vertical sweep)
      const beamY = ((t * 0.6) % (h + 200)) - 100;
      const beamGrad = ctx.createLinearGradient(0, beamY - 80, 0, beamY + 80);
      beamGrad.addColorStop(0, `rgba(${beamColor},0)`);
      beamGrad.addColorStop(0.5, `rgba(${beamColor},0.06)`);
      beamGrad.addColorStop(1, `rgba(${beamColor},0)`);
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, beamY - 80, w, 160);
      ctx.fillStyle = `rgba(${beamColor},0.18)`;
      ctx.fillRect(0, beamY, w, 1);

      // Drifting pixel particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.fillStyle = `rgba(${particleColor},${p.a})`;
        const size = p.s * 2;
        ctx.fillRect(p.x | 0, p.y | 0, size, size);
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ contain: "strict" }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* Subtle scanlines overlay on top of canvas */}
      <div className="absolute inset-0 scanlines opacity-30" />
    </div>
  );
}
