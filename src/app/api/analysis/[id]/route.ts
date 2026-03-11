import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Verify auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;

    // Fetch the most recent analysis job for this job
    const { data: analysisJob, error: analysisError } = await supabase
      .from("analysis_jobs")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (analysisError) {
      return NextResponse.json(
        { error: "Failed to fetch analysis" },
        { status: 500 }
      );
    }

    if (!analysisJob) {
      return NextResponse.json({ analysis: null, findings: [] });
    }

    // Fetch findings for this analysis job
    const { data: findings, error: findingsError } = await supabase
      .from("damage_findings")
      .select("*")
      .eq("analysis_job_id", analysisJob.id)
      .order("severity", { ascending: true });

    if (findingsError) {
      return NextResponse.json(
        { error: "Failed to fetch findings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      analysis: analysisJob,
      findings: findings || [],
    });
  } catch (err) {
    console.error("Error fetching analysis:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
