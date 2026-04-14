"use client";

import { useMemo, useState } from "react";
import type {
  HourlyForecast,
  Verdict,
} from "@/lib/spray-decision";
import { computeHourlyVerdicts, evaluateHour } from "@/lib/spray-decision";

/**
 * 7-day spray window timeline.
 * Rows = days, columns = hours of the day (0–23).
 * Cells colored by verdict (green GO / amber CAUTION / red NO-GO).
 * Click a cell to expand details for that hour.
 */

type Props = {
  hourly: HourlyForecast[];
};

function verdictClass(v: Verdict): string {
  if (v === "GO") return "bg-accent-500/80 hover:bg-accent-400";
  if (v === "CAUTION") return "bg-amber-400/80 hover:bg-amber-300";
  return "bg-red-500/70 hover:bg-red-400";
}

function verdictLabel(v: Verdict): string {
  if (v === "GO") return "Good to spray";
  if (v === "CAUTION") return "Caution — marginal";
  return "Do not spray";
}

function formatHour(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  if (h === 0) return "12a";
  if (h < 12) return `${h}a`;
  if (h === 12) return "12p";
  return `${h - 12}p`;
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const that = new Date(d);
  that.setHours(0, 0, 0, 0);
  const daysOut = Math.round((that.getTime() - today.getTime()) / 86400000);
  if (daysOut === 0) return "Today";
  if (daysOut === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function SprayTimeline({ hourly }: Props) {
  const verdicts = useMemo(() => computeHourlyVerdicts(hourly), [hourly]);

  // Group by day (local date key)
  const byDay = useMemo(() => {
    const map = new Map<string, { hour: HourlyForecast; verdict: Verdict; idx: number }[]>();
    hourly.forEach((h, idx) => {
      const dayKey = h.time.slice(0, 10); // "2026-04-13"
      if (!map.has(dayKey)) map.set(dayKey, []);
      map.get(dayKey)!.push({ hour: h, verdict: verdicts[idx], idx });
    });
    return map;
  }, [hourly, verdicts]);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const selected =
    selectedIdx != null && selectedIdx < hourly.length
      ? {
          hour: hourly[selectedIdx],
          ...evaluateHour(hourly[selectedIdx], hourly.slice(selectedIdx + 1, selectedIdx + 5)),
        }
      : null;

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-accent-500/80" />
          <span>Good to spray</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400/80" />
          <span>Caution</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500/70" />
          <span>No-go</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-white/10" />
          <span>Outside window</span>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[720px] space-y-1">
          {/* Hour header */}
          <div className="grid gap-0.5" style={{ gridTemplateColumns: "7rem repeat(24, minmax(0,1fr))" }}>
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-[10px] text-white/40 text-center">
                {h % 3 === 0 ? (h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`) : ""}
              </div>
            ))}
          </div>

          {Array.from(byDay.entries()).map(([dayKey, entries]) => {
            const firstHour = entries[0].hour;
            // Build a 24-column row; fill in the hours that exist for this day.
            const byHourOfDay = new Map<number, { verdict: Verdict; idx: number; hour: HourlyForecast }>();
            entries.forEach((e) => byHourOfDay.set(new Date(e.hour.time).getHours(), e));

            return (
              <div
                key={dayKey}
                className="grid gap-0.5 items-center"
                style={{ gridTemplateColumns: "7rem repeat(24, minmax(0,1fr))" }}
              >
                <div className="text-sm text-white/80 font-medium pr-2">
                  {formatDayLabel(firstHour.time)}
                </div>
                {Array.from({ length: 24 }, (_, h) => {
                  const e = byHourOfDay.get(h);
                  if (!e) {
                    return (
                      <div
                        key={h}
                        className="h-6 rounded-sm bg-white/5"
                        aria-hidden
                      />
                    );
                  }
                  const isSel = selectedIdx === e.idx;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSelectedIdx(e.idx)}
                      title={`${formatHour(e.hour.time)} — ${verdictLabel(e.verdict)}`}
                      aria-label={`${formatHour(e.hour.time)} ${verdictLabel(e.verdict)}`}
                      className={`h-6 rounded-sm transition ${verdictClass(e.verdict)} ${
                        isSel ? "ring-2 ring-white" : ""
                      }`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected hour detail */}
      {selected && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-white/60">
                {formatDayLabel(selected.hour.time)} · {formatHour(selected.hour.time)}
              </div>
              <div className="text-lg font-semibold text-white">
                {verdictLabel(selected.verdict)}
              </div>
            </div>
            <button
              onClick={() => setSelectedIdx(null)}
              className="text-white/50 hover:text-white text-sm"
              aria-label="Close detail"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-1.5 text-sm">
            {selected.conditions.map((c) => (
              <li key={c.label} className="flex gap-2">
                <span
                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    c.ok
                      ? "bg-accent-400"
                      : c.caution
                      ? "bg-amber-400"
                      : "bg-red-500"
                  }`}
                  aria-hidden
                />
                <span className="text-white/80">
                  <span className="font-medium text-white">{c.label}:</span> {c.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
