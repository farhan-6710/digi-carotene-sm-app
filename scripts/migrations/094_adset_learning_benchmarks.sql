-- Migration 094 — Ad set / ad group Learning Tab (parallel to campaign Learning).
-- Identity = (ad_account_id, adset_id text) matching growth_ad_adsets.
-- campaign_id is denormalized for navigation only.
-- Run once in Supabase SQL Editor after 093.

create table if not exists public.adset_kpi_config (
  id uuid primary key default gen_random_uuid(),
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  adset_id text not null,
  primary_kpi text not null,
  primary_direction text not null check (primary_direction in ('lower', 'higher')),
  secondary_kpis text[] not null default '{}',
  min_results integer not null default 10,
  qualified_call_seconds integer not null default 60,
  last_goal_change_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, adset_id)
);

drop trigger if exists set_adset_kpi_config_updated_at
  on public.adset_kpi_config;
create trigger set_adset_kpi_config_updated_at
  before update on public.adset_kpi_config
  for each row execute function public.handle_updated_at();

create table if not exists public.adset_benchmarks (
  id uuid primary key default gen_random_uuid(),
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  adset_id text not null,
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

create unique index if not exists adset_benchmarks_one_active_idx
  on public.adset_benchmarks (ad_account_id, adset_id)
  where status = 'active';

create index if not exists adset_benchmarks_adset_idx
  on public.adset_benchmarks (ad_account_id, adset_id, created_at desc);

drop trigger if exists set_adset_benchmarks_updated_at
  on public.adset_benchmarks;
create trigger set_adset_benchmarks_updated_at
  before update on public.adset_benchmarks
  for each row execute function public.handle_updated_at();

alter table public.adset_kpi_config enable row level security;
alter table public.adset_benchmarks enable row level security;

drop policy if exists "adset_kpi_config_all" on public.adset_kpi_config;
create policy "adset_kpi_config_all"
  on public.adset_kpi_config for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "adset_benchmarks_all" on public.adset_benchmarks;
create policy "adset_benchmarks_all"
  on public.adset_benchmarks for all to anon, authenticated
  using (true) with check (true);
