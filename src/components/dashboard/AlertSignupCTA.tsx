"use client";

import { useState } from "react";
import { FarmPicker } from "./FarmPicker";
import { IconMail } from "@/components/Icons";

type Props = {
  /** Short heading e.g. "Want a daily frost email?" */
  heading: string;
  /** One-sentence pitch describing what they'll receive. */
  pitch: string;
};

/**
 * Compact email opt-in CTA used on every deep tool page. Expands inline to
 * the full FarmPicker form when clicked. Created profiles default to all
 * alert types enabled; farmers can tune preferences later via the manage-
 * alerts link in any email footer.
 */
export function AlertSignupCTA({ heading, pitch }: Props) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="rounded-2xl border border-accent-500/30 bg-accent-500/10 p-6 text-center">
        <div className="text-xl font-semibold text-white mb-1">
          Check your inbox
        </div>
        <p className="text-white/70 text-sm">
          We just sent a confirmation link. Click it and you're in — one email
          per day at most, only when your forecast actually changes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-accent-500/30 bg-gradient-to-br from-accent-500/10 to-transparent p-6 md:p-8">
      <div className="flex items-start gap-3 mb-4">
        <IconMail className="w-6 h-6 text-accent-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
            {heading}
          </h3>
          <p className="text-white/70 text-sm">{pitch}</p>
        </div>
      </div>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-400 text-black font-semibold transition"
        >
          Set up my farm
        </button>
      ) : (
        <div className="mt-2">
          <FarmPicker
            onSaved={() => setSaved(true)}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
