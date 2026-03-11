"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Finding {
  damage_type: string;
  severity: string;
  confidence: number;
}

interface JobData {
  property_address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  created_at: string;
}

const DAMAGE_LABELS: Record<string, string> = {
  hail: "Hail",
  wind: "Wind",
  granule_loss: "Granule Loss",
  missing_shingle: "Missing Shingle",
  crack: "Crack",
  ponding: "Ponding",
  flashing: "Flashing",
  debris: "Debris",
  other: "Other",
};

export default function ReportPage() {
  const params = useParams();
  const jobId = params.id as string;
  const supabase = createClient();

  const [generating, setGenerating] = useState(false);
  const [ready, setReady] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [job, setJob] = useState<JobData | null>(null);
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    async function load() {
      // Load job data
      const { data: jobData } = await supabase
        .from("jobs")
        .select("property_address, city, state, zip, created_at")
        .eq("id", jobId)
        .single();
      if (jobData) setJob(jobData);

      // Load image count
      const { count } = await supabase
        .from("job_images")
        .select("id", { count: "exact", head: true })
        .eq("job_id", jobId);
      setImageCount(count ?? 0);

      // Check for existing analysis
      const { data: analysis } = await supabase
        .from("analysis_jobs")
        .select("id, status")
        .eq("job_id", jobId)
        .eq("status", "complete")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (analysis) {
        const { data: findingsData } = await supabase
          .from("damage_findings")
          .select("damage_type, severity, confidence")
          .eq("analysis_job_id", analysis.id);
        if (findingsData) setFindings(findingsData);

        // Check for existing report
        const { data: report } = await supabase
          .from("reports")
          .select("id")
          .eq("job_id", jobId)
          .limit(1)
          .single();
        if (report) setReady(true);
      }
    }
    load();
  }, [jobId, supabase]);

  async function generateReport() {
    setGenerating(true);

    // Save report record
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("reports").insert({
      job_id: jobId,
      format: "pdf",
      generated_by: user?.id,
      metadata: {
        findings_count: findings.length,
        image_count: imageCount,
        generated_at: new Date().toISOString(),
      },
    });

    // Update job status
    await supabase.from("jobs").update({ status: "report_ready" }).eq("id", jobId);

    // Simulate PDF generation time
    await new Promise((r) => setTimeout(r, 2000));

    setGenerating(false);
    setReady(true);
  }

  const hasAnalysis = findings.length > 0;

  // Aggregate findings by damage type
  const damageSummary = findings.reduce<Record<string, { count: number; severity: string }>>((acc, f) => {
    if (!acc[f.damage_type]) acc[f.damage_type] = { count: 0, severity: f.severity };
    acc[f.damage_type].count++;
    if (f.severity === "critical" || (f.severity === "high" && acc[f.damage_type].severity !== "critical")) {
      acc[f.damage_type].severity = f.severity;
    }
    return acc;
  }, {});

  const severityColor = (s: string) =>
    s === "critical" || s === "high" ? "text-red-600" :
    s === "medium" ? "text-yellow-600" : "text-orange-500";

  const address = job
    ? `${job.property_address}${job.city ? `, ${job.city}` : ""}${job.state ? `, ${job.state}` : ""} ${job.zip || ""}`
    : "Loading...";

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-primary-900">Report</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Generate and export carrier-grade inspection reports
          </p>
        </div>
        {!ready && !generating && hasAnalysis && (
          <button onClick={generateReport} className="btn-primary text-sm">
            Generate Report
          </button>
        )}
      </div>

      {!ready && !generating && !hasAnalysis && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm text-neutral-500">Run analysis first, then generate the report</p>
          <p className="text-xs text-neutral-400 mt-1">Job ID: {jobId}</p>
        </div>
      )}

      {!ready && !generating && hasAnalysis && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-accent-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm text-neutral-700 font-medium">Analysis complete with {findings.length} findings</p>
          <p className="text-xs text-neutral-400 mt-1">Click &quot;Generate Report&quot; to compile the inspection report</p>
        </div>
      )}

      {generating && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <div className="w-10 h-10 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-primary-900">Generating report...</p>
          <p className="text-xs text-neutral-400 mt-1">Compiling findings, imagery, and measurements</p>
        </div>
      )}

      {ready && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary-900">Property Inspection Report</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-500">
                Ready
              </span>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Property Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Address</p>
                    <p className="font-medium text-neutral-900">{address}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Inspection Date</p>
                    <p className="font-medium text-neutral-900">
                      {job ? new Date(job.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "..."}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Images Analyzed</p>
                    <p className="font-medium text-neutral-900">{imageCount}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Total Findings</p>
                    <p className="font-medium text-neutral-900">{findings.length}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-6">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Damage Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(damageSummary).map(([type, data]) => (
                    <div key={type} className="bg-neutral-50 rounded-lg p-3 text-center">
                      <p className={`text-xl font-bold ${severityColor(data.severity)}`}>{data.count}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{DAMAGE_LABELS[type] || type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-primary-900 mb-4">Export</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </button>
              <button className="btn-secondary text-sm">
                HTML Report
              </button>
              <button className="btn-secondary text-sm">
                Xactimate Export (.ESX)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
