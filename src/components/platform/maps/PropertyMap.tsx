"use client";

import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("@/components/platform/maps/MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] bg-neutral-100 rounded-xl animate-pulse flex items-center justify-center">
      <p className="text-xs text-neutral-400">Loading map...</p>
    </div>
  ),
});

interface PropertyMapProps {
  address: string;
  boundary?: [number, number][];
  heightClass?: string;
}

export default function PropertyMap({ address, boundary, heightClass = "h-[350px]" }: PropertyMapProps) {
  return (
    <MapPreview
      address={address}
      boundary={boundary}
      heightClass={heightClass}
    />
  );
}
