-- Migration 088 — Committed counts aligned with post types:
-- single post, carousel, reel, story, video.
-- Replaces committed_posts / committed_images from 086.
-- Run in Supabase SQL editor.

-- Rename legacy posts column when present.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'sm_projects'
      and column_name = 'committed_posts'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'sm_projects'
      and column_name = 'committed_single_posts'
  ) then
    alter table public.sm_projects
      rename column committed_posts to committed_single_posts;
  end if;
end $$;

alter table public.sm_projects
  add column if not exists committed_single_posts integer not null default 0
    check (committed_single_posts >= 0),
  add column if not exists committed_carousels integer not null default 0
    check (committed_carousels >= 0),
  add column if not exists committed_reels integer not null default 0
    check (committed_reels >= 0),
  add column if not exists committed_stories integer not null default 0
    check (committed_stories >= 0),
  add column if not exists committed_videos integer not null default 0
    check (committed_videos >= 0);

alter table public.sm_projects
  drop column if exists committed_posts,
  drop column if exists committed_images;
