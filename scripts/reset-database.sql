-- Run once in Supabase → SQL Editor when you need a full wipe (no data preserved).
-- Removes all app tables, triggers, and auth users.

drop trigger if exists on_auth_user_created on auth.users;

drop trigger if exists set_posts_updated_at on public.posts;
drop trigger if exists set_projects_updated_at on public.projects;
drop trigger if exists set_clients_updated_at on public.clients;
drop trigger if exists set_team_members_updated_at on public.team_members;
drop trigger if exists set_project_team_members_updated_at on public.project_team_members;

drop table if exists public.posts cascade;
drop table if exists public.project_team_members cascade;
drop table if exists public.projects cascade;
drop table if exists public.profiles cascade;
drop table if exists public.team_members cascade;
drop table if exists public.clients cascade;

-- Legacy tables from older setups
drop table if exists public.member_assignments cascade;
drop table if exists public.employee_assignments cascade;
drop table if exists public.employees cascade;

delete from auth.users;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.handle_updated_at() cascade;
