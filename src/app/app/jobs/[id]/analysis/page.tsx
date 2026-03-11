"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

const MOCK_FINDINGS = [
  { type: "Hail Damage", severity: "High", count: 12, confidence: 0.94 },
  { type: "Wind Damage", severity: "Medium", count: 5, confidence: 0.87 },
  { type: "Granule Loss", severity: "Low", count: 8, confidence: 0.82 },
  { type: "Missing Shingle", severity: "High", count: 3, confidence: 0.91 },
];

export default function AnalysisPage() {
  const params = useParams();
  const [status, setStatus] = useState<"idle" | "processing" | "complete">("idle");

  function runAnalysis() {
    setStatus("processing");
    // Simulate analysis
    setTimeout(() => setStatus("complete"), 3000);
  }

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
      </div>

      {status === "idle" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
          <p className="text-sm text-neutral-500">Upload images first, then run AI analysis</p>
          <p className="text-xs text-neutral-400 mt-1">Job ID: {params.id}</p>
        </div>
      )}

      {status === "processing" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <div className="w-10 h-10 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-primary-900">Analyzing images...</p>
          <p className="text-xs text-neutral-400 mt-1">This may take a few minutes</p>
        </div>
      )}

      {status === "complete" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Total Findings</p>
              <p className="text-2xl font-bold text-primary-900 mt-1">28</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">High Severity</p>
              <p className="text-2xl font-bold text-red-600 mt-1">15</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Images Analyzed</p>
              <p className="text-2xl font-bold text-primary-900 mt-1">42</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Avg Confidence</p>
              <p className="text-2xl font-bold text-success-500 mt-1">89%</p>
            </div>
          </div>

          {/* Findings table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-primary-900">Damage Findings</h3>
            </div>
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
                {MOCK_FINDINGS.map((f, i) => (
                  <tr key={i} className="border-b border-neutral-50">
                    <td className="px-5 py-3 font-medium text-neutral-900">{f.type}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        f.severity === "High" ? "bg-red-100 text-red-700" :
                        f.severity === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-neutral-100 text-neutral-600"
                      }`}>{f.severity}</span>
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{f.count}</td>
                    <td className="px-5 py-3 text-neutral-600">{(f.confidence * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3D Model placeholder */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-primary-900">3D Roof Model</h3>
            </div>
            <div className="aspect-video bg-neutral-900 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-neutral-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313" />
                </svg>
                <p className="text-sm text-neutral-500">3D roof model will render here</p>
                <p className="text-xs text-neutral-600 mt-1">Three.js GLB viewer — available after photogrammetry</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
