import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { JobStatusBadge } from "@/components/platform/jobs/JobStatusBadge";
import { JOB_TYPE_LABELS, type Job } from "@/lib/types/platform";
import { formatDistanceToNow } from "date-fns";
import PropertyMap from "@/components/platform/maps/PropertyMap";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const typedJobs = (jobs || []) as Job[];

  // Stats
  const active = typedJobs.filter((j) => !["complete", "archived"].includes(j.status)).length;
  const analyzing = typedJobs.filter((j) => j.status === "analyzing").length;
  const reportReady = typedJobs.filter((j) => j.status === "report_ready").length;
  const complete = typedJobs.filter((j) => j.status === "complete").length;

  // Get analysis counts
  const { count: totalFindings } = await supabase
    .from("damage_findings")
    .select("id", { count: "exact", head: true });

  const { count: totalImages } = await supabase
    .from("job_images")
    .select("id", { count: "exact", head: true });

  // Most recent job with boundary for map preview
  const recentWithBoundary = typedJobs.find(
    (j) => j.roof_boundary && Array.isArray(j.roof_boundary) && j.roof_boundary.length >= 3
  );

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Active Jobs", value: active, color: "text-accent-500" },
          { label: "Analyzing", value: analyzing, color: "text-yellow-600" },
          { label: "Reports Ready", value: reportReady, color: "text-success-500" },
          { label: "Completed", value: complete, color: "text-primary-900" },
          { label: "Images", value: totalImages || 0, color: "text-primary-900" },
          { label: "Findings", value: totalFindings || 0, color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-neutral-200 rounded-xl p-4">
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recent activity map */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-primary-900">Latest Property</h2>
          </div>
          {recentWithBoundary ? (
            <PropertyMap
              address={[recentWithBoundary.property_address, recentWithBoundary.city, recentWithBoundary.state, recentWithBoundary.zip].filter(Boolean).join(", ")}
              boundary={recentWithBoundary.roof_boundary as unknown as [number, number][]}
              heightClass="h-[300px]"
            />
          ) : typedJobs.length > 0 ? (
            <PropertyMap
              address={[typedJobs[0].property_address, typedJobs[0].city, typedJobs[0].state, typedJobs[0].zip].filter(Boolean).join(", ")}
              heightClass="h-[300px]"
            />
          ) : (
            <div className="h-[300px] bg-neutral-50 flex items-center justify-center">
              <p className="text-sm text-neutral-400">Create a job to see it on the map</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-primary-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/app/jobs/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 hover:border-accent-200 hover:bg-accent-50 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-neutral-700">New Inspection</p>
                <p className="text-xs text-neutral-400">Start a new roof inspection</p>
              </div>
            </Link>

            {typedJobs.length > 0 && (
              <Link
                href={`/app/jobs/${typedJobs[0].id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 hover:border-accent-200 hover:bg-accent-50 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-neutral-700">Continue Latest</p>
                  <p className="text-xs text-neutral-400">{typedJobs[0].property_address}</p>
                </div>
              </Link>
            )}

            <div className="pt-2 border-t border-neutral-100">
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Platform</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-50 rounded-lg p-2 text-center">
                  <p className="font-medium text-neutral-600">AI Analysis</p>
                  <p className="text-neutral-400">Claude Vision</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-2 text-center">
                  <p className="font-medium text-neutral-600">Exports</p>
                  <p className="text-neutral-400">PDF + ESX</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-2 text-center">
                  <p className="font-medium text-neutral-600">Flight Plans</p>
                  <p className="text-neutral-400">KML Export</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-2 text-center">
                  <p className="font-medium text-neutral-600">Measurements</p>
                  <p className="text-neutral-400">Turf.js</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-primary-900">Recent Jobs</h2>
          <Link href="/app/jobs" className="text-xs text-accent-500 hover:text-accent-600 font-medium">
            View All &rarr;
          </Link>
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
                <th className="px-5 py-3 font-medium">Priority</th>
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
                    {job.city && (
                      <span className="text-neutral-400 ml-1">
                        {job.city}, {job.state}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{JOB_TYPE_LABELS[job.job_type]}</td>
                  <td className="px-5 py-3"><JobStatusBadge status={job.status} /></td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      job.priority === "urgent" ? "bg-red-100 text-red-700" :
                      job.priority === "high" ? "bg-orange-100 text-orange-700" :
                      job.priority === "normal" ? "bg-blue-100 text-blue-700" :
                      "bg-neutral-100 text-neutral-600"
                    }`}>
                      {job.priority}
                    </span>
                  </td>
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
