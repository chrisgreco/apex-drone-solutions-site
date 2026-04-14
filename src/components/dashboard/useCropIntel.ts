"use client";

import { useEffect, useState } from "react";
import { PROFILE_STORAGE_KEY } from "./FarmPicker";
import type { CropId, CropStage } from "@/lib/farm-intel/crops";
import type { CropIntelResponse } from "@/app/api/crop-intel/route";

export type StoredProfile = {
  email: string;
  label: string;
  lat: number;
  lon: number;
  cropPrimary: CropId;
  cropStage: CropStage | null;
  acres: number | null;
};

/** Default demo profile — Hammonton blueberries. */
export const DEFAULT_PROFILE: StoredProfile = {
  email: "demo@agdronesnj.com",
  label: "Hammonton, NJ 08037",
  lat: 39.6365,
  lon: -74.7897,
  cropPrimary: "blueberry",
  cropStage: null,
  acres: null,
};

/**
 * Hook used by every deep-dive dashboard page:
 * - Hydrates profile from localStorage (demo fallback)
 * - Fetches /api/crop-intel for that profile
 * - Returns { profile, intel, loading, error, isDemo }
 */
export function useCropIntel() {
  const [profile, setProfile] = useState<StoredProfile>(DEFAULT_PROFILE);
  const [isDemo, setIsDemo] = useState(true);
  const [intel, setIntel] = useState<CropIntelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as StoredProfile;
      if (saved.lat && saved.lon && saved.cropPrimary) {
        setProfile(saved);
        setIsDemo(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const url = new URL("/api/crop-intel", window.location.origin);
        url.searchParams.set("lat", String(profile.lat));
        url.searchParams.set("lon", String(profile.lon));
        url.searchParams.set("label", profile.label);
        url.searchParams.set("crop", profile.cropPrimary);
        if (profile.cropStage) url.searchParams.set("stage", profile.cropStage);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Intel ${res.status}`);
        const data = (await res.json()) as CropIntelResponse;
        if (cancelled) return;
        setIntel(data);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unavailable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [profile]);

  return { profile, setProfile, setIsDemo, isDemo, intel, loading, error };
}
