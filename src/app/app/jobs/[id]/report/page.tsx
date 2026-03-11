"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function ReportPage() {
  const params = useParams();
  const [generating, setGenerating] = useState(false);
  const [ready, setReady] = useState(false);

  function generateReport() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setReady(true);
    }, 2000);
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
        {!ready && !generating && (
          <button onClick={generateReport} className="btn-primary text-sm">
            Generate Report
          </button>
        )}
      </div>

      {!ready && !generating && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm text-neutral-500">Run analysis first, then generate the report</p>
          <p className="text-xs text-neutral-400 mt-1">Job ID: {params.id}</p>
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
          {/* Report preview */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary-900">Property Inspection Report</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-500">
                Ready
              </span>
            </div>

            {/* Report content preview */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Property Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Address</p>
                    <p className="font-medium text-neutral-900">123 Main Street, Dallas, TX 75201</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Inspection Date</p>
                    <p className="font-medium text-neutral-900">March 10, 2026</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Roof Area</p>
                    <p className="font-medium text-neutral-900">2,450 sq ft</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Primary Pitch</p>
                    <p className="font-medium text-neutral-900">6/12</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-6">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Damage Summary</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Hail", count: 12, color: "text-red-600" },
                    { label: "Wind", count: 5, color: "text-yellow-600" },
                    { label: "Granule Loss", count: 8, color: "text-orange-500" },
                    { label: "Missing", count: 3, color: "text-red-600" },
                  ].map((d) => (
                    <div key={d.label} className="bg-neutral-50 rounded-lg p-3 text-center">
                      <p className={`text-xl font-bold ${d.color}`}>{d.count}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Export options */}
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
