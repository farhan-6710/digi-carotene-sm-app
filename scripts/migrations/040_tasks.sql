-- Migration 040 — Tasks management (V1).
-- Flat tables + simple filters. No RPCs or activity log.

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  created_by_team_member_id uuid not null
    references public.team_members (id) on delete restrict,
  assigned_to_team_member_id uuid not null
    references public.team_members (id) on delete restrict,
  priority text not null default 'normal'
    check (priority in ('normal', 'high')),
  is_blocker boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_project_id_idx on public.tasks (project_id);
create index tasks_assigned_to_idx on public.tasks (assigned_to_team_member_id);
create index tasks_created_by_idx on public.tasks (created_by_team_member_id);

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();

alter table public.tasks enable row level security;

create policy "Authenticated users manage tasks"
  on public.tasks for all to authenticated
  using (true) with check (true);

create table public.task_tags (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  team_member_id uuid not null references public.team_members (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (task_id, team_member_id)
);

create index task_tags_member_id_idx on public.task_tags (team_member_id);

alter table public.task_tags enable row level security;

create policy "Authenticated users manage task tags"
  on public.task_tags for all to authenticated
  using (true) with check (true);
