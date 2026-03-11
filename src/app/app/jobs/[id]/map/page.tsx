"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@/lib/supabase/client";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface GeoPoint {
  lng: number;
  lat: number;
}

export default function MapPage() {
  const params = useParams();
  const jobId = params.id as string;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [jobAddress, setJobAddress] = useState<string | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);

  // Load job data to get address and existing boundary
  useEffect(() => {
    async function loadJob() {
      try {
        const supabase = createClient();
        const { data: job } = await supabase
          .from("jobs")
          .select("property_address, property_city, property_state, property_zip, roof_boundary")
          .eq("id", jobId)
          .single();

        if (job) {
          const parts = [job.property_address, job.property_city, job.property_state, job.property_zip].filter(Boolean);
          const fullAddress = parts.join(", ");
          setJobAddress(fullAddress || null);

          // If there's an existing boundary, load it
          if (job.roof_boundary && Array.isArray(job.roof_boundary) && job.roof_boundary.length > 0) {
            const existingPoints: GeoPoint[] = job.roof_boundary.map((p: [number, number]) => ({
              lng: p[0],
              lat: p[1],
            }));
            setPoints(existingPoints);
          }
        }
      } catch {
        // Silently fail — map still works without job data
      } finally {
        setLoadingJob(false);
      }
    }
    loadJob();
  }, [jobId]);

  // Update polygon source/layer on map when points change
  const updatePolygonOnMap = useCallback((map: mapboxgl.Map, currentPoints: GeoPoint[]) => {
    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add vertex markers
    currentPoints.forEach((pt, idx) => {
      const el = document.createElement("div");
      el.className = "polygon-vertex";
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "50%";
      el.style.background = idx === 0 ? "#f97316" : "#3b82f6";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([pt.lng, pt.lat])
        .addTo(map);
      markersRef.current.push(marker);
    });

    // Build GeoJSON for lines and fill
    const coords = currentPoints.map((p) => [p.lng, p.lat]);

    // Line (always show, even with just 2 points)
    const lineGeoJSON: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: currentPoints.length >= 2 ? [...coords, coords[0]] : coords,
      },
    };

    // Polygon fill (only if 3+ points)
    const polygonGeoJSON: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: currentPoints.length >= 3 ? [[...coords, coords[0]]] : [[]],
      },
    };

    const lineSource = map.getSource("polygon-line") as mapboxgl.GeoJSONSource | undefined;
    const fillSource = map.getSource("polygon-fill") as mapboxgl.GeoJSONSource | undefined;

    if (lineSource) {
      lineSource.setData(lineGeoJSON);
    }
    if (fillSource) {
      fillSource.setData(polygonGeoJSON);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainerRef.current || loadingJob) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-98.5795, 39.8283], // Center of US
      zoom: 4,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      // Add sources for polygon drawing
      map.addSource("polygon-fill", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[]] } },
      });

      map.addSource("polygon-line", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
      });

      // Polygon fill layer
      map.addLayer({
        id: "polygon-fill-layer",
        type: "fill",
        source: "polygon-fill",
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.2,
        },
      });

      // Polygon outline layer
      map.addLayer({
        id: "polygon-line-layer",
        type: "line",
        source: "polygon-line",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 2.5,
          "line-dasharray": [2, 1],
        },
      });

      // If we loaded existing points, draw them
      setPoints((prev) => {
        if (prev.length > 0) {
          updatePolygonOnMap(map, prev);
          // Fit to bounds of existing polygon
          const bounds = new mapboxgl.LngLatBounds();
          prev.forEach((p) => bounds.extend([p.lng, p.lat]));
          map.fitBounds(bounds, { padding: 100, maxZoom: 19 });
        }
        return prev;
      });
    });

    // Click handler to add points
    map.on("click", (e) => {
      const newPoint: GeoPoint = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      setPoints((prev) => {
        const updated = [...prev, newPoint];
        updatePolygonOnMap(map, updated);
        return updated;
      });
    });

    // Change cursor on hover
    map.getCanvas().style.cursor = "crosshair";

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [loadingJob, updatePolygonOnMap]);

  // Geocode job address on map load
  useEffect(() => {
    if (!MAPBOX_TOKEN || !jobAddress || !mapRef.current || loadingJob) return;
    // Only fly to address if there's no existing polygon
    if (points.length > 0) return;

    const map = mapRef.current;
    geocodeAddress(jobAddress).then((result) => {
      if (result) {
        map.flyTo({ center: [result.lng, result.lat], zoom: 19, duration: 2000 });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobAddress, loadingJob]);

  async function geocodeAddress(query: string): Promise<GeoPoint | null> {
    if (!MAPBOX_TOKEN) return null;
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lng, lat };
      }
    } catch {
      // Geocoding failed
    }
    return null;
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    setSearching(true);
    const result = await geocodeAddress(searchQuery);
    if (result && mapRef.current) {
      mapRef.current.flyTo({ center: [result.lng, result.lat], zoom: 19, duration: 2000 });
    }
    setSearching(false);
  }

  function handleClear() {
    setPoints([]);
    setSaved(false);
    if (mapRef.current) {
      updatePolygonOnMap(mapRef.current, []);
    }
  }

  function handleUndo() {
    setPoints((prev) => {
      const updated = prev.slice(0, -1);
      if (mapRef.current) {
        updatePolygonOnMap(mapRef.current, updated);
      }
      return updated;
    });
    setSaved(false);
  }

  async function handleSave() {
    if (points.length < 3) return;

    setSaving(true);
    setSaved(false);
    try {
      const supabase = createClient();
      const boundary = points.map((p) => [p.lng, p.lat]);
      const { error } = await supabase
        .from("jobs")
        .update({ roof_boundary: boundary })
        .eq("id", jobId);

      if (error) throw error;
      setSaved(true);
    } catch (err) {
      console.error("Failed to save boundary:", err);
      alert("Failed to save boundary. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // No token — show helpful placeholder
  if (!MAPBOX_TOKEN) {
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
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="aspect-[16/9] bg-neutral-50 flex items-center justify-center">
            <div className="text-center max-w-md px-6">
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
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                />
              </svg>
              <p className="text-sm font-medium text-neutral-600 mb-2">Mapbox Token Required</p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Add <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> to
                your <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-mono">.env.local</code> file to enable
                the map. You can get a free token at{" "}
                <a
                  href="https://account.mapbox.com/access-tokens/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-500 hover:underline"
                >
                  mapbox.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold text-primary-900">Roof Boundary</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Click on the map to place points and draw the roof outline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 mr-2">
            {points.length} point{points.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleUndo}
            disabled={points.length === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Undo
          </button>
          <button
            onClick={handleClear}
            disabled={points.length === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            disabled={points.length < 3 || saving}
            className="btn-primary text-xs py-1.5 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Boundary"}
          </button>
        </div>
      </div>

      {/* Map container */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex-1 relative min-h-0">
        {/* Search overlay */}
        <form
          onSubmit={handleSearch}
          className="absolute top-3 left-3 right-16 z-10 flex gap-2"
          style={{ maxWidth: "480px" }}
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={jobAddress || "Search for an address..."}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
            <svg
              className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="px-3 py-2 text-xs font-medium bg-white border border-neutral-200 rounded-lg shadow-lg hover:bg-neutral-50 disabled:opacity-40 transition-colors"
          >
            {searching ? "..." : "Go"}
          </button>
        </form>

        {/* Instructions overlay */}
        {points.length === 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm">
            Click on the map to start drawing the roof boundary
          </div>
        )}
        {points.length > 0 && points.length < 3 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm">
            Add at least {3 - points.length} more point{3 - points.length !== 1 ? "s" : ""} to complete the polygon
          </div>
        )}

        {/* Map */}
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
