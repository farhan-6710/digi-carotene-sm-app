-- Migration 013 — backdated post approval requests (V1).

create table public.post_approval_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  project_id uuid not null references public.projects (id) on delete restrict,
  requested_by_team_member_id uuid not null references public.team_members (id) on delete restrict,
  reviewed_by_team_member_id uuid references public.team_members (id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  approved_post_id uuid references public.posts (id) on delete set null,
  post_payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.post_approval_requests enable row level security;

create policy "Authenticated users manage post approval requests"
  on public.post_approval_requests for all to authenticated
  using (true) with check (true);
