import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import type { DamageType, Severity } from "@/lib/types/platform";

// ─── Types ──────────────────────────────────────────────────

interface ClaudeFinding {
  damage_type: DamageType;
  severity: Severity;
  confidence: number;
  description: string;
  bounding_box?: { x: number; y: number; w: number; h: number };
}

interface ClaudeAnalysisResponse {
  findings: ClaudeFinding[];
}

// ─── Mock data generator (fallback when no API key) ─────────

function generateMockFindings(imageIds: string[]): {
  imageId: string;
  findings: ClaudeFinding[];
}[] {
  const damageTypes: DamageType[] = [
    "hail",
    "wind",
    "granule_loss",
    "missing_shingle",
    "cracking",
    "ponding",
    "flashing_damage",
    "debris",
    "other",
  ];
  const severities: Severity[] = ["low", "medium", "high", "critical"];
  const descriptions: Record<string, string> = {
    hail: "Circular impact marks consistent with hail damage on shingle surface",
    wind: "Lifted shingle edges indicating wind uplift damage",
    granule_loss:
      "Significant granule loss exposing asphalt substrate on aged shingles",
    missing_shingle: "Missing shingle leaving exposed underlayment",
    cracking: "Longitudinal cracking across multiple shingle tabs",
    ponding: "Standing water accumulation indicating inadequate drainage",
    flashing_damage:
      "Deteriorated or displaced flashing at roof penetration point",
    debris: "Tree limb debris causing localized surface damage",
    other: "General wear and weathering observed on roof surface",
  };

  return imageIds.map((imageId) => {
    const numFindings = Math.floor(Math.random() * 4) + 1;
    const findings: ClaudeFinding[] = [];

    for (let i = 0; i < numFindings; i++) {
      const dt = damageTypes[Math.floor(Math.random() * damageTypes.length)];
      findings.push({
        damage_type: dt,
        severity: severities[Math.floor(Math.random() * severities.length)],
        confidence: parseFloat((0.7 + Math.random() * 0.28).toFixed(2)),
        description: descriptions[dt] || descriptions.other,
        bounding_box: {
          x: parseFloat((Math.random() * 0.6).toFixed(2)),
          y: parseFloat((Math.random() * 0.6).toFixed(2)),
          w: parseFloat((0.1 + Math.random() * 0.3).toFixed(2)),
          h: parseFloat((0.1 + Math.random() * 0.3).toFixed(2)),
        },
      });
    }

    return { imageId, findings };
  });
}

// ─── Claude Vision analysis ─────────────────────────────────

async function analyzeImageWithClaude(
  client: Anthropic,
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp"
): Promise<ClaudeFinding[]> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: imageBase64 },
          },
          {
            type: "text",
            text: `You are an expert roof and property damage analyst. Analyze this drone/inspection image and identify all visible damage.

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "findings": [
    {
      "damage_type": "<one of: hail, wind, granule_loss, missing_shingle, cracking, ponding, flashing_damage, debris, impact, mechanical, other>",
      "severity": "<one of: low, medium, high, critical>",
      "confidence": <0.0 to 1.0>,
      "description": "<brief description of the specific damage observed>",
      "bounding_box": { "x": <0-1 normalized>, "y": <0-1 normalized>, "w": <0-1 normalized>, "h": <0-1 normalized> }
    }
  ]
}

If no damage is found, return: { "findings": [] }

Guidelines:
- Be specific about damage location and characteristics
- Confidence should reflect how certain you are about the identification
- Severity: low = cosmetic, medium = needs monitoring, high = needs repair, critical = immediate attention
- Bounding box coordinates are normalized 0-1 relative to image dimensions
- Include bounding_box only if the damage location is clearly identifiable`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed: ClaudeAnalysisResponse = JSON.parse(text);
    return parsed.findings || [];
  } catch {
    // Try extracting JSON from potential markdown fences
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed: ClaudeAnalysisResponse = JSON.parse(jsonMatch[0]);
      return parsed.findings || [];
    }
    return [];
  }
}

