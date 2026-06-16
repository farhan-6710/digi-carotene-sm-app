-- REQUIRED: run in Supabase → SQL Editor if the app shows
-- "no profile row exists" while rows are visible in the Table Editor.
-- Table Editor uses service role; the browser app uses the logged-in user + RLS.

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Optional: allow users to update their own row later (not required for login)
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
