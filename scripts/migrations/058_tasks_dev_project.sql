-- Migration 058 — Tasks can belong to SM or Dev projects (V1).
-- Exactly one of project_id (sm_projects) or dev_project_id must be set.

alter table public.tasks
  alter column project_id drop not null;

alter table public.tasks
  add column if not exists dev_project_id uuid
    references public.dev_projects (id) on delete cascade;

alter table public.tasks
  drop constraint if exists tasks_project_xor;

alter table public.tasks
  add constraint tasks_project_xor check (
    (project_id is not null and dev_project_id is null)
    or (project_id is null and dev_project_id is not null)
  );
