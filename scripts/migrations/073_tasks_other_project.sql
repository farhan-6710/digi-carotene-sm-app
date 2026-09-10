-- Migration 073 — Tasks: SM/Dev/Other project FKs with consistent names (V1).
-- Columns: sm_project_id | dev_project_id | other_project_id (exactly one set).

-- Rename legacy SM FK for parity with Dev/Other naming.
alter table public.tasks
  rename column project_id to sm_project_id;

alter index if exists tasks_project_id_idx
  rename to tasks_sm_project_id_idx;

alter table public.tasks
  add column if not exists other_project_id uuid
    references public.other_projects (id) on delete cascade;

alter table public.tasks
  drop constraint if exists tasks_project_xor;

alter table public.tasks
  add constraint tasks_project_xor check (
    (
      sm_project_id is not null
      and dev_project_id is null
      and other_project_id is null
    )
    or (
      sm_project_id is null
      and dev_project_id is not null
      and other_project_id is null
    )
    or (
      sm_project_id is null
      and dev_project_id is null
      and other_project_id is not null
    )
  );

create index if not exists tasks_other_project_id_idx
  on public.tasks (other_project_id);
