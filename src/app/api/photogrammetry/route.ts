import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import * as webodm from "@/lib/photogrammetry/webodm";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const userClient = await createClient();
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    // Check WebODM connection
    const conn = await webodm.checkConnection();
    if (!conn.connected) {
      return NextResponse.json({
        error: "Photogrammetry service not available",
        details: conn.error,
        setup: "Set WEBODM_URL and WEBODM_TOKEN environment variables. Use WebODM Lightning (webodm.net) or self-host NodeODM.",
      }, { status: 503 });
    }

    // Service role client for DB operations
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get job images
    const { data: images } = await supabase
      .from("job_images")
      .select("id, storage_path, filename")
      .eq("job_id", jobId);

    if (!images || images.length < 3) {
      return NextResponse.json({
        error: "Need at least 3 images for photogrammetry",
        imageCount: images?.length || 0,
      }, { status: 400 });
    }

    // Download images from Supabase storage
    const imageBlobs: { name: string; data: Blob }[] = [];
    for (const img of images) {
      const { data: blob } = await supabase.storage
        .from("job-images")
        .download(img.storage_path);

      if (blob) {
        imageBlobs.push({ name: img.filename, data: blob });
      }
    }

    if (imageBlobs.length < 3) {
      return NextResponse.json({ error: "Could not download enough images" }, { status: 500 });
    }

    // Create WebODM project
    const project = await webodm.createProject(`Job ${jobId.slice(0, 8)}`);
    if ("error" in project) {
      return NextResponse.json({ error: project.error }, { status: 500 });
    }

    // Create processing task
    const task = await webodm.createTask(project.id, imageBlobs, {
      name: `Photogrammetry - ${jobId.slice(0, 8)}`,
      options: {
        dsm: true,
        dtm: true,
        pc_quality: "high",
        "feature-quality": "high",
        use_3dmesh: true,
        "mesh-octree-depth": 11,
        "mesh-size": 200000,
      },
    });

    if ("error" in task) {
      return NextResponse.json({ error: task.error }, { status: 500 });
    }

    // Save processing record
    await supabase.from("roof_models").insert({
      job_id: jobId,
      format: "processing",
      metadata: {
        webodm_project_id: project.id,
        webodm_task_id: task.uuid,
        status: "processing",
        images_count: imageBlobs.length,
        started_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      taskId: task.uuid,
      projectId: project.id,
      imagesCount: imageBlobs.length,
    });
  } catch (err) {
    console.error("Photogrammetry error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Check photogrammetry status
export async function GET(request: NextRequest) {
  try {
    const userClient = await createClient();
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: model } = await supabase
      .from("roof_models")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!model) {
      return NextResponse.json({ status: "none" });
    }

    // If processing, check WebODM for updates
    if (model.format === "processing" && model.metadata?.webodm_project_id && model.metadata?.webodm_task_id) {
      const taskStatus = await webodm.getTaskStatus(
        model.metadata.webodm_project_id,
        model.metadata.webodm_task_id
      );

      if ("error" in taskStatus) {
        return NextResponse.json({ status: "processing", model, error: taskStatus.error });
      }

      // Update status
      const statusLabel = webodm.statusCodeToLabel(taskStatus.status.code);

      if (taskStatus.status.code === 40) {
        // Completed - get output URLs
        const outputs = await webodm.getTaskOutputs(
          model.metadata.webodm_project_id,
          model.metadata.webodm_task_id
        );

        await supabase.from("roof_models").update({
          format: "glb",
          metadata: {
            ...model.metadata,
            status: "complete",
            progress: 100,
            outputs,
            completed_at: new Date().toISOString(),
          },
        }).eq("id", model.id);

        return NextResponse.json({ status: "complete", model, outputs });
      }

      if (taskStatus.status.code === 30) {
        await supabase.from("roof_models").update({
          metadata: { ...model.metadata, status: "failed" },
        }).eq("id", model.id);

        return NextResponse.json({ status: "failed", model });
      }

      return NextResponse.json({
        status: statusLabel.toLowerCase(),
        progress: taskStatus.progress,
        model,
      });
    }

    return NextResponse.json({ status: model.format === "processing" ? "processing" : "complete", model });
  } catch (err) {
    console.error("Photogrammetry status error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
