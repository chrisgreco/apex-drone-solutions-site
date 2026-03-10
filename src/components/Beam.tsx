"use client";

import { motion } from "framer-motion";

export function BeamDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-px w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-neutral-200" />
      <motion.div
        className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-accent-500 to-transparent"
        animate={{ x: ["-128px", "calc(100vw + 128px)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
    </div>
  );
}

export function GlowingOrb({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="w-72 h-72 rounded-full bg-accent-500/10 blur-[100px]" />
    </div>
  );
}