// ─── POST handler ───────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const userClient = await createClient();

    // Verify auth
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role client for DB operations (bypasses RLS)
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json(
        { error: "jobId is required" },
        { status: 400 }
      );
    }

    // Fetch the job to verify it exists
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Fetch job images
    const { data: images, error: imagesError } = await supabase
      .from("job_images")
      .select("*")
      .eq("job_id", jobId);

    if (imagesError) {
      return NextResponse.json(
        { error: "Failed to fetch images" },
        { status: 500 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No images found for this job. Upload images before running analysis." },
        { status: 400 }
      );
    }

    // Create analysis_jobs record
    const { data: analysisJob, error: analysisError } = await supabase
      .from("analysis_jobs")
      .insert({
        job_id: jobId,
        status: "processing",
        model_version: process.env.ANTHROPIC_API_KEY
          ? "claude-sonnet-4-20250514"
          : "mock-v1",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (analysisError || !analysisJob) {
      return NextResponse.json(
        { error: "Failed to create analysis job" },
        { status: 500 }
      );
    }

    // Update job status to analyzing
    await supabase.from("jobs").update({ status: "analyzing" }).eq("id", jobId);

    const useMock = !process.env.ANTHROPIC_API_KEY;
    let allFindings: {
      analysis_job_id: string;
      job_id: string;
      image_id: string;
      damage_type: DamageType;
      severity: Severity;
      confidence: number;
      bounding_box: { x: number; y: number; width: number; height: number } | null;
      notes: string | null;
    }[] = [];

    if (useMock) {
      // --- Mock mode ---
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockResults = generateMockFindings(images.map((img) => img.id));

      for (const result of mockResults) {
        for (const finding of result.findings) {
          allFindings.push({
            analysis_job_id: analysisJob.id,
            job_id: jobId,
            image_id: result.imageId,
            damage_type: finding.damage_type,
            severity: finding.severity,
            confidence: finding.confidence,
            bounding_box: finding.bounding_box
              ? { x: finding.bounding_box.x, y: finding.bounding_box.y, width: finding.bounding_box.w, height: finding.bounding_box.h }
              : null,
            notes: finding.description,
          });
        }
      }
    } else {
      // --- Real Claude Vision analysis ---
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      for (const image of images) {
        try {
          // Download image from Supabase Storage
          const { data: fileData, error: downloadError } = await supabase
            .storage
            .from("job-images")
            .download(image.storage_path);

          if (downloadError || !fileData) {
            console.error(
              `Failed to download image ${image.id}:`,
              downloadError
            );
            continue;
          }

          const buffer = Buffer.from(await fileData.arrayBuffer());
          const base64 = buffer.toString("base64");

          // Determine media type
          const mimeType = (image.mime_type || "image/jpeg") as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp";

          const findings = await analyzeImageWithClaude(
            anthropic,
            base64,
            mimeType
          );

          for (const finding of findings) {
            allFindings.push({
              analysis_job_id: analysisJob.id,
              job_id: jobId,
              image_id: image.id,
              damage_type: finding.damage_type,
              severity: finding.severity,
              confidence: finding.confidence,
              bounding_box: finding.bounding_box
                ? { x: finding.bounding_box.x, y: finding.bounding_box.y, width: finding.bounding_box.w, height: finding.bounding_box.h }
                : null,
              notes: finding.description,
            });
          }
        } catch (err) {
          console.error(`Error analyzing image ${image.id}:`, err);
        }
      }
    }

    // Insert all findings
    if (allFindings.length > 0) {
      const { error: findingsError } = await supabase
        .from("damage_findings")
        .insert(allFindings);

      if (findingsError) {
        console.error("Failed to insert findings:", findingsError);
      }
    }

    // Calculate stats
    const flaggedImages = new Set(allFindings.map((f) => f.image_id)).size;
    const confidenceAvg =
      allFindings.length > 0
        ? allFindings.reduce((sum, f) => sum + f.confidence, 0) /
          allFindings.length
        : null;

    // Update analysis job to complete
    await supabase
      .from("analysis_jobs")
      .update({
        status: "complete",
        completed_at: new Date().toISOString(),
        summary: {
          total_findings: allFindings.length,
          images_analyzed: images.length,
          flagged_images: flaggedImages,
          avg_confidence: confidenceAvg
            ? parseFloat(confidenceAvg.toFixed(2))
            : null,
        },
      })
      .eq("id", analysisJob.id);

    // Update job status to review
    await supabase.from("jobs").update({ status: "review" }).eq("id", jobId);

    // Fetch the completed analysis job with findings
    const { data: completedJob } = await supabase
      .from("analysis_jobs")
      .select("*")
      .eq("id", analysisJob.id)
      .single();

    const { data: savedFindings } = await supabase
      .from("damage_findings")
      .select("*")
      .eq("analysis_job_id", analysisJob.id);

    return NextResponse.json({
      analysis: completedJob,
      findings: savedFindings || [],
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
