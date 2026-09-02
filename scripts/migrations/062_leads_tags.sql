-- Migration 062 — Lead tags (V1).
-- Simple text array on leads; no separate tags table.

alter table public.leads
  add column if not exists tags text[] not null default '{}';
