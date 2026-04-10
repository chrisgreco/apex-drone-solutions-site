"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CATEGORY_CONFIG, type ConditionEvent } from "@/lib/eonet";

interface EventCardProps {
  event: ConditionEvent;
}

export function EventCard({ event }: EventCardProps) {
  const config = CATEGORY_CONFIG[event.category];
  if (!config) return null;

  const timeAgo = formatDistanceToNow(new Date(event.date), { addSuffix: true });

  // Build contact link with event context
  const contactParams = new URLSearchParams({
    subject: `${config.label} — ${event.title}`,
    source: "conditions-radar",
  });

  return (
    <div className="relative bg-white/[0.03] border border-accent-500/10 rounded-2xl backdrop-blur-sm p-5 hover:border-accent-400/30 hover:bg-white/[0.06] transition-all duration-300">
      {/* HUD corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent-400/20 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent-400/20 rounded-tr-2xl" />

      <div className="flex items-start gap-3">
        {/* Color indicator */}
        <div
          className="w-3 h-3 rounded-full shrink-0 mt-1.5"
          style={{
            background: config.color,
            boxShadow: `0 0 10px ${config.glow}`,
          }}
        />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-[15px] font-semibold text-white leading-snug">
            {event.title}
          </h3>

          {/* Meta */}
          <p className="text-[11px] text-white/40 font-mono mt-1">
            Detected {timeAgo} via NASA EONET
            {event.magnitude && event.magnitudeUnit && (
              <> &middot; {event.magnitude.toLocaleString()} {event.magnitudeUnit}</>
            )}
          </p>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-white/50 mt-2 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* CTA */}
          <Link
            href={`/contact?${contactParams.toString()}`}
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: `${config.color}15`,
              border: `1px solid ${config.color}30`,
              color: config.color,
            }}
          >
            {config.cta}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
