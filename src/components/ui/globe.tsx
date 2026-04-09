"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// NJ agricultural counties - markers on South Jersey farms
const NJ_FARM_MARKERS: { location: [number, number]; size: number }[] = [
  { location: [39.88, -74.75], size: 0.06 },   // Burlington County
  { location: [39.37, -75.13], size: 0.05 },   // Cumberland County
  { location: [39.57, -75.35], size: 0.05 },   // Salem County
  { location: [39.47, -74.63], size: 0.05 },   // Atlantic County
  { location: [39.72, -75.13], size: 0.04 },   // Gloucester County
  { location: [39.92, -74.90], size: 0.04 },   // Camden County
  { location: [39.08, -74.82], size: 0.03 },   // Cape May County
  { location: [40.06, -74.85], size: 0.04 },   // Mercer County
];

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;
    let width = canvasRef.current.offsetWidth;
    const isMobile = width < 400;
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

    const globe = createGlobe(canvasRef.current, {
      width: width * dpr,
      height: width * dpr,
      devicePixelRatio: dpr,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: isMobile ? 12000 : 20000,
      mapBrightness: 6,
      baseColor: [0.06, 0.14, 0.1],
      markerColor: [0.3, 0.69, 0.31],
      glowColor: [0.05, 0.12, 0.08],
      markers: NJ_FARM_MARKERS,
    });

    // Auto-rotate — smooth at ~30fps
    let animFrame: number;
    function animate() {
      phi += 0.008;
      globe.update({ phi, width: width * dpr, height: width * dpr });
      animFrame = requestAnimationFrame(animate);
    }
    animFrame = requestAnimationFrame(animate);

    // Fade in
    requestAnimationFrame(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
        globe.update({ width: width * dpr, height: width * dpr });
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrame);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={cn("mx-auto aspect-square w-full max-w-[600px]", className)}>
      <canvas
        className="size-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        ref={canvasRef}
        style={{ cursor: "grab" }}
      />
    </div>
  );
}
