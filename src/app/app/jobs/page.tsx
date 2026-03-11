import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { JobStatusBadge } from "@/components/platform/jobs/JobStatusBadge";
import { JOB_TYPE_LABELS, type Job } from "@/lib/types/platform";
import { formatDistanceToNow } from "date-fns";

export default async function JobsListPage() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  const typedJobs = (jobs || []) as Job[];

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Jobs</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {typedJobs.length} job{typedJobs.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/app/jobs/new" className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Job
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {typedJobs.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
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
                  <td className="px-5 py-3 text-neutral-500 capitalize">{job.priority}</td>
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
