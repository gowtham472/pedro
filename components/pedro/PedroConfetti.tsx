"use client";

import { useEffect, useRef } from "react";

// A brief particle burst on genuine success (all tests pass, task complete).
// Plain <canvas> - no dependency pulled in for something this small. Fires
// once per mount via the `burstKey` prop changing, cleans its own rAF loop
// up, and is a no-op under prefers-reduced-motion.

const COLORS = ["#dae9d0", "#c3dcb4", "#fff3b5", "#bfefff", "#ffffff"];
const PARTICLE_COUNT = 90;
const DURATION_MS = 2200;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  shape: "rect" | "circle";
}

export function PedroConfetti({ burstKey }: { burstKey: string | number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    const resize = () => {
      const rect = parent?.getBoundingClientRect();
      canvas.width = (rect?.width ?? window.innerWidth) * devicePixelRatio;
      canvas.height = 320 * devicePixelRatio;
      canvas.style.width = `${rect?.width ?? window.innerWidth}px`;
      canvas.style.height = "320px";
    };
    resize();

    const w = canvas.width;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: w * (0.3 + Math.random() * 0.4),
      y: 0,
      vx: (Math.random() - 0.5) * 9 * devicePixelRatio,
      vy: (-Math.random() * 7 - 4) * devicePixelRatio,
      size: (Math.random() * 6 + 4) * devicePixelRatio,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.35,
      shape: Math.random() < 0.5 ? "rect" : "circle",
    }));

    const gravity = 0.32 * devicePixelRatio;
    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fadeStart = DURATION_MS * 0.65;
      const opacity = elapsed < fadeStart ? 1 : Math.max(0, 1 - (elapsed - fadeStart) / (DURATION_MS - fadeStart));

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.rotation += p.spin;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < DURATION_MS) {
        frame = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [burstKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[320px] w-full"
    />
  );
}
