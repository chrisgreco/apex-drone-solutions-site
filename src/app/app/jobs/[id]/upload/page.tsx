"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useState, useCallback } from "react";

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "complete" | "error";
  url?: string;
}

export default function UploadPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const supabase = createClient();

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter((f) => f.type.startsWith("image/"));

    for (const file of newFiles) {
      const entry: UploadedFile = {
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading",
      };
      setFiles((prev) => [...prev, entry]);

      try {
        const path = `jobs/${jobId}/images/${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage
          .from("job-images")
          .upload(path, file);

        if (error) throw error;

        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, progress: 100, status: "complete" } : f,
          ),
        );
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: "error" } : f,
          ),
        );
      }
    }
  }, [jobId, supabase.storage]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h2 className="text-lg font-bold text-primary-900 mb-1">Upload Images</h2>
      <p className="text-sm text-neutral-500 mb-6">
        Upload drone imagery for this property. Supported formats: JPG, PNG, TIFF.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragActive
            ? "border-accent-500 bg-accent-50"
            : "border-neutral-200 bg-white hover:border-neutral-300"
        }`}
      >
        <svg className="w-10 h-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm font-medium text-neutral-700">
          Drag and drop images here, or{" "}
          <label className="text-accent-600 cursor-pointer hover:text-accent-700">
            browse
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </label>
        </p>
        <p className="text-xs text-neutral-400 mt-1">JPG, PNG, TIFF up to 50MB each</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6 bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
          {files.map((file, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  file.status === "complete" ? "bg-success-100 text-success-500" :
                  file.status === "error" ? "bg-red-100 text-red-500" :
                  "bg-accent-100 text-accent-500"
                }`}>
                  {file.status === "complete" ? "✓" : file.status === "error" ? "!" : "↑"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{file.name}</p>
                  <p className="text-xs text-neutral-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${
                file.status === "complete" ? "text-success-500" :
                file.status === "error" ? "text-red-500" :
                "text-accent-500"
              }`}>
                {file.status === "complete" ? "Uploaded" : file.status === "error" ? "Failed" : "Uploading..."}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
