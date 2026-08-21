-- Migration 047 — Task priority: low | medium | high (was normal | high).

update public.tasks
set priority = 'medium'
where priority = 'normal';

alter table public.tasks
  drop constraint if exists tasks_priority_check;

alter table public.tasks
  add constraint tasks_priority_check
  check (priority in ('low', 'medium', 'high'));

alter table public.tasks
  alter column priority set default 'medium';
