"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function MapPage() {
  const params = useParams();
  const [address] = useState("");

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-primary-900">Roof Boundary</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Draw the roof outline on the map to define the inspection area
          </p>
        </div>
      </div>

      {/* Map placeholder - Mapbox integration */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="aspect-[16/9] bg-neutral-100 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            <p className="text-sm text-neutral-400 font-medium">Map View</p>
            <p className="text-xs text-neutral-300 mt-1">
              Mapbox integration — add NEXT_PUBLIC_MAPBOX_TOKEN to enable
            </p>
            <p className="text-xs text-neutral-300 mt-0.5">
              Job ID: {params.id}
            </p>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between">
          <p className="text-xs text-neutral-400">{address || "Search for an address or click to place a pin"}</p>
          <button className="btn-primary text-xs py-1.5 px-3" disabled>Save Boundary</button>
        </div>
      </div>
    </div>
  );
}
