"use client";

import { useEffect, useRef } from "react";

export function GridBackground({
  className = "",
  lineColor = "rgba(76, 175, 80, 0.06)",
  dotColor = "rgba(76, 175, 80, 0.15)",
  gridSize = 60,
}: {
  className?: string;
  lineColor?: string;
  dotColor?: string;
  gridSize?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Draw grid lines
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;

      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw pulsing dots at intersections
      for (let x = 0; x <= w; x += gridSize) {
        for (let y = 0; y <= h; y += gridSize) {
          const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2);
          const pulse = Math.sin(time * 0.02 - dist * 0.005) * 0.5 + 0.5;
          ctx.fillStyle = dotColor;
          ctx.globalAlpha = pulse * 0.6 + 0.1;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Scanning line
      const scanY = ((time * 0.5) % (h + 100)) - 50;
      const gradient = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      gradient.addColorStop(0, "rgba(76, 175, 80, 0)");
      gradient.addColorStop(0.5, "rgba(76, 175, 80, 0.08)");
      gradient.addColorStop(1, "rgba(76, 175, 80, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 40, w, 80);

      time++;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [lineColor, dotColor, gridSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
