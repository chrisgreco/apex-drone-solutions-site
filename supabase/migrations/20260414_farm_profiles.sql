-- Broaden spray_alert_subscribers into a general farm_profiles table.
-- Existing subscribers keep working: all old columns are preserved, new columns
-- are nullable with sensible defaults.

-- 1. Rename the table
alter table public.spray_alert_subscribers
  rename to farm_profiles;

-- 2. Add crop profile columns
alter table public.farm_profiles
  add column if not exists crop_primary text
    check (crop_primary in ('blueberry','peach','apple','cranberry','tomato','pepper')),
  add column if not exists crop_variety text,
  add column if not exists crop_stage text
    check (crop_stage in (
      'dormant','bud_swell','tight_cluster','pink_bud','full_bloom',
      'petal_fall','fruit_set','fruit_fill','harvest','post_harvest'
    )),
  add column if not exists acres numeric(8,2),
  add column if not exists alert_prefs jsonb not null default '{"spray_window":true,"frost":true,"disease":true,"chill":true,"pollination":true}'::jsonb,
  add column if not exists source text default 'spray-today';

-- 3. Rename indexes to match new table name
alter index if exists idx_subscribers_email_active rename to idx_farm_profiles_email_active;
alter index if exists idx_subscribers_confirmed rename to idx_farm_profiles_confirmed;
alter index if exists idx_subscribers_location rename to idx_farm_profiles_location;

-- 4. Alerts-sent log: point FK at the renamed table
alter table public.spray_alert_sends
  rename to farm_alert_sends;

alter table public.farm_alert_sends
  rename column subscriber_id to farm_profile_id;

-- Broaden alert_type enum to cover new alert kinds
alter table public.farm_alert_sends
  drop constraint if exists spray_alert_sends_alert_type_check;

alter table public.farm_alert_sends
  add constraint farm_alert_sends_alert_type_check
  check (alert_type in (
    'confirmation','daily_forecast','spray_window_open','frost_warning',
    'disease_pressure','chill_complete','pollination_window'
  ));

-- Keep the existing send-log index name updated
alter index if exists idx_sends_subscriber
  rename to idx_farm_alert_sends_profile;

-- 5. Rename the insert policy so future operators can find it under the new name
alter policy "public insert for signup"
  on public.farm_profiles
  rename to "public insert for signup (farm_profiles)";
