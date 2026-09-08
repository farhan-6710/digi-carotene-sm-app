-- Migration 068 — Post fields on production plan items + link after Move to posts.
-- post_type / socials fill posts when moving shoot-completed content to an SM project.

alter table public.production_plan_items
  add column if not exists post_type text not null default 'single_post',
  add column if not exists socials text[],
  add column if not exists moved_to_post_id uuid references public.posts (id) on delete set null;

alter table public.production_plan_items
  drop constraint if exists production_plan_items_post_type_check;

alter table public.production_plan_items
  add constraint production_plan_items_post_type_check
  check (post_type in ('single_post', 'carousel', 'reel', 'story', 'video'));
