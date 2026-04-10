"use client";

import { motion } from "framer-motion";
import type { RegionalTfr } from "@/lib/tfrs";

interface TfrPanelProps {
  tfrs: RegionalTfr[];
  loading: boolean;
}

// Color code TFR types by operational risk for drone pilots
const TFR_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  HAZARDS: { bg: "rgba(239,68,68,0.1)", text: "#f87171", border: "rgba(239,68,68,0.3)" },
  SECURITY: { bg: "rgba(168,85,247,0.1)", text: "#c084fc", border: "rgba(168,85,247,0.3)" },
  VIP: { bg: "rgba(168,85,247,0.1)", text: "#c084fc", border: "rgba(168,85,247,0.3)" },
  "SPACE OPERATIONS": { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  "AIR SHOWS/SPORTS": { bg: "rgba(251,191,36,0.1)", text: "#fbbf24", border: "rgba(251,191,36,0.3)" },
  "UAS PUBLIC GATHERING": { bg: "rgba(249,115,22,0.1)", text: "#fb923c", border: "rgba(249,115,22,0.3)" },
};

function getTypeColors(type: string) {
  return TFR_TYPE_COLORS[type] ?? {
    bg: "rgba(156,163,175,0.1)",
    text: "#9ca3af",
    border: "rgba(156,163,175,0.3)",
  };
}

export function TfrPanel({ tfrs, loading }: TfrPanelProps) {
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
            // FAA AIRSPACE RESTRICTIONS
          </p>
          <h3 className="text-xl font-bold text-white mt-1">
            Active Flight Restrictions
          </h3>
          <p className="text-[11px] text-white/40 mt-1">
            Temporary no-fly zones affecting drone operations in NJ, PA, DE &amp; NY
          </p>
        </div>
        <div className="text-right">
          <motion.p
            className="text-3xl font-bold font-mono"
            style={{ color: tfrs.length > 0 ? "#f87171" : "#81C784" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {loading ? "..." : tfrs.length}
          </motion.p>
          <p className="text-[9px] font-mono text-white/40">ACTIVE</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-white/40 font-mono animate-pulse text-center py-6">
          QUERYING FAA NOTAM SYSTEM...
        </p>
      ) : tfrs.length === 0 ? (
        <div className="rounded-xl p-6 text-center" style={{
          background: "rgba(76,175,80,0.08)",
          border: "1px solid rgba(76,175,80,0.2)",
        }}>
          <p className="text-sm font-semibold" style={{ color: "#81C784" }}>
            Airspace Clear
          </p>
          <p className="text-[11px] text-white/40 font-mono mt-1">
            No active TFRs in the Mid-Atlantic region
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {tfrs.map((tfr, i) => {
            const colors = getTypeColors(tfr.type);
            return (
              <motion.a
                key={tfr.id}
                href={tfr.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="block rounded-xl p-3 hover:bg-white/[0.06] transition-colors"
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: colors.border,
                          color: colors.text,
                        }}
                      >
                        {tfr.type}
                      </span>
                      <span className="text-[10px] font-mono text-white/50">
                        NOTAM {tfr.id}
                      </span>
                      <span className="text-[10px] font-mono text-white/30">
                        &middot; {tfr.state}
                      </span>
                    </div>
                    <p className="text-[12px] text-white/70 leading-relaxed">
                      {tfr.description}
                    </p>
                  </div>
                  <svg
                    className="w-3 h-3 shrink-0 mt-1 opacity-40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </motion.a>
            );
          })}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/[0.04]">
        <p className="text-[10px] font-mono text-white/30">
          Source: FAA TFR feed (tfr.faa.gov) — always check NOTAMs before flight
        </p>
      </div>
    </div>
  );
}
