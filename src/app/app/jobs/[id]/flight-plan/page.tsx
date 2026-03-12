"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import { createClient } from "@/lib/supabase/client";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Waypoint {
  lng: number;
  lat: number;
  altitude: number;
  heading: number;
  index: number;
}

interface FlightSettings {
  altitude: number;       // meters AGL
  speed: number;          // m/s
  overlap: number;        // front overlap %
  sidelap: number;        // side overlap %
  gimbalPitch: number;    // degrees (negative = looking down)
  pattern: "grid" | "crosshatch" | "orbit";
}

const DEFAULT_SETTINGS: FlightSettings = {
  altitude: 60,
  speed: 5,
  overlap: 80,
  sidelap: 70,
  gimbalPitch: -90,
  pattern: "grid",
};

// Sensor specs for DJI Mavic 3 (common inspection drone)
const SENSOR = {
  focalLength: 12.3,    // mm
  sensorWidth: 17.3,    // mm
  sensorHeight: 13,     // mm
  imageWidth: 5280,      // px
  imageHeight: 3956,     // px
};

function calculateGSD(altitude: number): number {
  return (altitude * SENSOR.sensorWidth) / (SENSOR.focalLength * SENSOR.imageWidth) * 100; // cm/px
}

function calculateFootprint(altitude: number): { width: number; height: number } {
  const widthM = (altitude * SENSOR.sensorWidth) / SENSOR.focalLength;
  const heightM = (altitude * SENSOR.sensorHeight) / SENSOR.focalLength;
  return { width: widthM, height: heightM };
}

