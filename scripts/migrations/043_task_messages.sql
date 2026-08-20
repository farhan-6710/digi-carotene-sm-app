-- Migration 043 — Task chat messages (simple DB chat, no realtime).

create table public.task_messages (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  author_team_member_id uuid not null
    references public.team_members (id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now()
);

create index task_messages_task_id_idx on public.task_messages (task_id);
create index task_messages_created_at_idx on public.task_messages (created_at);

alter table public.task_messages enable row level security;

create policy "Authenticated users manage task messages"
  on public.task_messages for all to authenticated
  using (true) with check (true);
