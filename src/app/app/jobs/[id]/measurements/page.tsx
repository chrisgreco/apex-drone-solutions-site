"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as turf from "@turf/turf";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("@/components/platform/maps/MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-neutral-100 rounded-xl animate-pulse flex items-center justify-center">
      <p className="text-xs text-neutral-400">Loading map...</p>
    </div>
  ),
});

interface RoofMeasurements {
  areaSqft: number;
  areaSqM: number;
  perimeterFt: number;
  perimeterM: number;
  longestEdgeFt: number;
  shortestEdgeFt: number;
  edgeCount: number;
  centroid: [number, number];
  edges: { from: [number, number]; to: [number, number]; lengthFt: number }[];
  estimatedSquares: number; // roofing squares (100 sqft each)
  pitch: string;
}

function calculateMeasurements(boundary: [number, number][]): RoofMeasurements {
  const polygon = turf.polygon([[...boundary, boundary[0]]]);
  const areaSqM = turf.area(polygon);
  const areaSqft = areaSqM * 10.7639;

  const edges: RoofMeasurements["edges"] = [];
  let perimeterM = 0;
  let longestM = 0;
  let shortestM = Infinity;

  for (let i = 0; i < boundary.length; i++) {
    const next = (i + 1) % boundary.length;
    const from = boundary[i];
    const to = boundary[next];
    const d = turf.distance(turf.point(from), turf.point(to), { units: "meters" });
    perimeterM += d;
    if (d > longestM) longestM = d;
    if (d < shortestM) shortestM = d;
    edges.push({
      from,
      to,
      lengthFt: Math.round(d * 3.28084 * 10) / 10,
    });
  }

  const centroidPt = turf.centroid(polygon);
  const centroid = turf.getCoord(centroidPt) as [number, number];

  return {
    areaSqft: Math.round(areaSqft),
    areaSqM: Math.round(areaSqM * 10) / 10,
    perimeterFt: Math.round(perimeterM * 3.28084),
    perimeterM: Math.round(perimeterM * 10) / 10,
    longestEdgeFt: Math.round(longestM * 3.28084 * 10) / 10,
    shortestEdgeFt: Math.round(shortestM * 3.28084 * 10) / 10,
    edgeCount: boundary.length,
    centroid,
    edges,
    estimatedSquares: Math.ceil(areaSqft / 100),
    pitch: "N/A (requires 3D model)",
  };
}

