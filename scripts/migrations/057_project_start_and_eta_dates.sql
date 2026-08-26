-- Migration 057 — Project dates: start_date + eta_date (SM + Dev).
-- Renames dev_projects.target_date → eta_date for naming consistency with tasks.
-- Adds the same date columns to sm_projects.

alter table public.dev_projects
  rename column target_date to eta_date;

alter table public.sm_projects
  add column start_date date,
  add column eta_date date;
