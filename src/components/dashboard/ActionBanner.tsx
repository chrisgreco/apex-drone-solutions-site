"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type ActionCardSeverity = "alert" | "watch" | "info" | "good";

export type ActionCard = {
  id: string;
  severity: ActionCardSeverity;
  headline: string;
  detail?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type Props = {
  cards: ActionCard[];
  /** Used when the cards array is empty to reassure the grower. */
  emptyLabel?: string;
};

const SEVERITY_STYLES: Record<
  ActionCardSeverity,
  { border: string; bg: string; badge: string; badgeText: string; icon: ReactNode }
> = {
  alert: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    badge: "bg-red-500/20 text-red-300",
    badgeText: "Act now",
    icon: "🚨",
  },
  watch: {
    border: "border-amber-400/30",
    bg: "bg-amber-400/10",
    badge: "bg-amber-400/20 text-amber-200",
    badgeText: "Watch",
    icon: "⚠️",
  },
  info: {
    border: "border-white/15",
    bg: "bg-white/5",
    badge: "bg-white/10 text-white/70",
    badgeText: "Heads up",
    icon: "ℹ️",
  },
  good: {
    border: "border-accent-500/30",
    bg: "bg-accent-500/10",
    badge: "bg-accent-500/20 text-accent-300",
    badgeText: "Opportunity",
    icon: "✅",
  },
};

export function ActionBanner({ cards, emptyLabel }: Props) {
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-3">
        <span className="text-xl" aria-hidden>
          👍
        </span>
        <span className="text-white/75">
          {emptyLabel ?? "All clear — nothing urgent for your farm today."}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cards.map((c) => {
        const s = SEVERITY_STYLES[c.severity];
        return (
          <div
            key={c.id}
            className={`rounded-xl border ${s.border} ${s.bg} p-4 flex flex-col md:flex-row md:items-center gap-3`}
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="text-xl mt-0.5" aria-hidden>
                {s.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${s.badge}`}>
                    {s.badgeText}
                  </span>
                  <h3 className="text-white font-semibold text-base">{c.headline}</h3>
                </div>
                {c.detail && <p className="text-sm text-white/70">{c.detail}</p>}
              </div>
            </div>
            {c.ctaLabel && c.ctaHref && (
              <Link
                href={c.ctaHref}
                className="flex-shrink-0 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition whitespace-nowrap text-center"
              >
                {c.ctaLabel} →
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
