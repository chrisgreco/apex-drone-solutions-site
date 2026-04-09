"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function TextReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : {}
          }
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export function GradientText({
  children,
  className = "",
  from = "#22c55e",
  via,
  to = "#16a34a",
  animate = false,
}: {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}) {
  const gradient = via
    ? `linear-gradient(135deg, ${from}, ${via}, ${to})`
    : `linear-gradient(135deg, ${from}, ${to})`;

  return (
    <span
      className={`bg-clip-text text-transparent ${
        animate ? "animate-gradient bg-[length:200%_auto]" : ""
      } ${className}`}
      style={{ backgroundImage: gradient }}
    >
      {children}
    </span>
  );
}
