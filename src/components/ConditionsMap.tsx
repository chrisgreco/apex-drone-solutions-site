"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { CATEGORY_CONFIG, type ConditionEvent } from "@/lib/eonet";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Mid-Atlantic region center (NJ/PA/DE/NY)
const REGION_CENTER: [number, number] = [-75.5, 40.8];
const REGION_ZOOM = 6.3;
const REGION_PITCH = 45;
const REGION_BEARING = -10;

interface ConditionsMapProps {
  events: ConditionEvent[];
}

export default function ConditionsMap({ events }: ConditionsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: REGION_CENTER,
      zoom: REGION_ZOOM,
      pitch: REGION_PITCH,
      bearing: REGION_BEARING,
      antialias: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Add 3D terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 2.5 });

      // Add sky layer for atmosphere
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });

      // Add severity columns as fill-extrusion
      if (events.length > 0) {
        const features = events.map((event) => {
          const config = CATEGORY_CONFIG[event.category];
          const lng = event.coordinates[0];
          const lat = event.coordinates[1];
          const offset = 0.015;

          const height = event.magnitude
            ? Math.min(Math.max(event.magnitude * 50, 2000), 30000)
            : 8000;

          return {
            type: "Feature" as const,
            properties: {
              color: config?.color ?? "#888",
              height,
              id: event.id,
            },
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [lng - offset, lat - offset],
                  [lng + offset, lat - offset],
                  [lng + offset, lat + offset],
                  [lng - offset, lat + offset],
                  [lng - offset, lat - offset],
                ],
              ],
            },
          };
        });

        map.addSource("event-columns", {
          type: "geojson",
          data: { type: "FeatureCollection", features },
        });

        map.addLayer({
          id: "event-columns-layer",
          type: "fill-extrusion",
          source: "event-columns",
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.6,
          },
        });
      }

      // Add animated HTML markers
      events.forEach((event) => {
        const config = CATEGORY_CONFIG[event.category];
        if (!config) return;

        const el = document.createElement("div");
        el.className = "eonet-marker";
        el.innerHTML = `
          <div style="
            width: 16px; height: 16px;
            background: ${config.color};
            border-radius: 50%;
            box-shadow: 0 0 12px ${config.glow}, 0 0 24px ${config.glow};
            animation: eonet-pulse 2s ease-in-out infinite;
          "></div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(event.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(`
              <div style="font-family:ui-monospace,monospace; font-size:12px; max-width:220px;">
                <strong style="color:${config.color};">${config.label}</strong>
                <p style="margin:4px 0 0; color:#333; font-size:11px;">${event.title}</p>
              </div>
            `)
          )
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
    };
  }, [events]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[500px] bg-primary-950 rounded-xl flex items-center justify-center border border-accent-500/10">
        <p className="text-xs text-white/40 font-mono">MAPBOX_TOKEN not configured</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes eonet-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }
        .mapboxgl-popup-content {
          background: #fff;
          border-radius: 8px;
          padding: 10px 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .mapboxgl-popup-tip { border-top-color: #fff; }
      `}</style>
      <div ref={containerRef} className="w-full h-[500px] md:h-[600px] rounded-xl" />
    </>
  );
}
