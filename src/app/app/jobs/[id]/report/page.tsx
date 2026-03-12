"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { generatePDFReport } from "@/lib/exports/pdf-report";
import { generateESXFile } from "@/lib/exports/xactimate-esx";
import * as turf from "@turf/turf";

const MapPreview = dynamic(() => import("@/components/platform/maps/MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-neutral-100 rounded-xl animate-pulse flex items-center justify-center">
      <p className="text-xs text-neutral-400">Loading map...</p>
    </div>
  ),
});

interface Finding {
  damage_type: string;
  severity: string;
  confidence: number;
  notes?: string | null;
}

interface JobData {
  property_address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  created_at: string;
  roof_boundary: [number, number][] | null;
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
        .select("property_address, city, state, zip, created_at, roof_boundary")
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
          .select("damage_type, severity, confidence, notes")
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

  // Calculate measurements from boundary if available
  const measurements = job?.roof_boundary && Array.isArray(job.roof_boundary) && job.roof_boundary.length >= 3
    ? (() => {
        const b = job.roof_boundary as [number, number][];
        const polygon = turf.polygon([[...b, b[0]]]);
        const areaSqM = turf.area(polygon);
        const areaSqft = Math.round(areaSqM * 10.7639);
        let perimeterM = 0;
        for (let i = 0; i < b.length; i++) {
          const next = (i + 1) % b.length;
          perimeterM += turf.distance(turf.point(b[i]), turf.point(b[next]), { units: "meters" });
        }
        return {
          areaSqft,
          perimeterFt: Math.round(perimeterM * 3.28084),
          estimatedSquares: Math.ceil(areaSqft / 100),
          edges: b.map((_, i) => {
            const next = (i + 1) % b.length;
            return { lengthFt: Math.round(turf.distance(turf.point(b[i]), turf.point(b[next]), { units: "meters" }) * 3.28084 * 10) / 10 };
          }),
        };
      })()
    : null;

  function handleDownloadPDF() {
    if (!job) return;
    const doc = generatePDFReport({
      jobId,
      address,
      inspectionDate: new Date(job.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      imageCount,
      findings,
      measurements,
    });
    doc.save(`inspection-report-${jobId.slice(0, 8)}.pdf`);
  }

  async function handleDownloadESX() {
    if (!job) return;
    const blob = await generateESXFile({
      jobId,
      address: job.property_address,
      city: job.city || "",
      state: job.state || "",
      zip: job.zip || "",
      inspectionDate: new Date(job.created_at).toISOString().split("T")[0],
      findings,
      measurements,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xactimate-${jobId.slice(0, 8)}.esx`;
    a.click();
    URL.revokeObjectURL(url);
  }

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

              {/* Property Satellite Map */}
              <div className="border-t border-neutral-100 pt-6">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Property Overview</h4>
                <MapPreview
                  address={address}
                  boundary={
                    job?.roof_boundary && Array.isArray(job.roof_boundary) && job.roof_boundary.length >= 3
                      ? (job.roof_boundary as [number, number][])
                      : undefined
                  }
                  heightClass="h-[300px]"
                />
              </div>

              {/* Roof Measurements */}
              {measurements && (
                <div className="border-t border-neutral-100 pt-6">
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Roof Measurements</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-neutral-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-primary-900">{measurements.areaSqft.toLocaleString()}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">sqft</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-primary-900">{measurements.perimeterFt.toLocaleString()}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">ft perimeter</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-accent-600">{measurements.estimatedSquares}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">roofing squares</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-primary-900">{measurements.edges.length}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">edges</p>
                    </div>
                  </div>
                </div>
              )}

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
              <button onClick={handleDownloadPDF} className="btn-primary text-sm inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </button>
              <button onClick={handleDownloadESX} className="btn-secondary text-sm inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Xactimate Export (.ESX)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
