-- Migration 075 — Chat mentions on task messages + SM project chat.
-- Mentions are stored as uuid arrays so the global chat inbox can filter cheaply.

alter table public.task_messages
  add column if not exists mentioned_team_member_ids uuid[] not null default '{}',
  add column if not exists mentioned_client_ids uuid[] not null default '{}';

create index if not exists task_messages_mentioned_team_member_ids_gin
  on public.task_messages using gin (mentioned_team_member_ids);

create index if not exists task_messages_mentioned_client_ids_gin
  on public.task_messages using gin (mentioned_client_ids);

create index if not exists task_messages_author_team_member_id_idx
  on public.task_messages (author_team_member_id);

create index if not exists task_messages_author_client_id_idx
  on public.task_messages (author_client_id);

-- SM project chat (admin, client, manager, project team members).
create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  sm_project_id uuid not null references public.sm_projects (id) on delete cascade,
  author_team_member_id uuid references public.team_members (id) on delete restrict,
  author_client_id uuid references public.clients (id) on delete restrict,
  body text not null,
  mentioned_team_member_ids uuid[] not null default '{}',
  mentioned_client_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint project_messages_one_author check (
    (author_team_member_id is not null and author_client_id is null)
    or (author_team_member_id is null and author_client_id is not null)
  )
);

create index if not exists project_messages_sm_project_id_idx
  on public.project_messages (sm_project_id);

create index if not exists project_messages_created_at_idx
  on public.project_messages (created_at);

create index if not exists project_messages_mentioned_team_member_ids_gin
  on public.project_messages using gin (mentioned_team_member_ids);

create index if not exists project_messages_mentioned_client_ids_gin
  on public.project_messages using gin (mentioned_client_ids);

create index if not exists project_messages_author_team_member_id_idx
  on public.project_messages (author_team_member_id);

create index if not exists project_messages_author_client_id_idx
  on public.project_messages (author_client_id);

alter table public.project_messages enable row level security;

create policy "Authenticated users manage project messages"
  on public.project_messages for all to authenticated
  using (true) with check (true);
