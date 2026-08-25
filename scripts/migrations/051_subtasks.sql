-- Migration 051 — Subtasks on a parent task (V1).
-- Creator and assignee are teammate XOR client.

create table public.subtasks (
  id uuid primary key default gen_random_uuid(),
  parent_task_id uuid not null references public.tasks (id) on delete cascade,
  title text not null,
  created_by_team_member_id uuid
    references public.team_members (id) on delete restrict,
  created_by_client_id uuid
    references public.clients (id) on delete restrict,
  assigned_to_team_member_id uuid
    references public.team_members (id) on delete restrict,
  assigned_to_client_id uuid
    references public.clients (id) on delete restrict,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  eta_date date not null,
  eta_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subtasks_creator_check check (
    (created_by_team_member_id is not null and created_by_client_id is null)
    or (created_by_team_member_id is null and created_by_client_id is not null)
  ),
  constraint subtasks_assignee_check check (
    (assigned_to_team_member_id is not null and assigned_to_client_id is null)
    or (assigned_to_team_member_id is null and assigned_to_client_id is not null)
  )
);

alter table public.subtasks enable row level security;

create policy "Authenticated users manage subtasks"
  on public.subtasks for all to authenticated
  using (true) with check (true);