function generateGridWaypoints(
  boundary: [number, number][],
  settings: FlightSettings
): Waypoint[] {
  if (boundary.length < 3) return [];

  const polygon = turf.polygon([[...boundary, boundary[0]]]);
  const bbox = turf.bbox(polygon);
  const footprint = calculateFootprint(settings.altitude);

  // Spacing based on sidelap
  const lineSpacing = footprint.width * (1 - settings.sidelap / 100);
  // Photo interval based on overlap
  const photoInterval = footprint.height * (1 - settings.overlap / 100);

  const waypoints: Waypoint[] = [];
  let index = 0;

  // Calculate bearing of longest edge for optimal flight lines
  const coords = boundary;
  let maxDist = 0;
  let bearing = 0;
  for (let i = 0; i < coords.length; i++) {
    const next = (i + 1) % coords.length;
    const d = turf.distance(turf.point(coords[i]), turf.point(coords[next]));
    if (d > maxDist) {
      maxDist = d;
      bearing = turf.bearing(turf.point(coords[i]), turf.point(coords[next]));
    }
  }

  // Create buffered bbox in the bearing direction
  const center = turf.center(polygon);
  const diag = turf.distance(
    turf.point([bbox[0], bbox[1]]),
    turf.point([bbox[2], bbox[3]]),
    { units: "meters" }
  );

  // Generate parallel lines
  const numLines = Math.ceil(diag / lineSpacing) + 2;
  const startOffset = -(numLines / 2) * lineSpacing;

  for (let i = 0; i < numLines; i++) {
    const offset = startOffset + i * lineSpacing;
    const perpBearing = bearing + 90;

    // Line center offset from polygon center
    const lineCenter = turf.destination(center, offset / 1000, perpBearing);

    // Extend line well beyond polygon
    const lineStart = turf.destination(lineCenter, diag / 1000, bearing);
    const lineEnd = turf.destination(lineCenter, diag / 1000, bearing + 180);

    const line = turf.lineString([
      turf.getCoord(lineStart) as [number, number],
      turf.getCoord(lineEnd) as [number, number],
    ]);

    // Clip line to polygon
    const clipped = turf.lineIntersect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        turf.polygonToLine(polygon) as any,
      line
    );

    if (clipped.features.length >= 2) {
      // Sort intersection points along the line
      const pts = clipped.features
        .map((f) => turf.getCoord(f) as [number, number])
        .sort((a, b) => {
          const dA = turf.distance(turf.point(turf.getCoord(lineStart) as [number, number]), turf.point(a));
          const dB = turf.distance(turf.point(turf.getCoord(lineStart) as [number, number]), turf.point(b));
          return dA - dB;
        });

      const segStart = pts[0];
      const segEnd = pts[pts.length - 1];

      // Alternate direction for efficient path
      const [p1, p2] = i % 2 === 0 ? [segStart, segEnd] : [segEnd, segStart];

      // Add waypoints along this segment
      const segLen = turf.distance(turf.point(p1), turf.point(p2), { units: "meters" });
      const numPhotos = Math.max(2, Math.ceil(segLen / photoInterval) + 1);

      for (let j = 0; j < numPhotos; j++) {
        const frac = j / (numPhotos - 1);
        const pt = turf.along(
          turf.lineString([p1, p2]),
          frac * segLen / 1000
        );
        const coord = turf.getCoord(pt) as [number, number];

        // Check if point is inside polygon
        if (turf.booleanPointInPolygon(turf.point(coord), polygon)) {
          waypoints.push({
            lng: coord[0],
            lat: coord[1],
            altitude: settings.altitude,
            heading: turf.bearing(turf.point(p1), turf.point(p2)),
            index: index++,
          });
        }
      }
    }
  }

  // Add crosshatch pattern (perpendicular passes)
  if (settings.pattern === "crosshatch") {
    const crossBearing = bearing + 90;
    for (let i = 0; i < numLines; i++) {
      const offset = startOffset + i * lineSpacing;
      const lineCenter = turf.destination(center, offset / 1000, bearing);
      const lineStart = turf.destination(lineCenter, diag / 1000, crossBearing);
      const lineEnd = turf.destination(lineCenter, diag / 1000, crossBearing + 180);

      const line = turf.lineString([
        turf.getCoord(lineStart) as [number, number],
        turf.getCoord(lineEnd) as [number, number],
      ]);

      const clipped = turf.lineIntersect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        turf.polygonToLine(polygon) as any,
        line
      );

      if (clipped.features.length >= 2) {
        const pts = clipped.features
          .map((f) => turf.getCoord(f) as [number, number])
          .sort((a, b) => {
            const dA = turf.distance(turf.point(turf.getCoord(lineStart) as [number, number]), turf.point(a));
            const dB = turf.distance(turf.point(turf.getCoord(lineStart) as [number, number]), turf.point(b));
            return dA - dB;
          });

        const segStart = pts[0];
        const segEnd = pts[pts.length - 1];
        const [p1, p2] = i % 2 === 0 ? [segStart, segEnd] : [segEnd, segStart];

        const segLen = turf.distance(turf.point(p1), turf.point(p2), { units: "meters" });
        const numPhotos = Math.max(2, Math.ceil(segLen / photoInterval) + 1);

        for (let j = 0; j < numPhotos; j++) {
          const frac = j / (numPhotos - 1);
          const pt = turf.along(turf.lineString([p1, p2]), frac * segLen / 1000);
          const coord = turf.getCoord(pt) as [number, number];

          if (turf.booleanPointInPolygon(turf.point(coord), polygon)) {
            waypoints.push({
              lng: coord[0],
              lat: coord[1],
              altitude: settings.altitude,
              heading: turf.bearing(turf.point(p1), turf.point(p2)),
              index: index++,
            });
          }
        }
      }
    }
  }

  // Orbit pattern
  if (settings.pattern === "orbit") {
    const centroid = turf.centroid(polygon);
    const bbox2 = turf.bbox(polygon);
    const radius = turf.distance(
      turf.point([bbox2[0], bbox2[1]]),
      turf.point([bbox2[2], bbox2[3]]),
      { units: "meters" }
    ) / 2;

    const numPoints = 24; // orbit points
    for (let i = 0; i < numPoints; i++) {
      const angle = (360 / numPoints) * i;
      const pt = turf.destination(centroid, radius / 1000, angle);
      const coord = turf.getCoord(pt) as [number, number];
      const centroidCoord = turf.getCoord(centroid) as [number, number];

      waypoints.push({
        lng: coord[0],
        lat: coord[1],
        altitude: settings.altitude,
        heading: turf.bearing(turf.point(coord), turf.point(centroidCoord)),
        index: index++,
      });
    }
  }

  return waypoints;
}

