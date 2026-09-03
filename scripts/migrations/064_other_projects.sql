-- Migration 064 — Other projects (V1).
-- Same core shape as dev_projects, without tech/URL fields.

create table public.other_projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  client_id uuid not null references public.clients (id) on delete cascade,
  manager_id uuid not null references public.team_members (id) on delete restrict,
  description text,
  start_date date,
  eta_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_other_projects_updated_at
  before update on public.other_projects
  for each row
  execute function public.handle_updated_at();

alter table public.other_projects enable row level security;

create policy "Authenticated users manage other projects"
  on public.other_projects for all to authenticated
  using (true) with check (true);

create table public.other_project_team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.other_projects (id) on delete cascade,
  member_id uuid not null references public.team_members (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_other_project_team_members_updated_at
  before update on public.other_project_team_members
  for each row
  execute function public.handle_updated_at();

alter table public.other_project_team_members enable row level security;

create policy "Authenticated users manage other project team members"
  on public.other_project_team_members for all to authenticated
  using (true) with check (true);
