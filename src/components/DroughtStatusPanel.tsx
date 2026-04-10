"use client";

import { motion } from "framer-motion";
import type { DroughtState } from "@/lib/drought";

interface DroughtStatusPanelProps {
  states: DroughtState[];
  loading: boolean;
}

// Severity color scale matching USDM visual conventions
const DROUGHT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  None: { bg: "rgba(76,175,80,0.1)", text: "#81C784", border: "rgba(76,175,80,0.3)" },
  D0: { bg: "rgba(253,224,71,0.1)", text: "#facc15", border: "rgba(253,224,71,0.3)" },
  D1: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", border: "rgba(251,191,36,0.4)" },
  D2: { bg: "rgba(249,115,22,0.15)", text: "#fb923c", border: "rgba(249,115,22,0.4)" },
  D3: { bg: "rgba(239,68,68,0.15)", text: "#f87171", border: "rgba(239,68,68,0.4)" },
  D4: { bg: "rgba(185,28,28,0.2)", text: "#dc2626", border: "rgba(185,28,28,0.5)" },
};

export function DroughtStatusPanel({ states, loading }: DroughtStatusPanelProps) {
  if (loading) {
    return (
      <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-8 text-center">
        <p className="text-sm text-white/40 font-mono animate-pulse">
          LOADING USDA DROUGHT MONITOR...
        </p>
      </div>
    );
  }

  if (states.length === 0) {
    return (
      <div className="bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-8 text-center">
        <p className="text-sm text-white/40 font-mono">
          USDM_DATA::UNAVAILABLE
        </p>
      </div>
    );
  }

  const mostRecentDate = states[0]?.validEnd
    ? new Date(states[0].validEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-6 md:p-8">
      {/* HUD corners */}
      <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-accent-400/30 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-accent-400/30 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-accent-400/30 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-accent-400/30 rounded-br-2xl" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono text-accent-400/50 tracking-[0.2em]">
            // USDA DROUGHT MONITOR
          </p>
          <h3 className="text-xl font-bold text-white mt-1">
            Regional Drought Status
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-mono text-accent-400/40">WEEK OF</p>
          <p className="text-[10px] font-mono text-white/60">{mostRecentDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {states.map((s, i) => {
          const colors = DROUGHT_COLORS[s.worstClass] ?? DROUGHT_COLORS.None;
          return (
            <motion.div
              key={s.state}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-4"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-lg font-bold text-white font-mono">
                  {s.state}
                </span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: colors.text }}
                >
                  {s.worstClass}
                </span>
              </div>
              <p className="text-[10px] text-white/50 font-mono mb-3">
                {s.stateName}
              </p>
              <p
                className="text-[11px] font-semibold"
                style={{ color: colors.text }}
              >
                {s.worstClassLabel}
              </p>
              {s.d1 > 0 && (
                <p className="text-[10px] text-white/40 font-mono mt-2">
                  {s.d1.toFixed(1)}% in drought
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.04]">
        <p className="text-[10px] font-mono text-white/30">
          Source: U.S. Drought Monitor (USDM) — updated weekly by USDA / NOAA / Nebraska DMC
        </p>
      </div>
    </div>
  );
}
