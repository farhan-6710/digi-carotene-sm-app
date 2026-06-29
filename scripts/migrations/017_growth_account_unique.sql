-- Migration 017 — prevent duplicate growth account connections.

create unique index if not exists growth_organic_accounts_platform_account_id_key
  on public.growth_organic_accounts (platform, account_id);

create unique index if not exists growth_ad_accounts_ad_account_id_key
  on public.growth_ad_accounts (ad_account_id);
