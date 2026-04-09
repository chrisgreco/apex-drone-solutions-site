"use client";

import { useEffect, useRef } from "react";

export function AnimatedGradientBorder({
  children,
  className = "",
  containerClassName = "",
  gradientColors = ["#22c55e", "#16a34a", "#e8792a", "#22c55e"],
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
}) {
  return (
    <div className={`relative rounded-2xl p-[2px] overflow-hidden ${containerClassName}`}>
      <div
        className="absolute inset-0 animate-[spin_6s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, ${gradientColors.join(", ")})`,
        }}
      />
      <div className={`relative bg-white rounded-[14px] ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(76, 175, 80, 0.12)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl border border-accent-500/10 bg-white/[0.03] overflow-hidden group backdrop-blur-sm ${className}`}
      style={
        {
          "--glow-color": glowColor,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--glow-color), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
