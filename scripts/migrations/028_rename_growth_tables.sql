-- Migration 028 — Rename Growth & Analytics tables to consistent prefixes.
-- Organic: growth_organic_*
-- Ads:     growth_ads_*
-- Apply on existing projects only. Do not edit earlier migrations.

-- ── Organic tables ───────────────────────────────────────────────────────────

alter table if exists public.instagram_profiles
  rename to growth_organic_profiles;

alter table if exists public.past_posts_metrics
  rename to growth_organic_posts_metrics;

alter table if exists public.instagram_daily_followers
  rename to growth_organic_daily_followers;

alter index if exists public.past_posts_metrics_account_created_idx
  rename to growth_organic_posts_metrics_account_created_idx;

alter index if exists public.instagram_daily_followers_account_date_idx
  rename to growth_organic_daily_followers_account_date_idx;

do $$
begin
  alter trigger set_instagram_profiles_updated_at
    on public.growth_organic_profiles
    rename to set_growth_organic_profiles_updated_at;
exception
  when undefined_object then null;
end $$;

drop policy if exists "instagram_profiles_all" on public.growth_organic_profiles;
create policy "growth_organic_profiles_all"
  on public.growth_organic_profiles for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "past_posts_metrics_all" on public.growth_organic_posts_metrics;
create policy "growth_organic_posts_metrics_all"
  on public.growth_organic_posts_metrics for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "instagram_daily_followers_all" on public.growth_organic_daily_followers;
create policy "growth_organic_daily_followers_all"
  on public.growth_organic_daily_followers for all to anon, authenticated
  using (true) with check (true);

-- ── Ads accounts ─────────────────────────────────────────────────────────────

alter table if exists public.growth_ad_accounts
  rename to growth_ads_accounts;

alter index if exists public.growth_ad_accounts_ad_account_id_key
  rename to growth_ads_accounts_ad_account_id_key;

do $$
begin
  alter trigger set_growth_ad_accounts_updated_at
    on public.growth_ads_accounts
    rename to set_growth_ads_accounts_updated_at;
exception
  when undefined_object then null;
end $$;

drop policy if exists "growth_ad_accounts_all" on public.growth_ads_accounts;
create policy "growth_ads_accounts_all"
  on public.growth_ads_accounts for all to anon, authenticated
  using (true) with check (true);

-- ── Ads metrics / masters ────────────────────────────────────────────────────

alter table if exists public.growth_ad_campaign_daily_metrics
  rename to growth_ads_campaign_daily_metrics;

alter table if exists public.growth_adsets
  rename to growth_ads_adsets;

alter table if exists public.growth_adset_daily_metrics
  rename to growth_ads_adset_daily_metrics;

alter table if exists public.growth_ads
  rename to growth_ads_ads;

alter table if exists public.growth_ad_daily_metrics
  rename to growth_ads_ad_daily_metrics;

alter index if exists public.growth_ad_campaign_daily_metrics_account_date_idx
  rename to growth_ads_campaign_daily_metrics_account_date_idx;

alter index if exists public.growth_adsets_account_campaign_idx
  rename to growth_ads_adsets_account_campaign_idx;

alter index if exists public.growth_adset_daily_metrics_account_date_idx
  rename to growth_ads_adset_daily_metrics_account_date_idx;

alter index if exists public.growth_adset_daily_metrics_campaign_idx
  rename to growth_ads_adset_daily_metrics_campaign_idx;

alter index if exists public.growth_ads_account_adset_idx
  rename to growth_ads_ads_account_adset_idx;

alter index if exists public.growth_ad_daily_metrics_account_date_idx
  rename to growth_ads_ad_daily_metrics_account_date_idx;

alter index if exists public.growth_ad_daily_metrics_adset_idx
  rename to growth_ads_ad_daily_metrics_adset_idx;

do $$
begin
  alter trigger set_growth_ad_campaign_daily_metrics_updated_at
    on public.growth_ads_campaign_daily_metrics
    rename to set_growth_ads_campaign_daily_metrics_updated_at;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_adsets_updated_at
    on public.growth_ads_adsets
    rename to set_growth_ads_adsets_updated_at;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_adset_daily_metrics_updated_at
    on public.growth_ads_adset_daily_metrics
    rename to set_growth_ads_adset_daily_metrics_updated_at;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_ads_updated_at
    on public.growth_ads_ads
    rename to set_growth_ads_ads_updated_at;
exception
  when undefined_object then null;
end $$;

do $$
begin
  alter trigger set_growth_ad_daily_metrics_updated_at
    on public.growth_ads_ad_daily_metrics
    rename to set_growth_ads_ad_daily_metrics_updated_at;
exception
  when undefined_object then null;
end $$;

drop policy if exists "growth_ad_campaign_daily_metrics_all"
  on public.growth_ads_campaign_daily_metrics;
create policy "growth_ads_campaign_daily_metrics_all"
  on public.growth_ads_campaign_daily_metrics for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_adsets_all" on public.growth_ads_adsets;
create policy "growth_ads_adsets_all"
  on public.growth_ads_adsets for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_adset_daily_metrics_all"
  on public.growth_ads_adset_daily_metrics;
create policy "growth_ads_adset_daily_metrics_all"
  on public.growth_ads_adset_daily_metrics for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ads_all" on public.growth_ads_ads;
create policy "growth_ads_ads_all"
  on public.growth_ads_ads for all to anon, authenticated
  using (true) with check (true);

drop policy if exists "growth_ad_daily_metrics_all"
  on public.growth_ads_ad_daily_metrics;
create policy "growth_ads_ad_daily_metrics_all"
  on public.growth_ads_ad_daily_metrics for all to anon, authenticated
  using (true) with check (true);
