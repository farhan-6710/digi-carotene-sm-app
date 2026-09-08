-- Migration 070 — Client tasks/subtasks: all work on the client's SM/Dev projects.
-- Replaces assignee/dependency-only visibility from 069.

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
          where p.id = t.project_id
            and p.client_id = public.current_profile_client_id()
        )
        or exists (
          select 1
          from public.dev_projects d
          where d.id = t.dev_project_id
            and d.client_id = public.current_profile_client_id()
        )
      )
  );
$$;

create or replace function public.client_can_see_subtask(p_subtask_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subtasks s
    where s.id = p_subtask_id
      and public.client_can_access_task(s.parent_task_id)
  );
$$;

drop policy if exists "Portal users read accessible tasks" on public.tasks;
create policy "Portal users read accessible tasks"
  on public.tasks for select to authenticated
  using (public.client_can_access_task(id));

-- Clients may update only subtasks they raised or are assigned to (status/edit rules stay app-side).
drop policy if exists "Portal users update own subtasks" on public.subtasks;
create policy "Portal users update own subtasks"
  on public.subtasks for update to authenticated
  using (
    public.client_can_access_task(parent_task_id)
    and (
      created_by_client_id = public.current_profile_client_id()
      or assigned_to_client_id = public.current_profile_client_id()
      or exists (
        select 1
        from public.subtask_assignees sa
        where sa.subtask_id = subtasks.id
          and sa.client_id = public.current_profile_client_id()
      )
    )
  )
  with check (
    public.client_can_access_task(parent_task_id)
    and (
      created_by_client_id = public.current_profile_client_id()
      or assigned_to_client_id = public.current_profile_client_id()
      or exists (
        select 1
        from public.subtask_assignees sa
        where sa.subtask_id = subtasks.id
          and sa.client_id = public.current_profile_client_id()
      )
    )
  );

-- Clients can read assignees for every subtask on an accessible parent task.
drop policy if exists "Portal users read accessible subtask assignees" on public.subtask_assignees;
create policy "Portal users read accessible subtask assignees"
  on public.subtask_assignees for select to authenticated
  using (
    exists (
      select 1
      from public.subtasks s
      where s.id = subtask_id
        and public.client_can_access_task(s.parent_task_id)
    )
  );
