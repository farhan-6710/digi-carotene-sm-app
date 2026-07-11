-- Migration 026 — Post type on posts.
-- Run once in Supabase SQL Editor after 025.

alter table public.posts
  add column if not exists post_type text not null default 'single_post';

alter table public.posts
  drop constraint if exists posts_post_type_check;

alter table public.posts
  add constraint posts_post_type_check
  check (post_type in ('single_post', 'carousel', 'reel', 'story', 'video'));
