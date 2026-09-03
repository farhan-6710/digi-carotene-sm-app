-- Migration 065 — Drop tech_stack from dev_projects (V1).

alter table public.dev_projects
  drop column if exists tech_stack;
