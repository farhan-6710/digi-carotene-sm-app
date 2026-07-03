-- Migration 024 — Reach, CPM, and frequency on ad campaign daily metrics.
-- Run once in Supabase SQL Editor after 023.

alter table public.growth_ad_campaign_daily_metrics
  add column if not exists reach integer not null default 0,
  add column if not exists cpm numeric(14, 2) not null default 0,
  add column if not exists frequency numeric(8, 2) not null default 0;
