-- Run once in Supabase → SQL Editor AFTER employees-table.sql.
-- Tracks which clients each team member works on (active + history).

-- 1. Assignment table
create table public.employee_assignments (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prevent duplicate active rows for the same member + same client.
create unique index employee_assignments_active_unique
  on public.employee_assignments (employee_id, client_id)
  where ended_at is null;

-- 2. Auto-update updated_at on edit
create trigger set_employee_assignments_updated_at
  before update on public.employee_assignments
  for each row
  execute function public.handle_updated_at();

-- 3. Security
alter table public.employee_assignments enable row level security;

create policy "Logged-in users can manage employee assignments"
  on public.employee_assignments
  for all
  to authenticated
  using (true)
  with check (true);
