-- Migration 055 — Rename projects to sm_projects, add dev_projects (V1).

alter table public.projects rename to sm_projects;

-- This policy still used the old table name. Recreate it.
drop policy if exists "Portal users read own posts" on public.posts;

create policy "Portal users read own posts"
  on public.posts for select to authenticated
  using (
    project_id in (
      select id from public.sm_projects
      where client_id in (
        select client_id from public.profiles
        where id = auth.uid()
      )
    )
  );

-- Share links still used the old table name. Recreate the function.
create or replace function public.fetch_shared_project(p_token text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'project', row_to_json(p),
    'client', row_to_json(c),
    'manager', json_build_object('id', m.id, 'member_name', m.member_name, 'team_role', m.team_role),
    'posts', coalesce((
      select json_agg(po order by po.to_be_posted_date desc)
      from public.posts po
      where po.project_id = p.id
    ), '[]'::json)
  )
  from public.sm_projects p
  left join public.clients c on c.id = p.client_id
  left join public.team_members m on m.id = p.manager_id
  where p.share_token = p_token
  limit 1;
$$;

create table public.dev_projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  client_id uuid not null references public.clients (id) on delete cascade,
  manager_id uuid not null references public.team_members (id) on delete restrict,
  description text,
  tech_stack text,
  repo_url text,
  staging_url text,
  production_url text,
  start_date date,
  target_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_dev_projects_updated_at
  before update on public.dev_projects
  for each row
  execute function public.handle_updated_at();

alter table public.dev_projects enable row level security;

create policy "Authenticated users manage dev projects"
  on public.dev_projects for all to authenticated
  using (true) with check (true);
