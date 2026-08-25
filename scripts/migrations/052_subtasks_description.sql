-- Migration 052 — Subtask description (V1).

alter table public.subtasks
  add column if not exists description text not null default '';
