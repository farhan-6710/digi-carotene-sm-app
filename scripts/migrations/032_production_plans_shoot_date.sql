-- Migration 032 — Rename production_plans.start_date to shoot_date.

alter table public.production_plans
  rename column start_date to shoot_date;
