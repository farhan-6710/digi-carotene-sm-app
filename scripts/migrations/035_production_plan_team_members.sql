-- Extra team on a production plan (assignment history via ended_at).
-- Manager and shoot incharge stay on production_plans; this table is extra members.

create table public.production_plan_team_members (
  id uuid primary key default gen_random_uuid(),
  production_plan_id uuid not null references public.production_plans (id) on delete cascade,
  member_id uuid not null references public.team_members (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_production_plan_team_members_updated_at
  before update on public.production_plan_team_members
  for each row
  execute function public.handle_updated_at();

alter table public.production_plan_team_members enable row level security;

create policy "Authenticated users manage production plan team members"
  on public.production_plan_team_members for all to authenticated
  using (true) with check (true);
