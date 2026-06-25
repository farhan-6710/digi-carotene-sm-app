-- Migration 001 — initial schema (brand-new Supabase projects only).
-- Creates all tables, RLS, triggers, and auth signup helpers.
-- Skip this file if your project already has these tables.

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Clients (company / brand owner — no social URLs here)
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  email text,
  mobile_number text,
  website_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index clients_email_unique
  on public.clients (lower(trim(email)))
  where email is not null;

create trigger set_clients_updated_at
  before update on public.clients
  for each row
  execute function public.handle_updated_at();

alter table public.clients enable row level security;

create policy "Authenticated users manage clients"
  on public.clients for all to authenticated
  using (true) with check (true);

-- Team members (internal team)
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  member_name text not null,
  email text not null unique,
  mobile_number text,
  team_role text not null default 'executive'
    check (team_role in ('executive', 'manager', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_team_members_updated_at
  before update on public.team_members
  for each row
  execute function public.handle_updated_at();

alter table public.team_members enable row level security;

create policy "Authenticated users manage team members"
  on public.team_members for all to authenticated
  using (true) with check (true);

-- Projects (operational unit: social accounts, manager, posts)
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  client_id uuid not null references public.clients (id) on delete cascade,
  socials jsonb not null default '{}'::jsonb,
  manager_id uuid not null references public.team_members (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();

alter table public.projects enable row level security;

create policy "Authenticated users manage projects"
  on public.projects for all to authenticated
  using (true) with check (true);

-- Extra team on a project (manager lives on projects.manager_id)
create table public.project_team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  member_id uuid not null references public.team_members (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_project_team_members_updated_at
  before update on public.project_team_members
  for each row
  execute function public.handle_updated_at();

alter table public.project_team_members enable row level security;

create policy "Authenticated users manage project team members"
  on public.project_team_members for all to authenticated
  using (true) with check (true);

-- Posts (linked to project; post socials + post_links stay per post)
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete restrict,
  post_title text,
  socials text[],
  post_links jsonb not null default '{}'::jsonb,
  to_be_posted_date date not null,
  to_be_posted_time text not null,
  posted_date date,
  posted_time text,
  status text not null check (status in ('Not posted', 'Scheduled', 'Posted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_posts_updated_at
  before update on public.posts
  for each row
  execute function public.handle_updated_at();

alter table public.posts enable row level security;

create policy "Authenticated users manage posts"
  on public.posts for all to authenticated
  using (true) with check (true);

-- Auth profiles (portal users link to a client, not a project)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user'
    check (role in ('team', 'client', 'user')),
  client_id uuid references public.clients (id) on delete set null,
  team_member_id uuid references public.team_members (id) on delete set null
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "Team update any profile"
  on public.profiles for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'team'
    )
  );

-- Portal: read own client row
create policy "Portal users read own client"
  on public.clients for select to authenticated
  using (
    id in (
      select client_id from public.profiles
      where id = auth.uid() and client_id is not null
    )
  );

-- Portal: read posts for all projects under linked client
create policy "Portal users read own posts"
  on public.posts for select to authenticated
  using (
    project_id in (
      select p.id
      from public.projects p
      inner join public.profiles pr on pr.client_id = p.client_id
      where pr.id = auth.uid()
    )
  );

-- Signup: check whether an email belongs to a pre-added team member (anon-safe).
create or replace function public.is_team_member_email(lookup_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members
    where lower(trim(email)) = lower(trim(lookup_email))
  );
$$;

grant execute on function public.is_team_member_email(text) to anon, authenticated;

-- Link profile when auth email matches team_members or clients.email.
create or replace function public.link_profile_by_email(lookup_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  user_id uuid;
  tm_id uuid;
  cl_id uuid;
begin
  if lookup_email is null or trim(lookup_email) = '' then
    return;
  end if;

  select id into user_id
  from auth.users
  where lower(trim(email)) = lower(trim(lookup_email));

  if user_id is null then
    return;
  end if;

  insert into public.profiles (id, role, client_id, team_member_id)
  values (user_id, 'user', null, null)
  on conflict (id) do nothing;

  select id into tm_id
  from public.team_members
  where lower(trim(email)) = lower(trim(lookup_email))
  limit 1;

  if tm_id is not null then
    update public.profiles
    set role = 'team',
        team_member_id = tm_id,
        client_id = null
    where id = user_id;
    return;
  end if;

  select id into cl_id
  from public.clients
  where email is not null
    and lower(trim(email)) = lower(trim(lookup_email))
  limit 1;

  if cl_id is not null then
    update public.profiles
    set role = 'client',
        client_id = cl_id,
        team_member_id = null
    where id = user_id;
  end if;
end;
$$;

-- Auto-create profile on signup; link portal access when email matches roster.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, client_id, team_member_id)
  values (new.id, 'user', null, null)
  on conflict (id) do nothing;

  perform public.link_profile_by_email(new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- When a team member is removed, linked profiles return to pending access.
create or replace function public.handle_team_member_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set role = 'user',
      team_member_id = null
  where team_member_id = old.id;

  return old;
end;
$$;

create trigger on_team_member_deleted
  before delete on public.team_members
  for each row
  execute function public.handle_team_member_deleted();

create or replace function public.handle_team_member_portal_link()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.link_profile_by_email(new.email);
  return new;
end;
$$;

create trigger on_team_member_portal_link
  after insert or update of email on public.team_members
  for each row
  execute function public.handle_team_member_portal_link();

-- When a client is removed, linked profiles return to pending access.
create or replace function public.handle_client_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set role = 'user',
      client_id = null
  where client_id = old.id;

  return old;
end;
$$;

create trigger on_client_deleted
  before delete on public.clients
  for each row
  execute function public.handle_client_deleted();

create or replace function public.handle_client_portal_link()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.link_profile_by_email(new.email);
  return new;
end;
$$;

create trigger on_client_portal_link
  after insert or update of email on public.clients
  for each row
  execute function public.handle_client_portal_link();

alter publication supabase_realtime add table public.profiles;
