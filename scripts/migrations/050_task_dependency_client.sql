-- Migration 050 — Task dependency client (V1).
-- Optional client dependency alongside teammate task_tags.

alter table public.tasks
  add column if not exists dependency_client_id uuid
    references public.clients (id) on delete set null;

create index if not exists tasks_dependency_client_id_idx
  on public.tasks (dependency_client_id);
