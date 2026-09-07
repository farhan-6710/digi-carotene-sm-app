-- Migration 066 — Per-content shoot fields on production plan items.
-- Simple nullable text/date + shoot completed flag (default false).

alter table public.production_plan_items
  add column shoot_date date,
  add column context_description text,
  add column content_pillar text,
  add column shoot_completed boolean not null default false;
