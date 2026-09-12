-- Migration 076 — Ads account platform (Meta vs Google) + Google Ads credentials.
-- Existing rows default to meta_ads. Unique key becomes (platform, ad_account_id).

alter table public.growth_ads_accounts
  add column if not exists platform text not null default 'meta_ads';

alter table public.growth_ads_accounts
  drop constraint if exists growth_ads_accounts_platform_check;

alter table public.growth_ads_accounts
  add constraint growth_ads_accounts_platform_check
  check (platform in ('meta_ads', 'google_ads'));

alter table public.growth_ads_accounts
  add column if not exists login_customer_id text,
  add column if not exists developer_token text,
  add column if not exists oauth_client_id text,
  add column if not exists oauth_client_secret text,
  add column if not exists oauth_refresh_token text;

-- Prefer composite uniqueness so Meta act_… and Google customer IDs can coexist.
alter table public.growth_ads_accounts
  drop constraint if exists growth_ads_accounts_ad_account_id_key;

alter table public.growth_ads_accounts
  drop constraint if exists growth_ad_accounts_ad_account_id_key;

drop index if exists public.growth_ads_accounts_ad_account_id_key;

create unique index if not exists growth_ads_accounts_platform_ad_account_id_key
  on public.growth_ads_accounts (platform, ad_account_id);
