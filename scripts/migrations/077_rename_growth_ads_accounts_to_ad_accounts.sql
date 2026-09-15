-- Migration 077 — Rename growth_ads_accounts → growth_ad_accounts (ad account naming).
-- Reverses the account-table half of 028’s ads_accounts rename; metrics tables stay growth_ads_*.

alter table if exists public.growth_ads_accounts
  rename to growth_ad_accounts;

alter index if exists public.growth_ads_accounts_platform_ad_account_id_key
  rename to growth_ad_accounts_platform_ad_account_id_key;

alter index if exists public.growth_ads_accounts_ad_account_id_key
  rename to growth_ad_accounts_ad_account_id_key;

alter index if exists public.growth_ads_accounts_client_id_idx
  rename to growth_ad_accounts_client_id_idx;

do $$
begin
  alter table public.growth_ad_accounts
    rename constraint growth_ads_accounts_platform_check
    to growth_ad_accounts_platform_check;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_ads_accounts_updated_at
    on public.growth_ad_accounts
    rename to set_growth_ad_accounts_updated_at;
exception
  when undefined_object then null;
end $$;

drop policy if exists "growth_ads_accounts_all" on public.growth_ad_accounts;
drop policy if exists "growth_ad_accounts_all" on public.growth_ad_accounts;
create policy "growth_ad_accounts_all"
  on public.growth_ad_accounts for all to anon, authenticated
  using (true) with check (true);

-- Child ads masters: awkward growth_ads_ads_account_* → growth_ads_ad_account_*
alter index if exists public.growth_ads_ads_account_adset_idx
  rename to growth_ads_ad_account_adset_idx;
