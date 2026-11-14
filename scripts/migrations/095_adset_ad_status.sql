-- Migration 095 — Active / paused status on ad sets and ads (same labels as campaigns).
-- Run once in Supabase SQL Editor after 094.

alter table public.growth_ad_adsets
  add column if not exists status text not null default 'Active'
    check (status in ('Active', 'Paused', 'Completed'));

alter table public.growth_ad_ad
  add column if not exists status text not null default 'Active'
    check (status in ('Active', 'Paused', 'Completed'));
