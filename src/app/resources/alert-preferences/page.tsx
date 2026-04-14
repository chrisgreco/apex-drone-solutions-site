"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { IconMail, IconArrowRight } from "@/components/Icons";

type AlertPrefs = {
  spray_window?: boolean;
  frost?: boolean;
  disease?: boolean;
  chill?: boolean;
  pollination?: boolean;
  [k: string]: boolean | undefined;
};

type Profile = {
  email: string;
  farm_name: string | null;
  location_label: string | null;
  crop_primary: string | null;
  alert_prefs: AlertPrefs;
};

const PREF_LABELS: { key: keyof AlertPrefs; label: string; description: string }[] = [
  {
    key: "spray_window",
    label: "Spray window alerts",
    description:
      "Email when a 2+ hour drone-safe spray window opens in your 24-hour forecast.",
  },
  {
    key: "frost",
    label: "Frost / freeze warnings",
    description:
      "Email when the forecast threatens your crop's stage-specific damage or kill temperature.",
  },
  {
    key: "disease",
    label: "Disease pressure alerts",
    description:
      "Email when a disease infection event (mummy berry, brown rot, fire blight, late blight…) is predicted at HIGH or EXTREME risk.",
  },
  {
    key: "chill",
    label: "Chill hour milestones",
    description:
      "One-time email when your variety's chill requirement is satisfied for the dormant season.",
  },
  {
    key: "pollination",
    label: "Pollination window",
    description:
      "Email during bloom when a great day for bee activity is 2+ days out, so you can move hives.",
  },
];

function AlertPreferencesInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prefs, setPrefs] = useState<AlertPrefs>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing token. Use the 'Manage alerts' link in any email we've sent you.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function run() {
      try {
        const res = await fetch(`/api/alert-preferences?token=${token}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(data.error || "Couldn't load preferences");
        setProfile(data);
        setPrefs(data.alert_prefs || {});
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function save() {
    if (!token) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/alert-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, alert_prefs: prefs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <GridBackground />
      <section className="px-6 md:px-8 pt-28 md:pt-32 pb-10">
        <div className="container-narrow max-w-3xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-medium mb-5">
              <IconMail className="w-3.5 h-3.5" />
              Alert preferences
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Manage your email alerts
            </h1>
            {profile && (
              <p className="text-white/70 mb-8">
                Signed in as <span className="text-white font-medium">{profile.email}</span>
                {profile.location_label && (
                  <> · {profile.location_label}</>
                )}
              </p>
            )}

            {loading && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-white/60">
                Loading your preferences…
              </div>
            )}

            {error && !loading && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
                <div className="font-semibold mb-1">Couldn't load preferences</div>
                <div className="text-sm">{error}</div>
              </div>
            )}

            {profile && !loading && !error && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 space-y-4">
                {PREF_LABELS.map(({ key, label, description }) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={!!prefs[key]}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, [key]: e.target.checked }))
                      }
                      className="mt-1 w-4 h-4 rounded accent-accent-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-accent-300 transition">
                        {label}
                      </div>
                      <div className="text-sm text-white/55">{description}</div>
                    </div>
                  </label>
                ))}

                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-400 disabled:bg-white/10 disabled:text-white/40 text-black font-semibold transition"
                  >
                    {saving ? "Saving…" : "Save preferences"}
                  </button>
                  {saved && (
                    <span className="text-accent-400 text-sm font-medium">
                      ✓ Saved
                    </span>
                  )}
                  <Link
                    href={`/api/spray-alerts/unsubscribe?token=${token}`}
                    className="text-sm text-white/50 hover:text-red-400 transition"
                  >
                    Unsubscribe from everything
                  </Link>
                </div>

                <p className="text-xs text-white/40 pt-2 border-t border-white/5">
                  Changes apply to the next daily alert check (runs ~5 AM ET). You can
                  unsubscribe from everything in one click at any time.
                </p>
              </div>
            )}
          </FadeIn>

          <div className="mt-8 text-center">
            <Link
              href="/resources/nj-crop-dashboard"
              className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 font-medium"
            >
              Back to dashboard
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function AlertPreferencesPage() {
  return (
    <Suspense fallback={null}>
      <AlertPreferencesInner />
    </Suspense>
  );
}
