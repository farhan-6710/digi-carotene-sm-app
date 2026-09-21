-- Migration 082 — Rename growth_ad_ad_daily_metrics → growth_ad_daily_metrics.
-- Drops the repeated "ad" segment (campaign/adset already name their level).

alter table if exists public.growth_ad_ad_daily_metrics
  rename to growth_ad_daily_metrics;

alter index if exists public.growth_ad_ad_daily_metrics_account_date_idx
  rename to growth_ad_daily_metrics_account_date_idx;

alter index if exists public.growth_ad_ad_daily_metrics_adset_idx
  rename to growth_ad_daily_metrics_adset_idx;

do $$
begin
  alter trigger set_growth_ad_ad_daily_metrics_updated_at
    on public.growth_ad_daily_metrics
    rename to set_growth_ad_daily_metrics_updated_at;
exception
  when undefined_object then null;
end $$;

drop policy if exists "growth_ad_ad_daily_metrics_all"
  on public.growth_ad_daily_metrics;
drop policy if exists "growth_ad_daily_metrics_all"
  on public.growth_ad_daily_metrics;
create policy "growth_ad_daily_metrics_all"
  on public.growth_ad_daily_metrics for all to anon, authenticated
  using (true) with check (true);
