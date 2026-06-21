import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  color: string;
}

interface TextParticleAnimationProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  particleSize?: number;
  particleColor?: string;
  particleDensity?: number;
  backgroundColor?: string;
  className?: string;
}

export function TextParticle({
  text,
  fontSize = 80,
  fontFamily = "Arial, sans-serif",
  fontWeight = 600,
  particleSize = 2,
  particleColor = "#3344ff",
  particleDensity = 6,
  backgroundColor = "transparent",
  className = "",
}: TextParticleAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouse, setMouse] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initText = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const next: Particle[] = [];
      for (let y = 0; y < data.height; y += particleDensity) {
        for (let x = 0; x < data.width; x += particleDensity) {
          const idx = (y * data.width + x) * 4;
          if (data.data[idx + 3] > 128) {
            next.push({
              x,
              y,
              size: particleSize,
              baseX: x,
              baseY: y,
              density: Math.random() * 30 + 1,
              color: particleColor,
            });
          }
        }
      }
      setParticles(next);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initText();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [text, fontSize, fontFamily, fontWeight, particleSize, particleColor, particleDensity]);

  useEffect(() => {
    if (particles.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particles.forEach((p) => {
        let fx = 0;
        let fy = 0;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            fx = (dx / dist) * 3;
            fy = (dy / dist) * 3;
          }
        }
        p.x += fx + (p.baseX - p.x) * 0.05;
        p.y += fy + (p.baseY - p.y) * 0.05;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [particles, mouse, backgroundColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => setMouse({ x: null, y: null });

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}
