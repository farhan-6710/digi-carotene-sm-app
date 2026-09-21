-- Migration 081 — Rename growth_ads_* metric/master tables → growth_ad_*.
-- Completes the naming started in 077 (accounts already growth_ad_accounts).
-- Pattern: growth_ad_<thing> — "ad" = paid advertising (vs organic).
-- Ad creative level uses singular "ad" (not "ads"):
--   growth_ads_ads → growth_ad_ad
--   growth_ads_ad_daily_metrics → growth_ad_ad_daily_metrics

-- ── Tables ───────────────────────────────────────────────────────────────────

alter table if exists public.growth_ads_campaign_daily_metrics
  rename to growth_ad_campaign_daily_metrics;

alter table if exists public.growth_ads_adset_daily_metrics
  rename to growth_ad_adset_daily_metrics;

alter table if exists public.growth_ads_ad_daily_metrics
  rename to growth_ad_ad_daily_metrics;

alter table if exists public.growth_ads_adsets
  rename to growth_ad_adsets;

alter table if exists public.growth_ads_ads
  rename to growth_ad_ad;

alter table if exists public.growth_ads_asset_group_daily_metrics
  rename to growth_ad_asset_group_daily_metrics;

alter table if exists public.growth_ads_call_metrics
  rename to growth_ad_call_metrics;

-- ── Indexes ──────────────────────────────────────────────────────────────────

alter index if exists public.growth_ads_campaign_daily_metrics_account_date_idx
  rename to growth_ad_campaign_daily_metrics_account_date_idx;

alter index if exists public.growth_ads_adsets_account_campaign_idx
  rename to growth_ad_adsets_account_campaign_idx;

alter index if exists public.growth_ads_adset_daily_metrics_account_date_idx
  rename to growth_ad_adset_daily_metrics_account_date_idx;

alter index if exists public.growth_ads_adset_daily_metrics_campaign_idx
  rename to growth_ad_adset_daily_metrics_campaign_idx;

alter index if exists public.growth_ads_ad_account_adset_idx
  rename to growth_ad_ad_account_adset_idx;

alter index if exists public.growth_ads_ads_account_adset_idx
  rename to growth_ad_ad_account_adset_idx;

alter index if exists public.growth_ads_ad_daily_metrics_account_date_idx
  rename to growth_ad_ad_daily_metrics_account_date_idx;

alter index if exists public.growth_ads_ad_daily_metrics_adset_idx
  rename to growth_ad_ad_daily_metrics_adset_idx;

alter index if exists public.growth_ads_asset_group_daily_metrics_account_date_idx
  rename to growth_ad_asset_group_daily_metrics_account_date_idx;

alter index if exists public.growth_ads_call_metrics_account_campaign_idx
  rename to growth_ad_call_metrics_account_campaign_idx;

-- ── Triggers ─────────────────────────────────────────────────────────────────

do $$
begin
  alter trigger set_growth_ads_campaign_daily_metrics_updated_at
    on public.growth_ad_campaign_daily_metrics
    rename to set_growth_ad_campaign_daily_metrics_updated_at;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_ads_adsets_updated_at
    on public.growth_ad_adsets
    rename to set_growth_ad_adsets_updated_at;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_ads_adset_daily_metrics_updated_at
    on public.growth_ad_adset_daily_metrics
    rename to set_growth_ad_adset_daily_metrics_updated_at;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_ads_ads_updated_at
    on public.growth_ad_ad
    rename to set_growth_ad_ad_updated_at;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_ads_ad_daily_metrics_updated_at
    on public.growth_ad_ad_daily_metrics
    rename to set_growth_ad_ad_daily_metrics_updated_at;
exception
  when undefined_object then null;
end $$;

-- ── RLS policies (recreate with new names) ───────────────────────────────────

drop policy if exists "growth_ads_campaign_daily_metrics_all"
  on public.growth_ad_campaign_daily_metrics;
drop policy if exists "growth_ad_campaign_daily_metrics_all"
  on public.growth_ad_campaign_daily_metrics;
create policy "growth_ad_campaign_daily_metrics_all"
  on public.growth_ad_campaign_daily_metrics for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ads_adsets_all" on public.growth_ad_adsets;
drop policy if exists "growth_ad_adsets_all" on public.growth_ad_adsets;
create policy "growth_ad_adsets_all"
  on public.growth_ad_adsets for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ads_adset_daily_metrics_all"
  on public.growth_ad_adset_daily_metrics;
drop policy if exists "growth_ad_adset_daily_metrics_all"
  on public.growth_ad_adset_daily_metrics;
create policy "growth_ad_adset_daily_metrics_all"
  on public.growth_ad_adset_daily_metrics for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ads_ads_all" on public.growth_ad_ad;
drop policy if exists "growth_ad_ads_all" on public.growth_ad_ad;
drop policy if exists "growth_ad_ad_all" on public.growth_ad_ad;
create policy "growth_ad_ad_all"
  on public.growth_ad_ad for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ads_ad_daily_metrics_all"
  on public.growth_ad_ad_daily_metrics;
drop policy if exists "growth_ad_ads_daily_metrics_all"
  on public.growth_ad_ad_daily_metrics;
drop policy if exists "growth_ad_ad_daily_metrics_all"
  on public.growth_ad_ad_daily_metrics;
create policy "growth_ad_ad_daily_metrics_all"
  on public.growth_ad_ad_daily_metrics for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ads_asset_group_daily_metrics_all"
  on public.growth_ad_asset_group_daily_metrics;
drop policy if exists "growth_ad_asset_group_daily_metrics_all"
  on public.growth_ad_asset_group_daily_metrics;
create policy "growth_ad_asset_group_daily_metrics_all"
  on public.growth_ad_asset_group_daily_metrics for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ads_call_metrics_all" on public.growth_ad_call_metrics;
drop policy if exists "growth_ad_call_metrics_all" on public.growth_ad_call_metrics;
create policy "growth_ad_call_metrics_all"
  on public.growth_ad_call_metrics for all to anon, authenticated
  using (true) with check (true);
