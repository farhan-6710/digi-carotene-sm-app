-- Migration 022 — Ad campaign daily metrics + currencies lookup.
-- Run once in Supabase SQL Editor after 021.

create table public.currencies (
  code text primary key,
  name text not null,
  symbol text not null
);

insert into public.currencies (code, name, symbol)
values ('INR', 'Indian Rupee', '₹')
on conflict (code) do nothing;

create table public.ad_campaign_daily_metrics (
  id bigserial primary key,
  ad_account_id uuid not null references public.growth_ad_accounts (id) on delete cascade,
  campaign_id text not null,
  campaign_name text not null,
  status text not null check (status in ('Active', 'Paused', 'Completed')),
  metric_date date not null,
  spend numeric(14, 2) not null default 0,
  impressions integer not null default 0,
  clicks integer not null default 0,
  conversions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ad_account_id, campaign_id, metric_date)
);

create index ad_campaign_daily_metrics_account_date_idx
  on public.ad_campaign_daily_metrics (ad_account_id, metric_date desc);

create trigger set_ad_campaign_daily_metrics_updated_at
  before update on public.ad_campaign_daily_metrics
  for each row execute function public.handle_updated_at();

alter table public.growth_ad_accounts
  add column if not exists currency_code text references public.currencies (code);

update public.growth_ad_accounts
set currency_code = coalesce(nullif(currency, ''), 'INR')
where currency_code is null;

alter table public.growth_ad_accounts
  alter column currency_code set default 'INR';

alter table public.growth_ad_accounts
  alter column currency_code set not null;

alter table public.growth_ad_accounts
  drop column if exists currency;

alter table public.currencies enable row level security;
alter table public.ad_campaign_daily_metrics enable row level security;

create policy "currencies_read"
  on public.currencies for select to anon, authenticated
  using (true);

create policy "ad_campaign_daily_metrics_all"
  on public.ad_campaign_daily_metrics for all to anon, authenticated
  using (true) with check (true);
