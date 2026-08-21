-- Migration 045 — Optional client on a task + client authors in task chat (V1).
-- Team assignee stays required. Client is who the work involves / who can reply in chat.

alter table public.tasks
  add column if not exists client_id uuid
    references public.clients (id) on delete set null;

create index if not exists tasks_client_id_idx on public.tasks (client_id);

-- Chat: message is from a teammate XOR the task client (not both).
alter table public.task_messages
  alter column author_team_member_id drop not null;

alter table public.task_messages
  add column if not exists author_client_id uuid
    references public.clients (id) on delete restrict;

alter table public.task_messages
  drop constraint if exists task_messages_author_check;

alter table public.task_messages
  add constraint task_messages_author_check check (
    (author_team_member_id is not null and author_client_id is null)
    or (author_team_member_id is null and author_client_id is not null)
  );
