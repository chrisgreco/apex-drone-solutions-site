"use client";

import { useState } from "react";
import { CROP_LIST, STAGE_LABEL, type CropId, type CropStage } from "@/lib/farm-intel/crops";
import { IconMail, IconMapPin, IconLeaf } from "@/components/Icons";

/**
 * Email gate for the NJ grower dashboard.
 *
 * Design: demo-first soft gate. The dashboard is already showing live data for
 * a default demo farm; this form unlocks personalization. 3 required fields
 * (email, ZIP, crop), 2 optional (stage, acres).
 *
 * On submit we:
 *   1. Geocode ZIP via Census.
 *   2. POST to /api/farm-profile.
 *   3. Persist the profile in localStorage so return visits skip the form.
 *   4. Call onSaved() so the parent can re-render with the personalized view.
 */

type SavedProfile = {
  email: string;
  label: string;
  lat: number;
  lon: number;
  cropPrimary: CropId;
  cropStage: CropStage | null;
  acres: number | null;
};

export const PROFILE_STORAGE_KEY = "nj-crop-dashboard:profile";

type Props = {
  onSaved: (profile: SavedProfile) => void;
  /** Called if the user cancels/closes the form (reverts to demo view). */
  onCancel?: () => void;
};

async function geocodeZip(zip: string): Promise<{ lat: number; lon: number; label: string } | null> {
  const z = zip.trim();
  if (!/^\d{5}$/.test(z)) return null;
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${z}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) return null;
    return {
      lat: Number(place.latitude),
      lon: Number(place.longitude),
      label: `${place["place name"]}, ${data["country abbreviation"] ?? "US"} ${z}`,
    };
  } catch {
    return null;
  }
}

export function FarmPicker({ onSaved, onCancel }: Props) {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [crop, setCrop] = useState<CropId>("blueberry");
  const [stage, setStage] = useState<CropStage | "">("");
  const [acres, setAcres] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const activeCrop = CROP_LIST.find((c) => c.id === crop)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const geo = await geocodeZip(zip);
    if (!geo) {
      setStatus("idle");
      setError("Couldn't find that ZIP. Double-check the 5-digit code.");
      return;
    }

    const payload = {
      email,
      lat: geo.lat,
      lon: geo.lon,
      label: geo.label,
      cropPrimary: crop,
      cropStage: stage || null,
      acres: acres.trim() ? Number(acres) : null,
    };

    try {
      const res = await fetch("/api/farm-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      return;
    }

    const saved: SavedProfile = {
      email: email.toLowerCase(),
      label: geo.label,
      lat: geo.lat,
      lon: geo.lon,
      cropPrimary: crop,
      cropStage: (stage || null) as CropStage | null,
      acres: acres.trim() ? Number(acres) : null,
    };
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* ignore */
    }
    setStatus("done");
    onSaved(saved);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="fp-email" className="block text-xs uppercase tracking-wider text-white/50 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              id="fp-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@yourfarm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-400/60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fp-zip" className="block text-xs uppercase tracking-wider text-white/50 mb-1">
            ZIP code <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              id="fp-zip"
              type="text"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="08037"
              pattern="\d{5}"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-400/60"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="fp-crop" className="block text-xs uppercase tracking-wider text-white/50 mb-1">
          Primary crop <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <IconLeaf className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <select
            id="fp-crop"
            value={crop}
            onChange={(e) => {
              setCrop(e.target.value as CropId);
              setStage("");
            }}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/60 appearance-none"
          >
            {CROP_LIST.map((c) => (
              <option key={c.id} value={c.id} className="bg-primary-950">
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="fp-stage" className="block text-xs uppercase tracking-wider text-white/50 mb-1">
            Current stage <span className="text-white/40">(optional)</span>
          </label>
          <select
            id="fp-stage"
            value={stage}
            onChange={(e) => setStage(e.target.value as CropStage | "")}
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-400/60 appearance-none"
          >
            <option value="" className="bg-primary-950">
              (auto-detect from forecast)
            </option>
            {activeCrop.stages.map((s) => (
              <option key={s} value={s} className="bg-primary-950">
                {STAGE_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fp-acres" className="block text-xs uppercase tracking-wider text-white/50 mb-1">
            Acres <span className="text-white/40">(optional)</span>
          </label>
          <input
            id="fp-acres"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            placeholder="e.g. 12"
            value={acres}
            onChange={(e) => setAcres(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-400/60"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex-1 px-5 py-3 rounded-lg bg-accent-500 hover:bg-accent-400 disabled:bg-white/10 disabled:text-white/40 text-black font-semibold transition"
        >
          {status === "submitting" ? "Unlocking…" : "Unlock my dashboard"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition"
          >
            Keep browsing demo
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <p className="text-[11px] text-white/40 leading-relaxed">
        We'll send one confirmation email, then only alert you when something actually
        matters for your crop — spray windows, frost nights, disease pressure. Unsubscribe
        in one click. We never share your email.
      </p>
    </form>
  );
}
