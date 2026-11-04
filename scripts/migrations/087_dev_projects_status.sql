-- Migration 087 — Development project status: active | inactive | completed.
-- Replaces boolean is_active. Run in Supabase SQL editor.

alter table public.dev_projects
  add column if not exists status text;

update public.dev_projects
set status = case when coalesce(is_active, true) then 'active' else 'inactive' end
where status is null;

alter table public.dev_projects
  alter column status set default 'active';

alter table public.dev_projects
  alter column status set not null;

alter table public.dev_projects
  drop constraint if exists dev_projects_status_check;

alter table public.dev_projects
  add constraint dev_projects_status_check
  check (status in ('active', 'inactive', 'completed'));

alter table public.dev_projects
  drop column if exists is_active;
