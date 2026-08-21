-- Migration 047 — Task priority: low | medium | high (was normal | high).
-- Drop the old check first so rows can move from 'normal' → 'medium'.

alter table public.tasks
  drop constraint if exists tasks_priority_check;

update public.tasks
set priority = 'medium'
where priority = 'normal';

alter table public.tasks
  alter column priority set default 'medium';

alter table public.tasks
  add constraint tasks_priority_check
  check (priority in ('low', 'medium', 'high'));
