-- Migration 016 — Growth & Analytics (schema only, no seed data).
-- Run once in Supabase SQL Editor. Connect accounts in the app to populate data.
--
-- Growth route is public, so tables allow anon + authenticated (V1 internal tool).
-- Lock down RLS before production.

create table public.growth_organic_accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('instagram', 'facebook')),
  account_name text not null,
  account_id text not null,
  access_token text,
  followers integer not null default 0,
  profile_picture text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_growth_organic_accounts_updated_at
  before update on public.growth_organic_accounts
  for each row execute function public.handle_updated_at();

create table public.growth_ad_accounts (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  account_name text not null,
  ad_account_id text not null,
  access_token text,
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_growth_ad_accounts_updated_at
  before update on public.growth_ad_accounts
  for each row execute function public.handle_updated_at();

create table public.growth_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.growth_organic_accounts (id) on delete cascade,
  metric_date date not null,
  followers integer not null default 0,
  new_followers integer not null default 0,
  reach integer not null default 0,
  impressions integer not null default 0,
  engagement integer not null default 0,
  unique (account_id, metric_date)
);

create table public.growth_posts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.growth_organic_accounts (id) on delete cascade,
  caption text not null,
  media_type text not null check (media_type in ('Reel', 'Image', 'Carousel', 'Story')),
  reach integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  saves integer not null default 0,
  engagement_rate numeric(5, 2) not null default 0,
  posted_at date not null,
  created_at timestamptz not null default now()
);

create table public.growth_campaign_metrics (
  id uuid primary key default gen_random_uuid(),
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_name text not null,
  status text not null check (status in ('Active', 'Paused', 'Completed')),
  spend integer not null default 0,
  impressions integer not null default 0,
  clicks integer not null default 0,
  conversions integer not null default 0,
  metric_date date not null,
  created_at timestamptz not null default now()
);

create table public.growth_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('instagram', 'facebook', 'campaigns', 'content_performance')),
  platform text not null,
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now()
);

alter table public.growth_organic_accounts enable row level security;
alter table public.growth_ad_accounts enable row level security;
alter table public.growth_daily_metrics enable row level security;
alter table public.growth_posts enable row level security;
alter table public.growth_campaign_metrics enable row level security;
alter table public.growth_reports enable row level security;

create policy "growth_organic_accounts_all"
  on public.growth_organic_accounts for all to anon, authenticated
  using (true) with check (true);

create policy "growth_ad_accounts_all"
  on public.growth_ad_accounts for all to anon, authenticated
  using (true) with check (true);

create policy "growth_daily_metrics_all"
  on public.growth_daily_metrics for all to anon, authenticated
  using (true) with check (true);

create policy "growth_posts_all"
  on public.growth_posts for all to anon, authenticated
  using (true) with check (true);

create policy "growth_campaign_metrics_all"
  on public.growth_campaign_metrics for all to anon, authenticated
  using (true) with check (true);

create policy "growth_reports_all"
  on public.growth_reports for all to anon, authenticated
  using (true) with check (true);
