"use client";

import { useEffect, useRef } from "react";

export function TerrainScan({ className = "" }: { className?: string }) {
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

      const rows = 24;
      const cols = 40;
      const cellW = w / cols;
      const cellH = h / rows;

      // Draw topographic-style terrain lines
      for (let row = 0; row < rows; row++) {
        ctx.beginPath();
        for (let col = 0; col <= cols; col++) {
          const x = col * cellW;
          const baseY = row * cellH + cellH / 2;
          const noise =
            Math.sin(col * 0.3 + row * 0.5 + time * 0.015) * 8 +
            Math.sin(col * 0.15 - time * 0.01) * 12 +
            Math.cos(row * 0.4 + time * 0.008) * 6;
          const y = baseY + noise;

          if (col === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const distFromCenter = Math.abs(row - rows / 2) / (rows / 2);
        const alpha = (1 - distFromCenter) * 0.35;

        ctx.strokeStyle = `rgba(76, 175, 80, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Highlight "scan region" with a moving box
      const scanX = ((time * 0.8) % (w + 200)) - 100;
      ctx.strokeStyle = "rgba(74, 222, 128, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(scanX, h * 0.25, 120, h * 0.5);
      ctx.setLineDash([]);

      // Scan fill
      const grad = ctx.createLinearGradient(scanX, 0, scanX + 120, 0);
      grad.addColorStop(0, "rgba(74, 222, 128, 0)");
      grad.addColorStop(0.5, "rgba(74, 222, 128, 0.04)");
      grad.addColorStop(1, "rgba(74, 222, 128, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(scanX, h * 0.25, 120, h * 0.5);

      // Data point markers
      for (let i = 0; i < 6; i++) {
        const px = (w * (i + 1)) / 7;
        const py = h / 2 + Math.sin(px * 0.01 + time * 0.02) * 20;
        const pulse = Math.sin(time * 0.05 + i) * 0.3 + 0.7;

        ctx.fillStyle = `rgba(76, 175, 80, ${pulse * 0.8})`;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();

        // Ring around point
        ctx.strokeStyle = `rgba(76, 175, 80, ${pulse * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, 8 + Math.sin(time * 0.03 + i) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
    />
  );
}
