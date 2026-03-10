"use client";

import { useEffect, useRef } from "react";

export function GlobeVisualization({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(cx, cy) * 0.85;

      ctx.clearRect(0, 0, w, h);

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(130, 154, 177, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Latitude lines
      for (let i = -2; i <= 2; i++) {
        const lat = (i / 3) * r;
        const latR = Math.sqrt(r * r - lat * lat);
        ctx.beginPath();
        ctx.ellipse(cx, cy + lat, latR, latR * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(130, 154, 177, 0.1)";
        ctx.stroke();
      }

      // Longitude lines (rotating)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI + rotation;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(Math.cos(angle)) * r, r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(130, 154, 177, 0.1)";
        ctx.stroke();
      }

      // Dots representing pilot locations
      const dots = [
        { lat: 0.3, lng: 0.5 },  // Texas
        { lat: 0.1, lng: 0.3 },  // Florida
        { lat: 0.5, lng: 0.6 },  // Midwest
        { lat: 0.4, lng: 0.2 },  // Southeast
        { lat: 0.6, lng: 0.8 },  // Northeast
        { lat: 0.2, lng: 0.7 },  // Gulf
        { lat: 0.35, lng: 0.4 },
        { lat: 0.55, lng: 0.3 },
        { lat: 0.15, lng: 0.6 },
        { lat: 0.45, lng: 0.55 },
      ];

      dots.forEach((dot) => {
        const theta = dot.lng * Math.PI * 2 + rotation * 2;
        const phi = (dot.lat - 0.5) * Math.PI;
        const x = cx + r * Math.cos(phi) * Math.sin(theta);
        const y = cy + r * Math.sin(phi);
        const z = Math.cos(phi) * Math.cos(theta);

        if (z > -0.2) {
          const opacity = 0.3 + z * 0.7;
          const size = 2 + z * 2;

          // Glow
          ctx.beginPath();
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 121, 42, ${opacity * 0.15})`;
          ctx.fill();

          // Dot
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 121, 42, ${opacity})`;
          ctx.fill();
        }
      });

      rotation += 0.003;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