export default function FlightPlanPage() {
  const params = useParams();
  const jobId = params.id as string;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [boundary, setBoundary] = useState<[number, number][]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [settings, setSettings] = useState<FlightSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobAddress, setJobAddress] = useState<string>("");

  // Load job boundary
  useEffect(() => {
    async function loadJob() {
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
          setBoundary(job.roof_boundary as [number, number][]);
        }
      }
      setLoading(false);
    }
    loadJob();
  }, [jobId]);

  // Draw waypoints on map
  const drawFlightPath = useCallback((map: mapboxgl.Map, wps: Waypoint[]) => {
    // Clear markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add waypoint markers
    wps.forEach((wp, i) => {
      const el = document.createElement("div");
      el.style.width = "10px";
      el.style.height = "10px";
      el.style.borderRadius = "50%";
      el.style.background = "#22c55e";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";
      el.title = `WP ${i + 1}: ${wp.altitude}m AGL`;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([wp.lng, wp.lat])
        .addTo(map);
      markersRef.current.push(marker);
    });

    // Draw flight path line
    if (wps.length >= 2) {
      const coords = wps.map((wp) => [wp.lng, wp.lat]);
      const lineData: GeoJSON.Feature = {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: coords },
      };

      const source = map.getSource("flight-path") as mapboxgl.GeoJSONSource | undefined;
      if (source) {
        source.setData(lineData);
      }
    }
  }, []);

  // Init map
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainerRef.current || loading) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      // Boundary fill
      map.addSource("boundary-fill", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[]] } },
      });
      map.addLayer({
        id: "boundary-fill-layer",
        type: "fill",
        source: "boundary-fill",
        paint: { "fill-color": "#3b82f6", "fill-opacity": 0.15 },
      });

      // Boundary line
      map.addSource("boundary-line", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
      });
      map.addLayer({
        id: "boundary-line-layer",
        type: "line",
        source: "boundary-line",
        paint: { "line-color": "#3b82f6", "line-width": 2, "line-dasharray": [2, 1] },
      });

      // Flight path
      map.addSource("flight-path", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
      });
      map.addLayer({
        id: "flight-path-layer",
        type: "line",
        source: "flight-path",
        paint: { "line-color": "#22c55e", "line-width": 1.5, "line-opacity": 0.7 },
      });

      // Draw boundary if exists
      if (boundary.length >= 3) {
        const closed = [...boundary, boundary[0]];
        (map.getSource("boundary-fill") as mapboxgl.GeoJSONSource).setData({
          type: "Feature", properties: {},
          geometry: { type: "Polygon", coordinates: [closed] },
        });
        (map.getSource("boundary-line") as mapboxgl.GeoJSONSource).setData({
          type: "Feature", properties: {},
          geometry: { type: "LineString", coordinates: closed },
        });

        const bounds = new mapboxgl.LngLatBounds();
        boundary.forEach((c) => bounds.extend(c));
        map.fitBounds(bounds, { padding: 80, maxZoom: 20 });
      } else if (jobAddress) {
        // Geocode
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(jobAddress)}.json?access_token=${MAPBOX_TOKEN}&limit=1`)
          .then((r) => r.json())
          .then((data) => {
            if (data.features?.[0]) {
              const [lng, lat] = data.features[0].center;
              map.flyTo({ center: [lng, lat], zoom: 19, duration: 1500 });
            }
          })
          .catch(() => {});
      }
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Regenerate waypoints when settings or boundary change
  useEffect(() => {
    if (boundary.length < 3) return;
    const wps = generateGridWaypoints(boundary, settings);
    setWaypoints(wps);
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      drawFlightPath(mapRef.current, wps);
    }
  }, [boundary, settings, drawFlightPath]);

  // Calculate flight stats
  const gsd = calculateGSD(settings.altitude);
  const footprint = calculateFootprint(settings.altitude);
  const totalDistance = waypoints.length >= 2
    ? waypoints.reduce((sum, wp, i) => {
        if (i === 0) return 0;
        return sum + turf.distance(
          turf.point([waypoints[i - 1].lng, waypoints[i - 1].lat]),
          turf.point([wp.lng, wp.lat]),
          { units: "meters" }
        );
      }, 0)
    : 0;
  const flightTime = settings.speed > 0 ? totalDistance / settings.speed : 0;
  const roofArea = boundary.length >= 3
    ? turf.area(turf.polygon([[...boundary, boundary[0]]]))
    : 0;

  async function handleExportKML() {
    const kml = generateKML(waypoints, settings, jobAddress);
    const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flight-plan-${jobId}.kml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.from("jobs").update({
        metadata: {
          flight_plan: {
            waypoints: waypoints.map((wp) => ({
              lng: wp.lng, lat: wp.lat,
              altitude: wp.altitude, heading: wp.heading,
            })),
            settings,
            stats: {
              total_waypoints: waypoints.length,
              total_distance_m: Math.round(totalDistance),
              estimated_flight_time_s: Math.round(flightTime),
              gsd_cm_px: Math.round(gsd * 100) / 100,
            },
          },
        },
      }).eq("id", jobId);
    } finally {
      setSaving(false);
    }
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-neutral-50 rounded-xl p-12 text-center">
          <p className="text-sm text-neutral-500">Mapbox token required for flight planning</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold text-primary-900">Flight Plan</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Automated waypoint generation for drone capture
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportKML}
            disabled={waypoints.length === 0}
            className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
          >
            Export KML
          </button>
          <button
            onClick={handleSave}
            disabled={waypoints.length === 0 || saving}
            className="btn-primary text-xs py-1.5 px-4 disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save Plan"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Settings sidebar */}
        <div className="w-72 border-r border-neutral-200 bg-white overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-4">
            {/* Flight stats */}
            <div className="bg-neutral-50 rounded-lg p-3 space-y-2">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Flight Stats</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-neutral-400">Waypoints</p>
                  <p className="font-bold text-primary-900">{waypoints.length}</p>
                </div>
                <div>
                  <p className="text-neutral-400">Distance</p>
                  <p className="font-bold text-primary-900">{(totalDistance / 1000).toFixed(2)} km</p>
                </div>
                <div>
                  <p className="text-neutral-400">Flight Time</p>
                  <p className="font-bold text-primary-900">{Math.ceil(flightTime / 60)} min</p>
                </div>
                <div>
                  <p className="text-neutral-400">GSD</p>
                  <p className="font-bold text-primary-900">{gsd.toFixed(2)} cm/px</p>
                </div>
                <div>
                  <p className="text-neutral-400">Footprint</p>
                  <p className="font-bold text-primary-900">{footprint.width.toFixed(1)} x {footprint.height.toFixed(1)}m</p>
                </div>
                <div>
                  <p className="text-neutral-400">Roof Area</p>
                  <p className="font-bold text-primary-900">{Math.round(roofArea * 10.764)} sqft</p>
                </div>
              </div>
            </div>

            {/* Pattern */}
            <div>
              <label className="text-xs font-medium text-neutral-600 block mb-1.5">Flight Pattern</label>
              <div className="flex gap-1">
                {(["grid", "crosshatch", "orbit"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSettings((s) => ({ ...s, pattern: p }))}
                    className={`flex-1 text-xs py-1.5 rounded-md capitalize font-medium transition-colors ${
                      settings.pattern === p
                        ? "bg-accent-500 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Altitude */}
            <div>
              <label className="text-xs font-medium text-neutral-600 flex justify-between mb-1.5">
                <span>Altitude (AGL)</span>
                <span className="text-neutral-400">{settings.altitude}m / {Math.round(settings.altitude * 3.281)}ft</span>
              </label>
              <input
                type="range"
                min={20}
                max={120}
                step={5}
                value={settings.altitude}
                onChange={(e) => setSettings((s) => ({ ...s, altitude: +e.target.value }))}
                className="w-full accent-accent-500"
              />
            </div>

            {/* Speed */}
            <div>
              <label className="text-xs font-medium text-neutral-600 flex justify-between mb-1.5">
                <span>Speed</span>
                <span className="text-neutral-400">{settings.speed} m/s / {(settings.speed * 2.237).toFixed(1)} mph</span>
              </label>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={settings.speed}
                onChange={(e) => setSettings((s) => ({ ...s, speed: +e.target.value }))}
                className="w-full accent-accent-500"
              />
            </div>

            {/* Overlap */}
            <div>
              <label className="text-xs font-medium text-neutral-600 flex justify-between mb-1.5">
                <span>Front Overlap</span>
                <span className="text-neutral-400">{settings.overlap}%</span>
              </label>
              <input
                type="range"
                min={50}
                max={95}
                step={5}
                value={settings.overlap}
                onChange={(e) => setSettings((s) => ({ ...s, overlap: +e.target.value }))}
                className="w-full accent-accent-500"
              />
            </div>

            {/* Sidelap */}
            <div>
              <label className="text-xs font-medium text-neutral-600 flex justify-between mb-1.5">
                <span>Side Overlap</span>
                <span className="text-neutral-400">{settings.sidelap}%</span>
              </label>
              <input
                type="range"
                min={40}
                max={90}
                step={5}
                value={settings.sidelap}
                onChange={(e) => setSettings((s) => ({ ...s, sidelap: +e.target.value }))}
                className="w-full accent-accent-500"
              />
            </div>

            {/* Gimbal */}
            <div>
              <label className="text-xs font-medium text-neutral-600 flex justify-between mb-1.5">
                <span>Gimbal Pitch</span>
                <span className="text-neutral-400">{settings.gimbalPitch}&deg;</span>
              </label>
              <input
                type="range"
                min={-90}
                max={-30}
                step={5}
                value={settings.gimbalPitch}
                onChange={(e) => setSettings((s) => ({ ...s, gimbalPitch: +e.target.value }))}
                className="w-full accent-accent-500"
              />
            </div>

            {/* No boundary warning */}
            {boundary.length < 3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-700 font-medium">No roof boundary defined</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Go to the Map tab and draw the roof boundary first to generate waypoints.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative min-h-0">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
              <span className="text-neutral-600">Roof Boundary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-white" />
              <span className="text-neutral-600">Waypoints ({waypoints.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-500" />
              <span className="text-neutral-600">Flight Path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateKML(waypoints: Waypoint[], settings: FlightSettings, name: string): string {
  const coords = waypoints
    .map((wp) => `${wp.lng},${wp.lat},${wp.altitude}`)
    .join("\n            ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Flight Plan - ${name}</name>
    <description>
      Pattern: ${settings.pattern}
      Altitude: ${settings.altitude}m AGL
      Speed: ${settings.speed} m/s
      Overlap: ${settings.overlap}% front, ${settings.sidelap}% side
      Waypoints: ${waypoints.length}
    </description>
    <Style id="flightPath">
      <LineStyle>
        <color>ff00ff00</color>
        <width>2</width>
      </LineStyle>
    </Style>
    <Placemark>
      <name>Flight Path</name>
      <styleUrl>#flightPath</styleUrl>
      <LineString>
        <altitudeMode>relativeToGround</altitudeMode>
        <coordinates>
            ${coords}
        </coordinates>
      </LineString>
    </Placemark>
    ${waypoints.map((wp, i) => `
    <Placemark>
      <name>WP${i + 1}</name>
      <Point>
        <altitudeMode>relativeToGround</altitudeMode>
        <coordinates>${wp.lng},${wp.lat},${wp.altitude}</coordinates>
      </Point>
    </Placemark>`).join("")}
  </Document>
</kml>`;
}
