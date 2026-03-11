import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { JobStatusBadge } from "@/components/platform/jobs/JobStatusBadge";
import { JOB_TYPE_LABELS, type Job } from "@/lib/types/platform";
import { format } from "date-fns";
import Link from "next/link";

export default async function JobOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) notFound();

  const typedJob = job as Job;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary-900">{typedJob.property_address}</h1>
          {typedJob.property_city && (
            <p className="text-sm text-neutral-500 mt-0.5">
              {typedJob.property_city}, {typedJob.property_state} {typedJob.property_zip}
            </p>
          )}
        </div>
        <JobStatusBadge status={typedJob.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Details */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-primary-900 mb-4">Job Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Type</dt>
              <dd className="font-medium text-neutral-900">{JOB_TYPE_LABELS[typedJob.job_type]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Claim #</dt>
              <dd className="font-medium text-neutral-900">{typedJob.claim_number || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Priority</dt>
              <dd className="font-medium text-neutral-900 capitalize">{typedJob.priority}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Created</dt>
              <dd className="font-medium text-neutral-900">{format(new Date(typedJob.created_at), "MMM d, yyyy")}</dd>
            </div>
            {typedJob.due_date && (
              <div className="flex justify-between">
                <dt className="text-neutral-500">Due</dt>
                <dd className="font-medium text-neutral-900">{format(new Date(typedJob.due_date), "MMM d, yyyy")}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Next steps */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-primary-900 mb-4">Next Steps</h2>
          <div className="space-y-3">
            {typedJob.status === "setup" && (
              <>
                <StepCard
                  step="1"
                  title="Define Roof Boundary"
                  desc="Draw the roof outline on the map"
                  href={`/app/jobs/${id}/map`}
                  active
                />
                <StepCard step="2" title="Upload Images" desc="Upload drone imagery" href={`/app/jobs/${id}/upload`} />
                <StepCard step="3" title="Run Analysis" desc="AI damage detection" href={`/app/jobs/${id}/analysis`} />
                <StepCard step="4" title="Generate Report" desc="Create the final report" href={`/app/jobs/${id}/report`} />
              </>
            )}
            {typedJob.status === "ready_to_fly" && (
              <StepCard step="2" title="Upload Images" desc="Upload drone imagery" href={`/app/jobs/${id}/upload`} active />
            )}
            {typedJob.status === "uploading" && (
              <StepCard step="3" title="Run Analysis" desc="Trigger AI analysis" href={`/app/jobs/${id}/analysis`} active />
            )}
            {typedJob.status === "report_ready" && (
              <StepCard step="4" title="View Report" desc="Download the final report" href={`/app/jobs/${id}/report`} active />
            )}
            {typedJob.status === "complete" && (
              <p className="text-sm text-success-500 font-medium">This job is complete.</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {typedJob.notes && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 mt-6">
          <h2 className="text-sm font-semibold text-primary-900 mb-2">Notes</h2>
          <p className="text-sm text-neutral-600 whitespace-pre-wrap">{typedJob.notes}</p>
        </div>
      )}
    </div>
  );
}

function StepCard({
  step,
  title,
  desc,
  href,
  active,
}: {
  step: string;
  title: string;
  desc: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        active
          ? "border-accent-200 bg-accent-50 hover:border-accent-300"
          : "border-neutral-100 hover:border-neutral-200"
      }`}
    >
      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
        active ? "bg-accent-500 text-white" : "bg-neutral-100 text-neutral-400"
      }`}>
        {step}
      </span>
      <div>
        <p className={`text-sm font-medium ${active ? "text-accent-700" : "text-neutral-600"}`}>{title}</p>
        <p className="text-xs text-neutral-400">{desc}</p>
      </div>
    </Link>
  );
}
