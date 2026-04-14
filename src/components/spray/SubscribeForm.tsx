"use client";

import { useState } from "react";
import { IconMail } from "@/components/Icons";

type Props = {
  location: { lat: number; lon: number; label: string } | null;
};

export function SubscribeForm({ location }: Props) {
  const [email, setEmail] = useState("");
  const [farmName, setFarmName] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location) {
      setError("Pick a location first — use the search box or 'Use my location' above.");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/spray-alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          farmName: farmName || null,
          lat: location.lat,
          lon: location.lon,
          label: location.label,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription failed");
      }
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-accent-500/30 bg-accent-500/10 p-6 text-center">
        <div className="text-xl font-semibold text-white mb-2">Check your inbox</div>
        <p className="text-white/70 text-sm">
          We sent a confirmation link to <strong>{email}</strong>. Click it and you're in —
          we'll email you when a good spray window opens for{" "}
          <strong>{location?.label ?? "your farm"}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-white/70 mb-1" htmlFor="subscribe-email">
          Email
        </label>
        <div className="relative">
          <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
          <input
            id="subscribe-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@yourfarm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-400/60"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1" htmlFor="subscribe-farm">
          Farm name <span className="text-white/40">(optional)</span>
        </label>
        <input
          id="subscribe-farm"
          type="text"
          placeholder="e.g. Greco Family Farm"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-400/60"
        />
      </div>

      <div className="text-xs text-white/50">
        Alert location:{" "}
        <span className="text-white/80">
          {location ? location.label : "Pick a location above first"}
        </span>
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || !location || !email}
        className="w-full px-5 py-3 rounded-lg bg-accent-500 hover:bg-accent-400 disabled:bg-white/10 disabled:text-white/40 text-black font-semibold transition"
      >
        {status === "submitting" ? "Setting up…" : "Email me when conditions are good"}
      </button>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <p className="text-[11px] text-white/40 leading-relaxed">
        One email per day max, only when a 2+ hour spray window is forecast for your location.
        Unsubscribe in one click anytime. We never share your email.
      </p>
    </form>
  );
}
