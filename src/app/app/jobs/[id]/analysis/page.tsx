"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import type { AnalysisJob, DamageFinding, DamageType, Severity } from "@/lib/types/platform";

// ─── Helpers ────────────────────────────────────────────────

const DAMAGE_TYPE_LABELS: Record<DamageType, string> = {
  hail: "Hail Damage",
  wind: "Wind Damage",
  impact: "Impact Damage",
  granule_loss: "Granule Loss",
  cracking: "Cracking",
  missing_shingle: "Missing Shingle",
  flashing_damage: "Flashing Damage",
  ponding: "Ponding",
  debris: "Debris",
  mechanical: "Mechanical Damage",
  other: "Other",
};

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-neutral-100 text-neutral-600",
};

interface FindingSummary {
  type: DamageType;
  label: string;
  severity: Severity;
  count: number;
  avgConfidence: number;
}

function summarizeFindings(findings: DamageFinding[]): FindingSummary[] {
  const groups = new Map<string, { findings: DamageFinding[]; type: DamageType }>();

  for (const f of findings) {
    const key = `${f.damage_type}:${f.severity}`;
    if (!groups.has(key)) {
      groups.set(key, { findings: [], type: f.damage_type });
    }
    groups.get(key)!.findings.push(f);
  }

  return Array.from(groups.entries())
    .map(([key, { findings: group, type }]) => {
      const severity = key.split(":")[1] as Severity;
      return {
        type,
        label: DAMAGE_TYPE_LABELS[type] || type,
        severity,
        count: group.length,
        avgConfidence:
          group.reduce((sum, f) => sum + f.confidence, 0) / group.length,
      };
    })
    .sort((a, b) => {
      const sevOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return sevOrder[a.severity] - sevOrder[b.severity];
    });
}

// ─── Component ──────────────────────────────────────────────

