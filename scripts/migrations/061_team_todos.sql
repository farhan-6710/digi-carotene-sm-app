-- Migration 061 — Personal team member to-dos (V1).
-- Each row belongs to one team member. Hard-delete when removed.

create table if not exists public.team_todos (
  id uuid primary key default gen_random_uuid(),
  team_member_id uuid not null references public.team_members (id) on delete cascade,
  title text not null,
  description text,
  eta_date date not null,
  eta_time text not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_team_todos_updated_at
  before update on public.team_todos
  for each row
  execute function public.handle_updated_at();

alter table public.team_todos enable row level security;

create policy "Authenticated users manage team todos"
  on public.team_todos for all to authenticated
  using (true) with check (true);
