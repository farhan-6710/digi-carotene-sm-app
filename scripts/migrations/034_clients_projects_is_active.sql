-- Adds active/inactive status for clients and projects.
-- Existing rows default to active.

alter table public.clients
  add column if not exists is_active boolean not null default true;

alter table public.projects
  add column if not exists is_active boolean not null default true;

create index if not exists clients_is_active_idx
  on public.clients (is_active);

create index if not exists projects_is_active_idx
  on public.projects (is_active);
