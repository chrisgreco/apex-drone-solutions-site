// ─── Enums ─────────────────────────────────────────────────

export const JOB_TYPES = [
  "roof_inspection",
  "property_survey",
  "storm_damage",
  "insurance_claim",
  "maintenance",
] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  roof_inspection: "Roof Inspection",
  property_survey: "Property Survey",
  storm_damage: "Storm Damage",
  insurance_claim: "Insurance Claim",
  maintenance: "Maintenance",
};

export const JOB_STATUSES = [
  "setup",
  "ready_to_fly",
  "flying",
  "uploading",
  "analyzing",
  "review",
  "report_ready",
  "complete",
  "archived",
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  setup: "Setup",
  ready_to_fly: "Ready to Fly",
  flying: "In Flight",
  uploading: "Uploading",
  analyzing: "Analyzing",
  review: "In Review",
  report_ready: "Report Ready",
  complete: "Complete",
  archived: "Archived",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  setup: "bg-neutral-200 text-neutral-700",
  ready_to_fly: "bg-primary-100 text-primary-700",
  flying: "bg-accent-100 text-accent-700",
  uploading: "bg-accent-100 text-accent-700",
  analyzing: "bg-yellow-100 text-yellow-700",
  review: "bg-yellow-100 text-yellow-700",
  report_ready: "bg-success-100 text-success-500",
  complete: "bg-success-100 text-success-500",
  archived: "bg-neutral-100 text-neutral-400",
};

export const PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const ROLES = ["admin", "adjuster", "contractor", "pilot"] as const;
export type UserRole = (typeof ROLES)[number];

export const IMAGE_TYPES = [
  "overview",
  "nadir",
  "oblique",
  "close_up",
  "interior",
] as const;
export type ImageType = (typeof IMAGE_TYPES)[number];

export const DAMAGE_TYPES = [
  "hail",
  "wind",
  "impact",
  "granule_loss",
  "cracking",
  "missing_shingle",
  "flashing_damage",
  "ponding",
  "debris",
  "mechanical",
  "other",
] as const;
export type DamageType = (typeof DAMAGE_TYPES)[number];

export const SEVERITY_LEVELS = ["low", "medium", "high", "critical"] as const;
export type Severity = (typeof SEVERITY_LEVELS)[number];

// ─── Interfaces ────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "professional" | "enterprise";
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  organization_id: string | null;
  created_by: string;
  claim_number: string | null;
  policy_number: string | null;
  carrier: string | null;
  job_type: JobType;
  property_address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  roof_boundary: Record<string, unknown> | null;
  status: JobStatus;
  priority: Priority;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobImage {
  id: string;
  job_id: string;
  uploaded_by: string;
  storage_path: string;
  filename: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  taken_at: string | null;
  lat: number | null;
  lng: number | null;
  altitude_m: number | null;
  heading_deg: number | null;
  image_type: ImageType;
  slope_tag: string | null;
  analysis_status: "pending" | "processing" | "complete" | "failed";
  created_at: string;
}

export interface AnalysisJob {
  id: string;
  job_id: string;
  triggered_by: string;
  status: "queued" | "processing" | "complete" | "failed";
  model_version: string | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  total_images: number | null;
  flagged_images: number | null;
  confidence_avg: number | null;
  created_at: string;
  updated_at: string;
}

export interface DamageFinding {
  id: string;
  analysis_job_id: string;
  job_image_id: string;
  damage_type: DamageType;
  severity: Severity;
  confidence: number;
  bbox_x: number | null;
  bbox_y: number | null;
  bbox_w: number | null;
  bbox_h: number | null;
  polygon_points: number[][] | null;
  notes: string | null;
  reviewed: boolean;
  reviewer_id: string | null;
  created_at: string;
}

export interface RoofModel {
  id: string;
  job_id: string;
  analysis_job_id: string | null;
  glb_path: string | null;
  thumbnail_path: string | null;
  pointcloud_path: string | null;
  total_area_sqft: number | null;
  ridge_length_ft: number | null;
  eave_length_ft: number | null;
  valley_length_ft: number | null;
  hip_length_ft: number | null;
  pitch_data: { slope_name: string; pitch: string; area_sqft: number }[] | null;
  created_at: string;
}

export interface Report {
  id: string;
  job_id: string;
  generated_by: string;
  analysis_job_id: string | null;
  status: "generating" | "ready" | "failed";
  pdf_path: string | null;
  html_path: string | null;
  xactimate_path: string | null;
  report_type: "standard" | "summary" | "xactimate";
  version: number;
  created_at: string;
  updated_at: string;
}
