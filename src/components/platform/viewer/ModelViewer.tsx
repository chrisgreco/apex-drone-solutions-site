"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Grid, Html } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-neutral-400">Loading 3D model...</p>
      </div>
    </Html>
  );
}

interface ModelViewerProps {
  jobId: string;
  modelUrl?: string;
}

export default function ModelViewer({ jobId, modelUrl }: ModelViewerProps) {
  const [url, setUrl] = useState<string | null>(modelUrl || null);
  const [loading, setLoading] = useState(!modelUrl);
  const [wireframe, setWireframe] = useState(false);

  useEffect(() => {
    if (modelUrl) return;

    async function loadModel() {
      const supabase = createClient();
      const { data: model } = await supabase
        .from("roof_models")
        .select("storage_path, format")
        .eq("job_id", jobId)
        .in("format", ["glb", "gltf", "obj"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (model?.storage_path) {
        const { data: signedUrl } = await supabase.storage
          .from("models")
          .createSignedUrl(model.storage_path, 3600);

        if (signedUrl?.signedUrl) {
          setUrl(signedUrl.signedUrl);
        }
      }
      setLoading(false);
    }
    loadModel();
  }, [jobId, modelUrl]);

  if (loading) {
    return (
      <div className="aspect-video bg-neutral-900 rounded-xl flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-neutral-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!url) {
    return (
      <div className="aspect-video bg-neutral-900 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-neutral-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313" />
          </svg>
          <p className="text-sm text-neutral-500">No 3D model available</p>
          <p className="text-xs text-neutral-600 mt-1">
            Upload drone images and run photogrammetry to generate a 3D model
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Controls overlay */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          onClick={() => setWireframe((w) => !w)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg shadow-lg transition-colors ${
            wireframe
              ? "bg-accent-500 text-white"
              : "bg-white text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          {wireframe ? "Solid" : "Wireframe"}
        </button>
      </div>

      <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden">
        <Canvas
          camera={{ position: [10, 10, 10], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={["#111"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <Suspense fallback={<LoadingSpinner />}>
            <Model url={url} />
            <Environment preset="city" />
          </Suspense>

          <Grid
            infiniteGrid
            cellSize={1}
            sectionSize={5}
            fadeDistance={50}
            cellColor="#333"
            sectionColor="#555"
          />

          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            autoRotate={!wireframe}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </div>
  );
}
