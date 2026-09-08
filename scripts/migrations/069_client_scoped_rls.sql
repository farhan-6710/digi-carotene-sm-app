-- Migration 069 — Client-scoped RLS for projects, tasks, messages, subtasks (V1).
-- Team keeps full access. Clients read/write only their own rows.

create or replace function public.is_team_profile()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'team'
  );
$$;

create or replace function public.current_profile_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select client_id
  from public.profiles
  where id = auth.uid();
$$;

grant execute on function public.is_team_profile() to authenticated;
grant execute on function public.current_profile_client_id() to authenticated;

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
        t.client_id = public.current_profile_client_id()
        or t.dependency_client_id = public.current_profile_client_id()
        or exists (
          select 1
          from public.task_assignees ta
          where ta.task_id = t.id
            and ta.client_id = public.current_profile_client_id()
        )
      )
  );
$$;

grant execute on function public.client_can_access_task(uuid) to authenticated;

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
      and (
        s.created_by_client_id = public.current_profile_client_id()
        or s.assigned_to_client_id = public.current_profile_client_id()
        or exists (
          select 1
          from public.subtask_assignees sa
          where sa.subtask_id = s.id
            and sa.client_id = public.current_profile_client_id()
        )
      )
  );
$$;

grant execute on function public.client_can_see_subtask(uuid) to authenticated;

-- sm_projects (policy kept name from original projects table)
drop policy if exists "Authenticated users manage projects" on public.sm_projects;
create policy "Team manage sm projects"
  on public.sm_projects for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read own sm projects"
  on public.sm_projects for select to authenticated
  using (client_id = public.current_profile_client_id());

drop policy if exists "Authenticated users manage dev projects" on public.dev_projects;
create policy "Team manage dev projects"
  on public.dev_projects for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read own dev projects"
  on public.dev_projects for select to authenticated
  using (client_id = public.current_profile_client_id());

drop policy if exists "Authenticated users manage other projects" on public.other_projects;
create policy "Team manage other projects"
  on public.other_projects for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read own other projects"
  on public.other_projects for select to authenticated
  using (client_id = public.current_profile_client_id());

-- tasks
drop policy if exists "Authenticated users manage tasks" on public.tasks;
create policy "Team manage tasks"
  on public.tasks for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read accessible tasks"
  on public.tasks for select to authenticated
  using (
    client_id = public.current_profile_client_id()
    or dependency_client_id = public.current_profile_client_id()
    or exists (
      select 1
      from public.task_assignees ta
      where ta.task_id = tasks.id
        and ta.client_id = public.current_profile_client_id()
    )
  );

-- task_messages
drop policy if exists "Authenticated users manage task messages" on public.task_messages;
create policy "Team manage task messages"
  on public.task_messages for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read accessible task messages"
  on public.task_messages for select to authenticated
  using (public.client_can_access_task(task_id));
create policy "Portal users insert own task messages"
  on public.task_messages for insert to authenticated
  with check (
    author_client_id = public.current_profile_client_id()
    and public.client_can_access_task(task_id)
  );
create policy "Portal users update own task messages"
  on public.task_messages for update to authenticated
  using (author_client_id = public.current_profile_client_id())
  with check (author_client_id = public.current_profile_client_id());
create policy "Portal users delete own task messages"
  on public.task_messages for delete to authenticated
  using (author_client_id = public.current_profile_client_id());

-- subtasks (clients see only ones they raised or are assigned to)
drop policy if exists "Authenticated users manage subtasks" on public.subtasks;
create policy "Team manage subtasks"
  on public.subtasks for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read own subtasks"
  on public.subtasks for select to authenticated
  using (public.client_can_see_subtask(id));
create policy "Portal users insert own subtasks"
  on public.subtasks for insert to authenticated
  with check (
    created_by_client_id = public.current_profile_client_id()
    and public.client_can_access_task(parent_task_id)
  );
create policy "Portal users update own subtasks"
  on public.subtasks for update to authenticated
  using (public.client_can_see_subtask(id))
  with check (public.client_can_see_subtask(id));
create policy "Portal users delete own raised subtasks"
  on public.subtasks for delete to authenticated
  using (
    created_by_client_id = public.current_profile_client_id()
    and public.client_can_access_task(parent_task_id)
  );

-- task_assignees: clients read rows on accessible tasks; team manages
drop policy if exists "Authenticated users manage task assignees" on public.task_assignees;
create policy "Team manage task assignees"
  on public.task_assignees for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read accessible task assignees"
  on public.task_assignees for select to authenticated
  using (public.client_can_access_task(task_id));

-- subtask_assignees: team manages; clients manage assignees on subtasks they raised
drop policy if exists "Authenticated users manage subtask assignees" on public.subtask_assignees;
create policy "Team manage subtask assignees"
  on public.subtask_assignees for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read accessible subtask assignees"
  on public.subtask_assignees for select to authenticated
  using (
    client_id = public.current_profile_client_id()
    or exists (
      select 1
      from public.subtasks s
      where s.id = subtask_id
        and s.created_by_client_id = public.current_profile_client_id()
    )
  );
create policy "Portal users manage assignees on raised subtasks"
  on public.subtask_assignees for all to authenticated
  using (
    exists (
      select 1
      from public.subtasks s
      where s.id = subtask_id
        and s.created_by_client_id = public.current_profile_client_id()
    )
  )
  with check (
    exists (
      select 1
      from public.subtasks s
      where s.id = subtask_id
        and s.created_by_client_id = public.current_profile_client_id()
    )
  );
