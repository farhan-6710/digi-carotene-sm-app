-- Migration 053 — Multiple assignees for tasks and subtasks (V1).
-- Junction tables (like task_tags). Old assignee columns stay for portal sync.

create table public.task_assignees (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  team_member_id uuid references public.team_members (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint task_assignees_person_check check (
    (team_member_id is not null and client_id is null)
    or (team_member_id is null and client_id is not null)
  )
);

create table public.subtask_assignees (
  id uuid primary key default gen_random_uuid(),
  subtask_id uuid not null references public.subtasks (id) on delete cascade,
  team_member_id uuid references public.team_members (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint subtask_assignees_person_check check (
    (team_member_id is not null and client_id is null)
    or (team_member_id is null and client_id is not null)
  )
);

insert into public.task_assignees (task_id, team_member_id)
select id, assigned_to_team_member_id
from public.tasks
where assigned_to_team_member_id is not null;

insert into public.task_assignees (task_id, client_id)
select id, client_id
from public.tasks
where client_id is not null;

insert into public.subtask_assignees (subtask_id, team_member_id)
select id, assigned_to_team_member_id
from public.subtasks
where assigned_to_team_member_id is not null;

insert into public.subtask_assignees (subtask_id, client_id)
select id, assigned_to_client_id
from public.subtasks
where assigned_to_client_id is not null;

alter table public.tasks drop constraint if exists tasks_assignee_xor;
alter table public.subtasks drop constraint if exists subtasks_assignee_check;

alter table public.task_assignees enable row level security;
create policy "Authenticated users manage task assignees"
  on public.task_assignees for all to authenticated
  using (true) with check (true);

alter table public.subtask_assignees enable row level security;
create policy "Authenticated users manage subtask assignees"
  on public.subtask_assignees for all to authenticated
  using (true) with check (true);
