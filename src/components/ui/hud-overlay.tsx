"use client";

import { motion } from "framer-motion";

export function HudOverlay({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-accent-400/30" />
      <div className="absolute top-6 right-6 w-10 h-10 border-r-2 border-t-2 border-accent-400/30" />
      <div className="absolute bottom-6 left-6 w-10 h-10 border-l-2 border-b-2 border-accent-400/30" />
      <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-accent-400/30" />

      {/* Top HUD bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] font-mono text-accent-400/50">
        <motion.span
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          SYS ONLINE
        </motion.span>
        <span className="w-1 h-1 rounded-full bg-accent-400/40" />
        <span>LAT 39.7837</span>
        <span className="w-1 h-1 rounded-full bg-accent-400/40" />
        <span>LON -74.9723</span>
        <span className="w-1 h-1 rounded-full bg-accent-400/40" />
        <span>ALT 120ft</span>
      </div>

      {/* Side telemetry */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2 text-[9px] font-mono text-accent-400/30">
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, delay: 0 }}
        >
          WIND 6mph NW
        </motion.div>
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
        >
          BATT 94%
        </motion.div>
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, delay: 1 }}
        >
          GPS LOCK 24
        </motion.div>
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
        >
          FLOW 5.2 GPA
        </motion.div>
      </div>

      {/* Scanning crosshair center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" stroke="rgba(34,211,238,0.08)" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="25" stroke="rgba(34,211,238,0.06)" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="40" y1="0" x2="40" y2="15" stroke="rgba(34,211,238,0.12)" strokeWidth="0.5" />
          <line x1="40" y1="65" x2="40" y2="80" stroke="rgba(34,211,238,0.12)" strokeWidth="0.5" />
          <line x1="0" y1="40" x2="15" y2="40" stroke="rgba(34,211,238,0.12)" strokeWidth="0.5" />
          <line x1="65" y1="40" x2="80" y2="40" stroke="rgba(34,211,238,0.12)" strokeWidth="0.5" />
        </svg>
      </motion.div>
    </div>
  );
}
