"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (data?.full_name) setFullName(data.full_name);
    }
    load();
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, updated_at: new Date().toISOString() });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h2 className="text-lg font-bold text-primary-900 mb-1">Settings</h2>
      <p className="text-sm text-neutral-500 mb-6">
        Manage your account and preferences
      </p>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-primary-900">Profile</h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border border-neutral-100 rounded-lg text-sm bg-neutral-50 text-neutral-400"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Email is managed through your authentication provider
            </p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-primary-900">Notifications</h3>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-neutral-300 text-accent-500 focus:ring-accent-500"
            />
            <span className="text-sm text-neutral-700">Email me when analysis is complete</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-neutral-300 text-accent-500 focus:ring-accent-500"
            />
            <span className="text-sm text-neutral-700">Email me when a report is ready</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary text-sm">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span className="text-sm text-success-500 font-medium">
              Settings saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
