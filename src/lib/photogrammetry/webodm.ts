/**
 * WebODM / NodeODM Integration
 *
 * Supports:
 * - Self-hosted NodeODM (free, needs a server with GPU)
 * - WebODM Lightning (pay-per-task, ~$0.50-2 per task)
 *
 * Set environment variables:
 *   WEBODM_URL=http://localhost:3000 (or https://webodm.net for Lightning)
 *   WEBODM_TOKEN=your-api-token
 */

const WEBODM_URL = process.env.WEBODM_URL || "http://localhost:3000";
const WEBODM_TOKEN = process.env.WEBODM_TOKEN;

interface TaskOptions {
  name: string;
  /** Processing options for NodeODM */
  options?: {
    dsm?: boolean;
    dtm?: boolean;
    "mesh-octree-depth"?: number;
    "mesh-size"?: number;
    orthophoto_resolution?: number;
    pc_quality?: "ultra" | "high" | "medium" | "low" | "lowest";
    use_3dmesh?: boolean;
    "feature-quality"?: "ultra" | "high" | "medium" | "low" | "lowest";
  };
}

interface TaskStatus {
  uuid: string;
  status: {
    code: number; // 10=queued, 20=running, 30=failed, 40=completed, 50=canceled
  };
  processingTime: number;
  progress: number;
  imagesCount: number;
}

interface TaskOutput {
  orthophoto?: string;   // URL to orthophoto
  dsm?: string;          // Digital Surface Model
  dtm?: string;          // Digital Terrain Model
  texturedModel?: string; // URL to textured 3D model
  pointCloud?: string;   // URL to point cloud
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (WEBODM_TOKEN) {
    h["Authorization"] = `JWT ${WEBODM_TOKEN}`;
  }
  return h;
}

/** Check if WebODM/NodeODM is configured and reachable */
export async function checkConnection(): Promise<{ connected: boolean; version?: string; error?: string }> {
  try {
    const res = await fetch(`${WEBODM_URL}/api/`, {
      headers: headers(),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      return { connected: true, version: data.version || "unknown" };
    }

    return { connected: false, error: `HTTP ${res.status}` };
  } catch (err) {
    return { connected: false, error: (err as Error).message };
  }
}

/** Create a new processing task */
export async function createTask(
  projectId: number,
  images: { name: string; data: Blob }[],
  options?: TaskOptions
): Promise<{ uuid: string } | { error: string }> {
  try {
    const formData = new FormData();

    // Add images
    images.forEach((img) => {
      formData.append("images", img.data, img.name);
    });

    // Add processing options
    if (options?.name) {
      formData.append("name", options.name);
    }

    const processingOptions = [
      { name: "dsm", value: "true" },
      { name: "dtm", value: "true" },
      { name: "mesh-octree-depth", value: String(options?.options?.["mesh-octree-depth"] || 11) },
      { name: "mesh-size", value: String(options?.options?.["mesh-size"] || 200000) },
      { name: "pc-quality", value: options?.options?.pc_quality || "high" },
      { name: "feature-quality", value: options?.options?.["feature-quality"] || "high" },
      { name: "use-3dmesh", value: "true" },
    ];

    formData.append("options", JSON.stringify(processingOptions));

    const authHeaders: Record<string, string> = {};
    if (WEBODM_TOKEN) {
      authHeaders["Authorization"] = `JWT ${WEBODM_TOKEN}`;
    }

    const res = await fetch(`${WEBODM_URL}/api/projects/${projectId}/tasks/`, {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: `Failed to create task: ${text}` };
    }

    const data = await res.json();
    return { uuid: data.id };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/** Get task status */
export async function getTaskStatus(
  projectId: number,
  taskId: string
): Promise<TaskStatus | { error: string }> {
  try {
    const res = await fetch(`${WEBODM_URL}/api/projects/${projectId}/tasks/${taskId}/`, {
      headers: headers(),
    });

    if (!res.ok) {
      return { error: `HTTP ${res.status}` };
    }

    return await res.json();
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/** Get task output download URLs */
export async function getTaskOutputs(
  projectId: number,
  taskId: string
): Promise<TaskOutput> {
  const base = `${WEBODM_URL}/api/projects/${projectId}/tasks/${taskId}/download`;
  const token = WEBODM_TOKEN ? `?token=${WEBODM_TOKEN}` : "";

  return {
    orthophoto: `${base}/orthophoto.tif${token}`,
    dsm: `${base}/dsm.tif${token}`,
    dtm: `${base}/dtm.tif${token}`,
    texturedModel: `${base}/textured_model.zip${token}`,
    pointCloud: `${base}/georeferenced_model.laz${token}`,
  };
}

/** Create a project to hold tasks */
export async function createProject(
  name: string,
  description?: string
): Promise<{ id: number } | { error: string }> {
  try {
    const res = await fetch(`${WEBODM_URL}/api/projects/`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ name, description: description || "" }),
    });

    if (!res.ok) {
      return { error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { id: data.id };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/** Helper: status code to human readable */
export function statusCodeToLabel(code: number): string {
  switch (code) {
    case 10: return "Queued";
    case 20: return "Processing";
    case 30: return "Failed";
    case 40: return "Completed";
    case 50: return "Canceled";
    default: return "Unknown";
  }
}
