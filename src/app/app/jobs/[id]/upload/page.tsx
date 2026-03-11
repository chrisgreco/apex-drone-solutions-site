"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "complete" | "error";
  storagePath?: string;
}

interface DbImage {
  id: string;
  original_filename: string;
  file_size: number;
  storage_path: string;
  created_at: string;
}

export default function UploadPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [existingImages, setExistingImages] = useState<DbImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const supabase = createClient();

  // Load existing images for this job
  useEffect(() => {
    async function loadImages() {
      const { data } = await supabase
        .from("job_images")
        .select("id, original_filename, file_size, storage_path, created_at")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });
      if (data) setExistingImages(data);
    }
    loadImages();
  }, [jobId, supabase]);

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
        const storagePath = `jobs/${jobId}/images/${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage
          .from("job-images")
          .upload(storagePath, file);

        if (error) throw error;

        // Also insert a record into job_images table
        const { error: dbError } = await supabase.from("job_images").insert({
          job_id: jobId,
          storage_path: storagePath,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          image_type: "aerial",
        });

        if (dbError) console.error("Failed to save image record:", dbError);

        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, progress: 100, status: "complete", storagePath } : f,
          ),
        );

        // Update job status to 'uploading' if it's still in 'setup'
        await supabase
          .from("jobs")
          .update({ status: "uploading" })
          .eq("id", jobId)
          .in("status", ["setup", "ready_to_fly"]);
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: "error" } : f,
          ),
        );
      }
    }
  }, [jobId, supabase]);

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

      {/* Current upload list */}
      {files.length > 0 && (
        <div className="mt-6 bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
          <div className="px-5 py-3">
            <h3 className="text-sm font-semibold text-primary-900">Current Uploads</h3>
          </div>
          {files.map((file, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  file.status === "complete" ? "bg-success-100 text-success-500" :
                  file.status === "error" ? "bg-red-100 text-red-500" :
                  "bg-accent-100 text-accent-500"
                }`}>
                  {file.status === "complete" ? "\u2713" : file.status === "error" ? "!" : "\u2191"}
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

      {/* Previously uploaded images */}
      {existingImages.length > 0 && (
        <div className="mt-6 bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
          <div className="px-5 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary-900">Uploaded Images</h3>
            <span className="text-xs text-neutral-400">{existingImages.length} image{existingImages.length !== 1 ? "s" : ""}</span>
          </div>
          {existingImages.map((img) => (
            <div key={img.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-success-100 text-success-500 flex items-center justify-center text-xs font-bold">
                  {"\u2713"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{img.original_filename}</p>
                  <p className="text-xs text-neutral-400">{(img.file_size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400">
                {new Date(img.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
