-- Run once in Supabase → SQL Editor.
-- If you already set up clients or posts, skip step 1 (handle_updated_at already exists).

-- 1. Auto-update updated_at on edit (run once per project)
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. Employees table (app also supports team_members after rename-employees-to-team-members.sql)
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_name text not null,
  email text not null unique,
  mobile_number text,
  role text not null default 'executive'
    check (role in ('executive', 'manager', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Keep updated_at in sync when a row is edited
create trigger set_employees_updated_at
  before update on public.employees
  for each row
  execute function public.handle_updated_at();

-- 4. Security: only logged-in users can use this table
alter table public.employees enable row level security;

create policy "Logged-in users can manage employees"
  on public.employees
  for all
  to authenticated
  using (true)
  with check (true);
