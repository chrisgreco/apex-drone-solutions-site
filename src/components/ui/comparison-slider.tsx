"use client";

import { useState, useRef } from "react";

export function ComparisonSlider({
  beforeLabel = "Before",
  afterLabel = "After",
  beforeContent,
  afterContent,
  className = "",
}: {
  beforeLabel?: string;
  afterLabel?: string;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(pct);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl cursor-col-resize select-none ${className}`}
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchStart={() => (isDragging.current = true)}
      onTouchEnd={() => (isDragging.current = false)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After (full width behind) */}
      <div className="w-full">{afterContent}</div>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div
          className="w-full h-full"
          style={{ width: containerRef.current?.offsetWidth }}
        >
          {beforeContent}
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] z-10"
        style={{ left: `${position}%` }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-neutral-600"
          >
            <path
              d="M5 3L2 8L5 13M11 3L14 8L11 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs font-medium text-white">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs font-medium text-white">
        {afterLabel}
      </div>
    </div>
  );
}
