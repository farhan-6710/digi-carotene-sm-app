-- Migration 031 — Assign manager and shoot incharge on production plans.

alter table public.production_plans
  add column manager_id uuid references public.team_members (id) on delete restrict,
  add column shoot_incharge_id uuid references public.team_members (id) on delete restrict;
