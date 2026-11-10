-- Migration 092 — Campaign Learning Tab foundation (M1 + M2).
-- last_synced_at, job_runs, settings snapshots, KPI config, benchmarks.
-- Run once in Supabase SQL Editor after 091.
-- Campaign identity = (ad_account_id, campaign_id text) matching growth_ad_* tables.

alter table public.growth_ad_accounts
  add column if not exists last_synced_at timestamptz;

update public.growth_ad_accounts
set last_synced_at = updated_at
where last_synced_at is null;

create table if not exists public.growth_job_runs (
  id uuid primary key default gen_random_uuid(),
  job text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running'
    check (status in ('running', 'success', 'error')),
  error text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_job_runs_job_started_idx
  on public.growth_job_runs (job, started_at desc);

create table if not exists public.campaign_settings_snapshots (
  id uuid primary key default gen_random_uuid(),
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  snapshot_date date not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, campaign_id, snapshot_date)
);

drop trigger if exists set_campaign_settings_snapshots_updated_at
  on public.campaign_settings_snapshots;
create trigger set_campaign_settings_snapshots_updated_at
  before update on public.campaign_settings_snapshots
  for each row execute function public.handle_updated_at();

create table if not exists public.campaign_kpi_config (
  id uuid primary key default gen_random_uuid(),
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  primary_kpi text not null,
  primary_direction text not null check (primary_direction in ('lower', 'higher')),
  secondary_kpis text[] not null default '{}',
  min_results integer not null default 10,
  qualified_call_seconds integer not null default 60,
  last_goal_change_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, campaign_id)
);

drop trigger if exists set_campaign_kpi_config_updated_at
  on public.campaign_kpi_config;
create trigger set_campaign_kpi_config_updated_at
  before update on public.campaign_kpi_config
  for each row execute function public.handle_updated_at();

create table if not exists public.campaign_benchmarks (
  id uuid primary key default gen_random_uuid(),
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  platform text not null check (platform in ('meta_ads', 'google_ads')),
  mode text not null check (mode in ('auto', 'manual', 'client_target')),
  method text check (method in ('top3', 'best', 'p80') or method is null),
  window_days integer,
  lookback_days integer,
  min_results integer,
  values jsonb not null default '{}'::jsonb,
  locked_kpis text[] not null default '{}',
  edited_kpis text[] not null default '{}',
  best_windows daterange[] not null default '{}',
  eligible_windows integer not null default 0,
  excluded jsonb not null default '{}'::jsonb,
  attribution_setting text,
  currency text not null default 'INR',
  reason text,
  agreed_with text,
  agreed_on date,
  status text not null default 'active'
    check (status in ('active', 'pending', 'suggested', 'superseded', 'rejected')),
  auto_advance boolean not null default false,
  suggest_updates boolean not null default true,
  needs_review boolean not null default false,
  created_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  superseded_at timestamptz,
  new_best_dismissed_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists campaign_benchmarks_one_active_idx
  on public.campaign_benchmarks (ad_account_id, campaign_id)
  where status = 'active';

create index if not exists campaign_benchmarks_campaign_idx
  on public.campaign_benchmarks (ad_account_id, campaign_id, created_at desc);

drop trigger if exists set_campaign_benchmarks_updated_at
  on public.campaign_benchmarks;
create trigger set_campaign_benchmarks_updated_at
  before update on public.campaign_benchmarks
  for each row execute function public.handle_updated_at();

alter table public.growth_job_runs enable row level security;
alter table public.campaign_settings_snapshots enable row level security;
alter table public.campaign_kpi_config enable row level security;
alter table public.campaign_benchmarks enable row level security;

drop policy if exists "growth_job_runs_all" on public.growth_job_runs;
create policy "growth_job_runs_all"
  on public.growth_job_runs for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "campaign_settings_snapshots_all" on public.campaign_settings_snapshots;
create policy "campaign_settings_snapshots_all"
  on public.campaign_settings_snapshots for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "campaign_kpi_config_all" on public.campaign_kpi_config;
create policy "campaign_kpi_config_all"
  on public.campaign_kpi_config for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "campaign_benchmarks_all" on public.campaign_benchmarks;
create policy "campaign_benchmarks_all"
  on public.campaign_benchmarks for all to anon, authenticated
  using (true) with check (true);
