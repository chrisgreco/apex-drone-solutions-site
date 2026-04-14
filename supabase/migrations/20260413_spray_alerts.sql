-- Spray alerts: pre-launch email list + per-farm saved forecast locations
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create table public.spray_alert_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  farm_name text,
  latitude double precision not null,
  longitude double precision not null,
  location_label text,
  confirmed boolean not null default false,
  confirmation_token text unique,
  unsubscribe_token text unique not null default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  last_alert_sent_at timestamptz,
  alerts_sent_count integer not null default 0
);

create unique index idx_subscribers_email_active
  on public.spray_alert_subscribers (lower(email))
  where unsubscribed_at is null;

create index idx_subscribers_confirmed
  on public.spray_alert_subscribers (confirmed)
  where confirmed = true and unsubscribed_at is null;

create index idx_subscribers_location
  on public.spray_alert_subscribers (latitude, longitude);

alter table public.spray_alert_subscribers enable row level security;

-- Public signup: anon role can insert, but not read/update/delete
create policy "public insert for signup"
  on public.spray_alert_subscribers
  for insert
  to anon
  with check (true);

-- Log of alerts sent (for rate limiting + analytics)
create table public.spray_alert_sends (
  id uuid primary key default uuid_generate_v4(),
  subscriber_id uuid not null references public.spray_alert_subscribers(id) on delete cascade,
  sent_at timestamptz not null default now(),
  alert_type text not null check (alert_type in ('confirmation','daily_forecast','window_open')),
  forecast_summary jsonb,
  resend_message_id text
);

create index idx_sends_subscriber on public.spray_alert_sends(subscriber_id, sent_at desc);

alter table public.spray_alert_sends enable row level security;
-- No policies on sends table — server-only writes via service_role
