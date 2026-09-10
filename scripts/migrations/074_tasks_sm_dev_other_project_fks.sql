-- Migration 074 — Finish tasks SM/Dev/Other FKs after 073.
--
-- 073 already renamed project_id → sm_project_id, added other_project_id,
-- and set tasks_project_xor. This migration is idempotent and covers anything
-- still incomplete (esp. client RLS still referencing legacy project_id).

-- Safety: rename only if legacy column is somehow still present
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tasks'
      and column_name = 'project_id'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tasks'
      and column_name = 'sm_project_id'
  ) then
    alter table public.tasks rename column project_id to sm_project_id;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'tasks_project_id_idx'
      and c.relkind = 'i'
  )
  and not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'tasks_sm_project_id_idx'
      and c.relkind = 'i'
  ) then
    alter index public.tasks_project_id_idx rename to tasks_sm_project_id_idx;
  end if;
end $$;

alter table public.tasks
  add column if not exists other_project_id uuid
    references public.other_projects (id) on delete cascade;

create index if not exists tasks_sm_project_id_idx
  on public.tasks (sm_project_id);

create index if not exists tasks_other_project_id_idx
  on public.tasks (other_project_id);

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

-- Required: 070 still used t.project_id. Point RLS at sm_project_id + Other.
create or replace function public.client_can_access_task(p_task_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tasks t
    where t.id = p_task_id
      and (
        exists (
          select 1
          from public.sm_projects p
          where p.id = t.sm_project_id
            and p.client_id = public.current_profile_client_id()
        )
        or exists (
          select 1
          from public.dev_projects d
          where d.id = t.dev_project_id
            and d.client_id = public.current_profile_client_id()
        )
        or exists (
          select 1
          from public.other_projects o
          where o.id = t.other_project_id
            and o.client_id = public.current_profile_client_id()
        )
      )
  );
$$;
