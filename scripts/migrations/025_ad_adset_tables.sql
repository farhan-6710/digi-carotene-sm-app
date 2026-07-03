-- Migration 025 — Adset/ad master tables + daily metrics for ads drill-down.
-- Run once in Supabase SQL Editor after 024.

create table if not exists public.growth_adsets (
  id bigserial primary key,
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  adset_id text not null,
  adset_name text not null,
  performance_goal text,
  location_summary text,
  age_summary text,
  custom_targeting_summary text,
  detailed_targeting_summary text,
  placements_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, adset_id)
);

create index if not exists growth_adsets_account_campaign_idx
  on public.growth_adsets (ad_account_id, campaign_id);

create table if not exists public.growth_adset_daily_metrics (
  id bigserial primary key,
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  adset_id text not null,
  adset_name text not null,
  metric_date date not null,
  spend numeric(14, 2) not null default 0,
  impressions integer not null default 0,
  reach integer not null default 0,
  clicks integer not null default 0,
  cpm numeric(14, 2) not null default 0,
  frequency numeric(14, 2) not null default 0,
  conversions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, adset_id, metric_date)
);

create index if not exists growth_adset_daily_metrics_account_date_idx
  on public.growth_adset_daily_metrics (ad_account_id, metric_date desc);

create index if not exists growth_adset_daily_metrics_campaign_idx
  on public.growth_adset_daily_metrics (ad_account_id, campaign_id, metric_date desc);

create table if not exists public.growth_ads (
  id bigserial primary key,
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  adset_id text not null,
  ad_id text not null,
  ad_name text not null,
  thumbnail_url text,
  primary_text text,
  headline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, ad_id)
);

create index if not exists growth_ads_account_adset_idx
  on public.growth_ads (ad_account_id, adset_id);

create table if not exists public.growth_ad_daily_metrics (
  id bigserial primary key,
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  adset_id text not null,
  ad_id text not null,
  ad_name text not null,
  metric_date date not null,
  spend numeric(14, 2) not null default 0,
  impressions integer not null default 0,
  reach integer not null default 0,
  clicks integer not null default 0,
  cpm numeric(14, 2) not null default 0,
  frequency numeric(14, 2) not null default 0,
  conversions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, ad_id, metric_date)
);

create index if not exists growth_ad_daily_metrics_account_date_idx
  on public.growth_ad_daily_metrics (ad_account_id, metric_date desc);

create index if not exists growth_ad_daily_metrics_adset_idx
  on public.growth_ad_daily_metrics (ad_account_id, adset_id, metric_date desc);

drop trigger if exists set_growth_adsets_updated_at on public.growth_adsets;
create trigger set_growth_adsets_updated_at
  before update on public.growth_adsets
  for each row execute function public.handle_updated_at();

drop trigger if exists set_growth_adset_daily_metrics_updated_at
  on public.growth_adset_daily_metrics;
create trigger set_growth_adset_daily_metrics_updated_at
  before update on public.growth_adset_daily_metrics
  for each row execute function public.handle_updated_at();

drop trigger if exists set_growth_ads_updated_at on public.growth_ads;
create trigger set_growth_ads_updated_at
  before update on public.growth_ads
  for each row execute function public.handle_updated_at();

drop trigger if exists set_growth_ad_daily_metrics_updated_at
  on public.growth_ad_daily_metrics;
create trigger set_growth_ad_daily_metrics_updated_at
  before update on public.growth_ad_daily_metrics
  for each row execute function public.handle_updated_at();

alter table public.growth_adsets enable row level security;
alter table public.growth_adset_daily_metrics enable row level security;
alter table public.growth_ads enable row level security;
alter table public.growth_ad_daily_metrics enable row level security;

drop policy if exists "growth_adsets_all" on public.growth_adsets;
create policy "growth_adsets_all"
  on public.growth_adsets for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_adset_daily_metrics_all" on public.growth_adset_daily_metrics;
create policy "growth_adset_daily_metrics_all"
  on public.growth_adset_daily_metrics for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ads_all" on public.growth_ads;
create policy "growth_ads_all"
  on public.growth_ads for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ad_daily_metrics_all" on public.growth_ad_daily_metrics;
create policy "growth_ad_daily_metrics_all"
  on public.growth_ad_daily_metrics for all to anon, authenticated
  using (true) with check (true);
