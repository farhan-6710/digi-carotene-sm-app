-- Migration 086 — Committed content counts on SM projects.
-- Run in Supabase SQL editor. Safe to re-run (IF NOT EXISTS).

alter table public.sm_projects
  add column if not exists committed_posts integer not null default 0
    check (committed_posts >= 0),
  add column if not exists committed_images integer not null default 0
    check (committed_images >= 0),
  add column if not exists committed_carousels integer not null default 0
    check (committed_carousels >= 0),
  add column if not exists committed_reels integer not null default 0
    check (committed_reels >= 0);
