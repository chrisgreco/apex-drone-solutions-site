import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { JobStatusBadge } from "@/components/platform/jobs/JobStatusBadge";
import { JOB_TYPE_LABELS, type Job } from "@/lib/types/platform";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const typedJobs = (jobs || []) as Job[];

  // Stats
  const active = typedJobs.filter((j) => !["complete", "cancelled"].includes(j.status)).length;
  const analyzing = typedJobs.filter((j) => j.status === "analyzing").length;
  const reportReady = typedJobs.filter((j) => j.status === "report_ready").length;

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Overview of your inspection jobs</p>
        </div>
        <Link href="/app/jobs/new" className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Active Jobs", value: active, color: "text-accent-500" },
          { label: "Analyzing", value: analyzing, color: "text-yellow-600" },
          { label: "Reports Ready", value: reportReady, color: "text-success-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-neutral-200 rounded-xl p-5">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-primary-900">Recent Jobs</h2>
        </div>
        {typedJobs.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-neutral-400 text-sm">No jobs yet.</p>
            <Link href="/app/jobs/new" className="text-accent-600 text-sm font-medium mt-2 inline-block">
              Create your first job
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-neutral-500">
                <th className="px-5 py-3 font-medium">Address</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Claim #</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {typedJobs.map((job) => (
                <tr key={job.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/app/jobs/${job.id}`} className="text-primary-900 font-medium hover:text-accent-600">
                      {job.property_address}
                    </Link>
                    {job.property_city && (
                      <span className="text-neutral-400 ml-1">
                        {job.property_city}, {job.property_state}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{JOB_TYPE_LABELS[job.job_type]}</td>
                  <td className="px-5 py-3"><JobStatusBadge status={job.status} /></td>
                  <td className="px-5 py-3 text-neutral-500">{job.claim_number || "—"}</td>
                  <td className="px-5 py-3 text-neutral-400">
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