export default function AnalysisPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [status, setStatus] = useState<"loading" | "idle" | "processing" | "complete" | "error">("loading");
  const [analysis, setAnalysis] = useState<AnalysisJob | null>(null);
  const [findings, setFindings] = useState<DamageFinding[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing analysis on mount
  const fetchAnalysis = useCallback(async () => {
    try {
      const res = await fetch(`/api/analysis/${jobId}`);
      if (!res.ok) {
        setStatus("idle");
        return;
      }

      const data = await res.json();

      if (!data.analysis) {
        setStatus("idle");
        return;
      }

      setAnalysis(data.analysis);
      setFindings(data.findings || []);

      if (data.analysis.status === "processing" || data.analysis.status === "queued") {
        setStatus("processing");
      } else if (data.analysis.status === "complete") {
        setStatus("complete");
      } else if (data.analysis.status === "failed") {
        setStatus("error");
        setError(data.analysis.error_message || "Analysis failed");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  }, [jobId]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  // Poll while processing
  useEffect(() => {
    if (status !== "processing") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/analysis/${jobId}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!data.analysis) return;

        setAnalysis(data.analysis);
        setFindings(data.findings || []);

        if (data.analysis.status === "complete") {
          setStatus("complete");
          clearInterval(interval);
        } else if (data.analysis.status === "failed") {
          setStatus("error");
          setError(data.analysis.error_message || "Analysis failed");
          clearInterval(interval);
        }
      } catch {
        // Keep polling on transient errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status, jobId]);

  // Run analysis
  async function runAnalysis() {
    setStatus("processing");
    setError(null);

    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Failed to start analysis");
        return;
      }

      setAnalysis(data.analysis);
      setFindings(data.findings || []);
      setStatus("complete");
    } catch {
      setStatus("error");
      setError("Failed to start analysis. Please try again.");
    }
  }

  // ─── Stats ──────────────────────────────────────────────

  const totalFindings = findings.length;
  const highSeverity = findings.filter(
    (f) => f.severity === "high" || f.severity === "critical"
  ).length;
  const imagesAnalyzed = analysis?.summary?.images_analyzed ?? 0;
  const avgConfidence = analysis?.summary?.avg_confidence
    ? Math.round(analysis.summary.avg_confidence * 100)
    : totalFindings > 0
      ? Math.round(
          (findings.reduce((s, f) => s + f.confidence, 0) / totalFindings) * 100
        )
      : 0;

  const summaries = summarizeFindings(findings);

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-primary-900">AI Analysis</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Automated damage detection and roof measurement
          </p>
        </div>
        {status === "idle" && (
          <button onClick={runAnalysis} className="btn-primary text-sm">
            Run Analysis
          </button>
        )}
        {status === "complete" && (
          <button onClick={runAnalysis} className="btn-primary text-sm">
            Re-run Analysis
          </button>
        )}
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <div className="w-10 h-10 border-3 border-neutral-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Loading analysis data...</p>
        </div>
      )}

      {/* Idle state */}
      {status === "idle" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <svg
            className="w-12 h-12 text-neutral-300 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
            />
          </svg>
          <p className="text-sm text-neutral-500">
            Upload images first, then run AI analysis
          </p>
          <p className="text-xs text-neutral-400 mt-1">Job ID: {jobId}</p>
        </div>
      )}

      {/* Processing state */}
      {status === "processing" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <div className="w-10 h-10 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-primary-900">
            Analyzing images...
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            This may take a few minutes
          </p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="bg-white border border-red-200 rounded-xl p-12 text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-medium text-red-700 mb-1">
            Analysis Failed
          </p>
          <p className="text-xs text-neutral-500">{error}</p>
          <button
            onClick={runAnalysis}
            className="btn-primary text-sm mt-4"
          >
            Retry Analysis
          </button>
        </div>
      )}

      {/* Complete state */}
      {status === "complete" && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Total Findings</p>
              <p className="text-2xl font-bold text-primary-900 mt-1">
                {totalFindings}
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">High Severity</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {highSeverity}
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Images Analyzed</p>
              <p className="text-2xl font-bold text-primary-900 mt-1">
                {imagesAnalyzed}
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Avg Confidence</p>
              <p className="text-2xl font-bold text-success-500 mt-1">
                {avgConfidence}%
              </p>
            </div>
          </div>

          {/* Findings table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-primary-900">
                Damage Findings
              </h3>
            </div>
            {summaries.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-neutral-500">
                  No damage findings detected
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 text-left text-neutral-500">
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Severity</th>
                    <th className="px-5 py-3 font-medium">Count</th>
                    <th className="px-5 py-3 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((s, i) => (
                    <tr key={i} className="border-b border-neutral-50">
                      <td className="px-5 py-3 font-medium text-neutral-900">
                        {s.label}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${SEVERITY_STYLES[s.severity]}`}
                        >
                          {s.severity}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-neutral-600">{s.count}</td>
                      <td className="px-5 py-3 text-neutral-600">
                        {Math.round(s.avgConfidence * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Detailed findings */}
          {findings.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h3 className="text-sm font-semibold text-primary-900">
                  Detailed Findings
                </h3>
              </div>
              <div className="divide-y divide-neutral-50">
                {findings.map((f) => (
                  <div key={f.id} className="px-5 py-3 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-900">
                          {DAMAGE_TYPE_LABELS[f.damage_type] || f.damage_type}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${SEVERITY_STYLES[f.severity]}`}
                        >
                          {f.severity}
                        </span>
                      </div>
                      {f.notes && (
                        <p className="text-xs text-neutral-500 line-clamp-2">
                          {f.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-neutral-700">
                        {Math.round(f.confidence * 100)}%
                      </p>
                      <p className="text-xs text-neutral-400">confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3D Model placeholder */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-primary-900">
                3D Roof Model
              </h3>
            </div>
            <div className="aspect-video bg-neutral-900 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-neutral-600 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313"
                  />
                </svg>
                <p className="text-sm text-neutral-500">
                  3D roof model will render here
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  Three.js GLB viewer -- available after photogrammetry
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
