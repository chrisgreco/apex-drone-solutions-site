"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { JOB_TYPES, JOB_TYPE_LABELS, PRIORITIES, type JobType, type Priority } from "@/lib/types/platform";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { data: job, error: insertError } = await supabase
      .from("jobs")
      .insert({
        created_by: user.id,
        job_type: form.get("job_type") as JobType,
        property_address: form.get("property_address") as string,
        city: form.get("property_city") as string || null,
        state: form.get("property_state") as string || null,
        zip: form.get("property_zip") as string || null,
        claim_number: form.get("claim_number") as string || null,
        priority: form.get("priority") as Priority,
        notes: form.get("notes") as string || null,
        status: "setup",
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/app/jobs/${job.id}`);
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-primary-900 mb-1">Create New Job</h1>
      <p className="text-sm text-neutral-500 mb-8">Set up a new property inspection job</p>

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
        {/* Job Type */}
        <div>
          <label htmlFor="job_type" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Job Type *
          </label>
          <select
            id="job_type"
            name="job_type"
            required
            className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{JOB_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="property_address" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Property Address *
          </label>
          <input
            id="property_address"
            name="property_address"
            type="text"
            required
            placeholder="123 Main Street"
            className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          />
        </div>

        {/* City / State / Zip */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="property_city" className="block text-sm font-medium text-neutral-700 mb-1.5">City</label>
            <input id="property_city" name="property_city" type="text" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
          </div>
          <div>
            <label htmlFor="property_state" className="block text-sm font-medium text-neutral-700 mb-1.5">State</label>
            <input id="property_state" name="property_state" type="text" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
          </div>
          <div>
            <label htmlFor="property_zip" className="block text-sm font-medium text-neutral-700 mb-1.5">ZIP</label>
            <input id="property_zip" name="property_zip" type="text" className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
          </div>
        </div>

        {/* Claim Number */}
        <div>
          <label htmlFor="claim_number" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Claim Number
          </label>
          <input
            id="claim_number"
            name="claim_number"
            type="text"
            placeholder="Optional"
            className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1.5">Priority</label>
          <select
            id="priority"
            name="priority"
            className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1.5">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Special instructions, scope, or additional context..."
            className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-y"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? "Creating..." : "Create Job"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
