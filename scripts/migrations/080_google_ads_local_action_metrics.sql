-- Migration 080 — Google Local / Call local-action metrics on campaign daily rows.
-- Maps to Google Ads location-asset metrics (Smart / Local campaign UI).

alter table public.growth_ads_campaign_daily_metrics
  add column if not exists local_shop_visits numeric(14, 4) not null default 0,
  add column if not exists local_website_visits numeric(14, 4) not null default 0,
  add column if not exists local_direction_views numeric(14, 4) not null default 0,
  add column if not exists local_calls numeric(14, 4) not null default 0,
  add column if not exists local_orders numeric(14, 4) not null default 0,
  add column if not exists local_menu_views numeric(14, 4) not null default 0,
  add column if not exists local_other_actions numeric(14, 4) not null default 0;
