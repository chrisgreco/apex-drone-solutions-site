-- Apex Drone Solutions Platform Schema
-- Initial migration: profiles, organizations, jobs, images, analysis, reports

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'inspector' check (role in ('admin', 'manager', 'inspector', 'viewer')),
  organization_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;

-- Add FK after org table exists
alter table public.profiles
  add constraint profiles_organization_fk
  foreign key (organization_id) references public.organizations(id);

create policy "Org members can read their org"
  on public.organizations for select
  using (id in (select organization_id from public.profiles where id = auth.uid()));

-- ============================================================
-- JOBS
-- ============================================================
create table public.jobs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id),
  created_by uuid not null references auth.users(id),
  job_type text not null default 'roof_inspection'
    check (job_type in ('roof_inspection', 'property_survey', 'storm_damage', 'insurance_claim', 'maintenance')),
  status text not null default 'setup'
    check (status in ('setup', 'ready_to_fly', 'flying', 'uploading', 'analyzing', 'review', 'report_ready', 'complete', 'archived')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  property_address text not null,
  city text,
  state text,
  zip text,
  latitude double precision,
  longitude double precision,
  claim_number text,
  policy_number text,
  carrier text,
  notes text,
  roof_boundary jsonb, -- GeoJSON polygon from map tool
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "Users can read own jobs"
  on public.jobs for select using (created_by = auth.uid());

create policy "Users can insert jobs"
  on public.jobs for insert with check (created_by = auth.uid());

create policy "Users can update own jobs"
  on public.jobs for update using (created_by = auth.uid());

create index idx_jobs_created_by on public.jobs(created_by);
create index idx_jobs_status on public.jobs(status);
create index idx_jobs_created_at on public.jobs(created_at desc);

-- ============================================================
-- JOB IMAGES
-- ============================================================
create table public.job_images (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  file_size bigint,
  mime_type text,
  image_type text default 'aerial'
    check (image_type in ('aerial', 'closeup', 'thermal', 'orthomosaic', 'other')),
  metadata jsonb, -- EXIF data, GPS coords, etc.
  created_at timestamptz not null default now()
);

alter table public.job_images enable row level security;

create policy "Users can read images for their jobs"
  on public.job_images for select
  using (job_id in (select id from public.jobs where created_by = auth.uid()));

create policy "Users can insert images for their jobs"
  on public.job_images for insert
  with check (job_id in (select id from public.jobs where created_by = auth.uid()));

create index idx_job_images_job_id on public.job_images(job_id);

-- ============================================================
-- ANALYSIS JOBS (AI processing runs)
-- ============================================================
create table public.analysis_jobs (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'complete', 'failed')),
  model_version text,
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  summary jsonb, -- overall stats: total findings, images analyzed, avg confidence
  created_at timestamptz not null default now()
);

alter table public.analysis_jobs enable row level security;

create policy "Users can read analysis for their jobs"
  on public.analysis_jobs for select
  using (job_id in (select id from public.jobs where created_by = auth.uid()));

create index idx_analysis_jobs_job_id on public.analysis_jobs(job_id);

-- ============================================================
-- DAMAGE FINDINGS
-- ============================================================
create table public.damage_findings (
  id uuid primary key default uuid_generate_v4(),
  analysis_job_id uuid not null references public.analysis_jobs(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  image_id uuid references public.job_images(id),
  damage_type text not null
    check (damage_type in ('hail', 'wind', 'granule_loss', 'missing_shingle', 'crack', 'ponding', 'flashing', 'debris', 'other')),
  severity text not null default 'medium'
    check (severity in ('low', 'medium', 'high', 'critical')),
  confidence double precision not null check (confidence >= 0 and confidence <= 1),
  bounding_box jsonb, -- {x, y, width, height} normalized coords on source image
  location_on_roof jsonb, -- {lat, lng} or roof-relative coords
  notes text,
  created_at timestamptz not null default now()
);

alter table public.damage_findings enable row level security;

create policy "Users can read findings for their jobs"
  on public.damage_findings for select
  using (job_id in (select id from public.jobs where created_by = auth.uid()));

create index idx_damage_findings_analysis on public.damage_findings(analysis_job_id);
create index idx_damage_findings_job on public.damage_findings(job_id);

-- ============================================================
-- ROOF MODELS (3D photogrammetry)
-- ============================================================
create table public.roof_models (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  storage_path text not null, -- path to GLB/GLTF in storage
  format text default 'glb' check (format in ('glb', 'gltf', 'obj')),
  roof_area_sqft double precision,
  primary_pitch text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.roof_models enable row level security;

create policy "Users can read models for their jobs"
  on public.roof_models for select
  using (job_id in (select id from public.jobs where created_by = auth.uid()));

create index idx_roof_models_job_id on public.roof_models(job_id);

-- ============================================================
-- REPORTS
-- ============================================================
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  format text not null default 'pdf'
    check (format in ('pdf', 'html', 'esx')),
  storage_path text,
  generated_by uuid references auth.users(id),
  metadata jsonb, -- page count, file size, etc.
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Users can read reports for their jobs"
  on public.reports for select
  using (job_id in (select id from public.jobs where created_by = auth.uid()));

create policy "Users can create reports for their jobs"
  on public.reports for insert
  with check (job_id in (select id from public.jobs where created_by = auth.uid()));

create index idx_reports_job_id on public.reports(job_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
values ('job-images', 'job-images', false);

-- Storage policies: users can upload/read images for their jobs
create policy "Users can upload job images"
  on storage.objects for insert
  with check (
    bucket_id = 'job-images'
    and (storage.foldername(name))[1] = 'jobs'
  );

create policy "Users can read job images"
  on storage.objects for select
  using (bucket_id = 'job-images');

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();
