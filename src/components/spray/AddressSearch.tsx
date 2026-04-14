"use client";

import { useState } from "react";
import { IconMapPin, IconNavigation } from "@/components/Icons";

/**
 * Address / ZIP search using the US Census Bureau geocoder.
 * Free, no API key, no rate limiting worth worrying about.
 * https://geocoding.geo.census.gov/geocoder/
 */

type Props = {
  onLocation: (loc: { lat: number; lon: number; label: string }) => void;
};

type CensusMatch = {
  matchedAddress: string;
  coordinates: { x: number; y: number }; // x=lon, y=lat
};

async function geocodeAddress(input: string): Promise<CensusMatch | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Use "onelineaddress" endpoint; supports full addresses and ZIP codes.
  const url = new URL(
    "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
  );
  url.searchParams.set("address", trimmed);
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("format", "json");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const match = data?.result?.addressMatches?.[0];
    if (!match) return null;
    return {
      matchedAddress: match.matchedAddress,
      coordinates: match.coordinates,
    };
  } catch {
    return null;
  }
}

/**
 * For bare 5-digit ZIP codes, fall back to a public ZIP→lat/lon endpoint.
 * Census geocoder is weak at bare ZIPs; Zippopotam.us is free and fast.
 */
async function geocodeZip(zip: string): Promise<CensusMatch | null> {
  const z = zip.trim();
  if (!/^\d{5}$/.test(z)) return null;
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${z}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) return null;
    return {
      matchedAddress: `${place["place name"]}, ${data["country abbreviation"] ?? "US"} ${z}`,
      coordinates: {
        x: Number(place.longitude),
        y: Number(place.latitude),
      },
    };
  } catch {
    return null;
  }
}

export function AddressSearch({ onLocation }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const q = input.trim();
    if (!q) return;
    setLoading(true);

    // Try ZIP first if the input looks like one
    const zipOnly = /^\d{5}$/.test(q) ? await geocodeZip(q) : null;
    const match = zipOnly ?? (await geocodeAddress(q));

    setLoading(false);
    if (!match) {
      setError("Couldn't find that address. Try a ZIP code or full street address.");
      return;
    }
    onLocation({
      lat: match.coordinates.y,
      lon: match.coordinates.x,
      label: match.matchedAddress,
    });
  }

  function handleUseMyLocation() {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: "Your current location",
        });
      },
      (err) => {
        setLoading(false);
        setError(`Location access denied (${err.message}).`);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
          <input
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            placeholder="Enter ZIP code or address (e.g. 08302 or 123 Farm Rd, Bridgeton NJ)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-400/60 focus:bg-white/10 transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-400 disabled:bg-white/10 disabled:text-white/40 text-black font-medium transition"
        >
          {loading ? "Searching…" : "Check"}
        </button>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition"
        >
          <IconNavigation className="w-4 h-4" />
          <span className="whitespace-nowrap">Use my location</span>
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
