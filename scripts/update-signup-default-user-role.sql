-- Run once in Supabase SQL Editor (existing databases only).
-- New signups get profiles.role = 'user' until staff or client access is granted.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, client_id)
  values (new.id, 'user', null)
  on conflict (id) do nothing;
  return new;
end;
$$;

alter table public.profiles
  alter column role set default 'user';
