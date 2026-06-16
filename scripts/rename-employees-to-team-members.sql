-- Run once in Supabase → SQL Editor if you already created the old employees tables.
-- Renames employees → team_members and employee_assignments → member_assignments.

-- 1. Rename team members table and column
alter table if exists public.employees rename to team_members;
alter table if exists public.team_members rename column employee_name to member_name;

-- 2. Rename team members trigger (if it exists)
do $$
begin
  if exists (
    select 1 from pg_trigger
    where tgname = 'set_employees_updated_at'
  ) then
    alter trigger set_employees_updated_at on public.team_members
      rename to set_team_members_updated_at;
  end if;
end $$;

-- 3. Replace team members RLS policy
drop policy if exists "Logged-in users can manage employees" on public.team_members;
drop policy if exists "Logged-in users can manage team members" on public.team_members;
create policy "Logged-in users can manage team members"
  on public.team_members
  for all
  to authenticated
  using (true)
  with check (true);

-- 4. Rename assignments table and column
alter table if exists public.employee_assignments rename to member_assignments;
alter table if exists public.member_assignments rename column employee_id to member_id;

-- 5. Rename assignments index (if it exists)
alter index if exists employee_assignments_active_unique
  rename to member_assignments_active_unique;

-- 6. Rename assignments trigger (if it exists)
do $$
begin
  if exists (
    select 1 from pg_trigger
    where tgname = 'set_employee_assignments_updated_at'
  ) then
    alter trigger set_employee_assignments_updated_at on public.member_assignments
      rename to set_member_assignments_updated_at;
  end if;
end $$;

-- 7. Replace assignments RLS policy
drop policy if exists "Logged-in users can manage employee assignments" on public.member_assignments;
drop policy if exists "Logged-in users can manage member assignments" on public.member_assignments;
create policy "Logged-in users can manage member assignments"
  on public.member_assignments
  for all
  to authenticated
  using (true)
  with check (true);