export default function MeasurementsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [boundary, setBoundary] = useState<[number, number][]>([]);
  const [measurements, setMeasurements] = useState<RoofMeasurements | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobAddress, setJobAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: job } = await supabase
        .from("jobs")
        .select("property_address, city, state, zip, roof_boundary")
        .eq("id", jobId)
        .single();

      if (job) {
        setJobAddress(
          [job.property_address, job.city, job.state, job.zip].filter(Boolean).join(", ")
        );
        if (job.roof_boundary && Array.isArray(job.roof_boundary) && job.roof_boundary.length >= 3) {
          const b = job.roof_boundary as [number, number][];
          setBoundary(b);
          setMeasurements(calculateMeasurements(b));
        }
      }
      setLoading(false);
    }
    load();
  }, [jobId]);

  async function handleSave() {
    if (!measurements) return;
    setSaving(true);
    try {
      const supabase = createClient();
      // Save to roof_models as measurement data
      await supabase.from("roof_models").upsert({
        job_id: jobId,
        format: "measurements",
        roof_area_sqft: measurements.areaSqft,
        primary_pitch: measurements.pitch,
        metadata: {
          perimeter_ft: measurements.perimeterFt,
          edge_count: measurements.edgeCount,
          longest_edge_ft: measurements.longestEdgeFt,
          shortest_edge_ft: measurements.shortestEdgeFt,
          estimated_squares: measurements.estimatedSquares,
          edges: measurements.edges.map((e) => ({
            from: e.from,
            to: e.to,
            length_ft: e.lengthFt,
          })),
        },
      }, { onConflict: "job_id" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <div className="w-10 h-10 border-3 border-neutral-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Loading measurements...</p>
        </div>
      </div>
    );
  }

  if (!measurements || boundary.length < 3) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary-900">Roof Measurements</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Automated measurements from boundary polygon</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
          <p className="text-sm text-neutral-500">Draw a roof boundary on the Map tab first</p>
          <p className="text-xs text-neutral-400 mt-1">Measurements are calculated from the boundary polygon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-primary-900">Roof Measurements</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Calculated from {boundary.length}-point boundary polygon via Turf.js
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-sm disabled:opacity-40"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Measurements"}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Roof Area</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">
            {measurements.areaSqft.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-400">sqft ({measurements.areaSqM} m&sup2;)</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Perimeter</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">
            {measurements.perimeterFt.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-400">ft ({measurements.perimeterM} m)</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Roofing Squares</p>
          <p className="text-2xl font-bold text-accent-600 mt-1">
            {measurements.estimatedSquares}
          </p>
          <p className="text-xs text-neutral-400">squares (100 sqft each)</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Roof Pitch</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">
            {measurements.pitch}
          </p>
          <p className="text-xs text-neutral-400">slope ratio</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Edge measurements table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="text-sm font-semibold text-primary-900">Edge Measurements</h3>
            <p className="text-xs text-neutral-400 mt-0.5">{measurements.edgeCount} edges detected</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-neutral-500">
                <th className="px-5 py-3 font-medium">Edge</th>
                <th className="px-5 py-3 font-medium text-right">Length</th>
              </tr>
            </thead>
            <tbody>
              {measurements.edges.map((edge, i) => (
                <tr key={i} className="border-b border-neutral-50">
                  <td className="px-5 py-2.5 text-neutral-700">
                    Edge {i + 1}
                    {edge.lengthFt === measurements.longestEdgeFt && (
                      <span className="ml-2 text-xs text-accent-500 font-medium">longest</span>
                    )}
                    {edge.lengthFt === measurements.shortestEdgeFt && (
                      <span className="ml-2 text-xs text-neutral-400 font-medium">shortest</span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-right font-mono text-neutral-900">
                    {edge.lengthFt} ft
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-700">Total Perimeter</td>
                <td className="px-5 py-3 text-right font-mono font-bold text-primary-900">
                  {measurements.perimeterFt} ft
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Map with measurements overlay */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="text-sm font-semibold text-primary-900">Boundary Map</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {measurements.areaSqft.toLocaleString()} sqft roof area
            </p>
          </div>
          <MapPreview
            address={jobAddress}
            boundary={boundary}
            heightClass="h-[400px]"
            interactive
          />
        </div>
      </div>

      {/* Material estimate */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 mt-6">
        <h3 className="text-sm font-semibold text-primary-900 mb-4">Material Estimate</h3>
        <p className="text-xs text-neutral-400 mb-3">Based on roof area with standard 10% waste factor</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-neutral-50 rounded-lg p-3">
            <p className="text-neutral-500 text-xs">Shingle Bundles</p>
            <p className="font-bold text-primary-900 text-lg mt-1">
              {Math.ceil(measurements.estimatedSquares * 3 * 1.1)}
            </p>
            <p className="text-xs text-neutral-400">3 bundles/square + 10%</p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-3">
            <p className="text-neutral-500 text-xs">Underlayment Rolls</p>
            <p className="font-bold text-primary-900 text-lg mt-1">
              {Math.ceil((measurements.areaSqft * 1.1) / 400)}
            </p>
            <p className="text-xs text-neutral-400">400 sqft/roll</p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-3">
            <p className="text-neutral-500 text-xs">Drip Edge</p>
            <p className="font-bold text-primary-900 text-lg mt-1">
              {Math.ceil(measurements.perimeterFt / 10)}
            </p>
            <p className="text-xs text-neutral-400">10 ft sections</p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-3">
            <p className="text-neutral-500 text-xs">Ridge Cap</p>
            <p className="font-bold text-primary-900 text-lg mt-1">
              {Math.ceil(measurements.longestEdgeFt / 25)}
            </p>
            <p className="text-xs text-neutral-400">25 ft/bundle estimate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
