-- Migration 059 — Lead attachments + activities (V1).
-- Simple flat tables: attachments (URL links), tasks, meetings, calls.
-- Open vs closed is status !== completed vs status = completed (client-side).

create table if not exists public.lead_attachments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  url text not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_lead_attachments_updated_at
  before update on public.lead_attachments
  for each row
  execute function public.handle_updated_at();

alter table public.lead_attachments enable row level security;

create policy "Authenticated users manage lead attachments"
  on public.lead_attachments for all to authenticated
  using (true) with check (true);

create table if not exists public.lead_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null,
  description text,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_lead_tasks_updated_at
  before update on public.lead_tasks
  for each row
  execute function public.handle_updated_at();

alter table public.lead_tasks enable row level security;

create policy "Authenticated users manage lead tasks"
  on public.lead_tasks for all to authenticated
  using (true) with check (true);

create table if not exists public.lead_meetings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  from_date date not null,
  from_time text not null,
  to_date date not null,
  to_time text not null,
  venue text not null
    check (venue in ('client_location', 'in_office', 'online')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_lead_meetings_updated_at
  before update on public.lead_meetings
  for each row
  execute function public.handle_updated_at();

alter table public.lead_meetings enable row level security;

create policy "Authenticated users manage lead meetings"
  on public.lead_meetings for all to authenticated
  using (true) with check (true);

create table if not exists public.lead_calls (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  start_date date not null,
  start_time text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_lead_calls_updated_at
  before update on public.lead_calls
  for each row
  execute function public.handle_updated_at();

alter table public.lead_calls enable row level security;

create policy "Authenticated users manage lead calls"
  on public.lead_calls for all to authenticated
  using (true) with check (true);
