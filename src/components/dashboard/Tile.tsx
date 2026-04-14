"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight } from "@/components/Icons";

export type TileStatus = "good" | "watch" | "alert" | "neutral" | "loading";

type Props = {
  label: string;
  value: ReactNode;
  subtitle?: ReactNode;
  status?: TileStatus;
  icon?: ReactNode;
  /** Deep-page URL this tile links to. */
  href: string;
  /** Small context below the big value, e.g. "3 hour window". */
  context?: ReactNode;
};

const STATUS_STYLES: Record<TileStatus, { dot: string; ring: string; badge: string }> = {
  good: {
    dot: "bg-accent-400 shadow-[0_0_8px_rgba(76,175,80,0.6)]",
    ring: "border-accent-500/25",
    badge: "text-accent-400",
  },
  watch: {
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
    ring: "border-amber-400/25",
    badge: "text-amber-300",
  },
  alert: {
    dot: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    ring: "border-red-500/25",
    badge: "text-red-400",
  },
  neutral: {
    dot: "bg-white/30",
    ring: "border-white/10",
    badge: "text-white/50",
  },
  loading: {
    dot: "bg-white/20 animate-pulse",
    ring: "border-white/10",
    badge: "text-white/40",
  },
};

export function Tile({
  label,
  value,
  subtitle,
  status = "neutral",
  icon,
  href,
  context,
}: Props) {
  const s = STATUS_STYLES[status];
  return (
    <Link
      href={href}
      className={`group relative flex flex-col gap-2 rounded-xl border bg-white/[0.03] hover:bg-white/[0.06] p-4 transition h-full ${s.ring}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${s.dot}`} aria-hidden />
          <span className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
            {label}
          </span>
        </div>
        {icon && <div className="text-white/40 group-hover:text-white/70 transition">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-white leading-tight">{value}</div>
      {context && <div className={`text-xs font-medium ${s.badge}`}>{context}</div>}
      {subtitle && <div className="text-xs text-white/55 mt-auto">{subtitle}</div>}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
        <IconArrowRight className="w-4 h-4 text-white/50" />
      </div>
    </Link>
  );
}
