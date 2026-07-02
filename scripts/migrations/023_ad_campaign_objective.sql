-- Migration 023 — Campaign objective on daily metrics.
-- Run once in Supabase SQL Editor after 022.

alter table public.growth_ad_campaign_daily_metrics
  add column if not exists objective text;
