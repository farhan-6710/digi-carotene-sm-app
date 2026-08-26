-- Migration 056 — Extra team on development projects (V1).
-- Same shape as project_team_members, but for dev_projects.

create table public.dev_project_team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.dev_projects (id) on delete cascade,
  member_id uuid not null references public.team_members (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_dev_project_team_members_updated_at
  before update on public.dev_project_team_members
  for each row
  execute function public.handle_updated_at();

alter table public.dev_project_team_members enable row level security;

create policy "Authenticated users manage dev project team members"
  on public.dev_project_team_members for all to authenticated
  using (true) with check (true);
