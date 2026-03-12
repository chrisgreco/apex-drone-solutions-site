"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export interface MapMarker {
  lng: number;
  lat: number;
  color?: string;
  label?: string;
  popup?: string;
}

interface MapPreviewProps {
  /** Center coordinates [lng, lat] — if not provided, will geocode the address */
  center?: [number, number];
  /** Address to geocode if no center provided */
  address?: string;
  /** Zoom level (default 19 for roof-level) */
  zoom?: number;
  /** Roof boundary polygon as [[lng, lat], ...] */
  boundary?: [number, number][];
  /** Markers to show on the map (damage findings, etc.) */
  markers?: MapMarker[];
  /** Height class (default "aspect-video") */
  heightClass?: string;
  /** Whether map is interactive (default false — static preview) */
  interactive?: boolean;
  /** Callback when map is clicked */
  onClick?: (lngLat: { lng: number; lat: number }) => void;
}

export default function MapPreview({
  center,
  address,
  zoom = 19,
  boundary,
  markers,
  heightClass = "aspect-video",
  interactive = false,
  onClick,
}: MapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const drawBoundary = useCallback((map: mapboxgl.Map, coords: [number, number][]) => {
    const closed = [...coords, coords[0]];

    const lineData: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: closed },
    };

    const fillData: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates: [closed] },
    };

    const lineSource = map.getSource("boundary-line") as mapboxgl.GeoJSONSource | undefined;
    const fillSource = map.getSource("boundary-fill") as mapboxgl.GeoJSONSource | undefined;

    if (lineSource) {
      lineSource.setData(lineData);
    } else {
      map.addSource("boundary-line", { type: "geojson", data: lineData });
      map.addLayer({
        id: "boundary-line-layer",
        type: "line",
        source: "boundary-line",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 2.5,
          "line-dasharray": [2, 1],
        },
      });
    }

    if (fillSource) {
      fillSource.setData(fillData);
    } else {
      map.addSource("boundary-fill", { type: "geojson", data: fillData });
      map.addLayer({
        id: "boundary-fill-layer",
        type: "fill",
        source: "boundary-fill",
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.15,
        },
      });
    }
  }, []);

  const addMarkers = useCallback((map: mapboxgl.Map, items: MapMarker[]) => {
    // Clear existing
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    items.forEach((item) => {
      const el = document.createElement("div");
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.background = item.color || "#ef4444";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([item.lng, item.lat])
        .addTo(map);

      if (item.popup) {
        marker.setPopup(
          new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(
            `<div style="font-size:12px;max-width:200px">
              ${item.label ? `<strong>${item.label}</strong><br/>` : ""}
              ${item.popup}
            </div>`
          )
        );
      }

      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: center || [-98.5795, 39.8283],
      zoom: center ? zoom : 4,
      interactive,
      attributionControl: false,
    });

    mapRef.current = map;

    if (interactive) {
      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    }

    map.on("load", () => {
      // Draw boundary if provided
      if (boundary && boundary.length >= 3) {
        drawBoundary(map, boundary);

        // Fit to boundary bounds
        const bounds = new mapboxgl.LngLatBounds();
        boundary.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 60, maxZoom: 20 });
      }

      // Add markers if provided
      if (markers && markers.length > 0) {
        addMarkers(map, markers);

        // If no boundary, fit to markers
        if (!boundary || boundary.length < 3) {
          const bounds = new mapboxgl.LngLatBounds();
          markers.forEach((m) => bounds.extend([m.lng, m.lat]));
          if (markers.length > 1) {
            map.fitBounds(bounds, { padding: 60, maxZoom: 20 });
          }
        }
      }

      // Geocode address if no center or boundary
      if (!center && address && (!boundary || boundary.length < 3)) {
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.features?.[0]) {
              const [lng, lat] = data.features[0].center;
              map.flyTo({ center: [lng, lat], zoom, duration: 1500 });
            }
          })
          .catch(() => {});
      }
    });

    if (onClick) {
      map.getCanvas().style.cursor = "crosshair";
      map.on("click", (e) => onClick({ lng: e.lngLat.lng, lat: e.lngLat.lat }));
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`${heightClass} bg-neutral-100 flex items-center justify-center rounded-xl`}>
        <p className="text-xs text-neutral-400">Map unavailable — Mapbox token not configured</p>
      </div>
    );
  }

  return <div ref={containerRef} className={`${heightClass} w-full rounded-xl overflow-hidden`} />;
}
