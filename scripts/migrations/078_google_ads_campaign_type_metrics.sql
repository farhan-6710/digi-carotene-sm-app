-- Migration 078 — Google Ads campaign-type KPI columns + asset-group / call tables.
-- Matches docs Campaign Type Matrix (Phase 1–3 campaign-level + PMax/call resources).

-- ── Campaign daily metrics (nullable type-specific / Phase 1 value fields) ───

alter table public.growth_ads_campaign_daily_metrics
  add column if not exists conversion_value numeric(14, 2) not null default 0,
  add column if not exists search_impression_share numeric(8, 6),
  add column if not exists search_budget_lost_impression_share numeric(8, 6),
  add column if not exists search_rank_lost_impression_share numeric(8, 6),
  add column if not exists active_view_viewability numeric(8, 6),
  add column if not exists video_views bigint not null default 0,
  add column if not exists average_cpv numeric(14, 6),
  add column if not exists video_quartile_p25_rate numeric(8, 6),
  add column if not exists video_quartile_p50_rate numeric(8, 6),
  add column if not exists video_quartile_p75_rate numeric(8, 6),
  add column if not exists video_quartile_p100_rate numeric(8, 6);

-- ── Performance Max asset-group daily metrics (Phase 2) ─────────────────────

create table if not exists public.growth_ads_asset_group_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  asset_group_id text not null,
  asset_group_name text,
  metric_date date not null,
  ad_network_type text not null default 'UNSPECIFIED',
  spend numeric(14, 2) not null default 0,
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  conversions numeric(14, 4) not null default 0,
  conversion_value numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, asset_group_id, metric_date, ad_network_type)
);

create index if not exists growth_ads_asset_group_daily_metrics_account_date_idx
  on public.growth_ads_asset_group_daily_metrics (ad_account_id, metric_date);

alter table public.growth_ads_asset_group_daily_metrics enable row level security;

drop policy if exists "growth_ads_asset_group_daily_metrics_all"
  on public.growth_ads_asset_group_daily_metrics;
create policy "growth_ads_asset_group_daily_metrics_all"
  on public.growth_ads_asset_group_daily_metrics for all to anon, authenticated
  using (true) with check (true);

-- ── Call metrics (Phase 3 — Local / Call) ───────────────────────────────────

create table if not exists public.growth_ads_call_metrics (
  id uuid primary key default gen_random_uuid(),
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  call_resource_name text not null,
  start_call_at timestamptz,
  end_call_at timestamptz,
  call_duration_seconds int,
  call_status text,
  caller_area_code text,
  caller_country_code text,
  call_tracking_display_location text,
  metric_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, call_resource_name)
);

create index if not exists growth_ads_call_metrics_account_campaign_idx
  on public.growth_ads_call_metrics (ad_account_id, campaign_id);

alter table public.growth_ads_call_metrics enable row level security;

drop policy if exists "growth_ads_call_metrics_all" on public.growth_ads_call_metrics;
create policy "growth_ads_call_metrics_all"
  on public.growth_ads_call_metrics for all to anon, authenticated
  using (true) with check (true);
