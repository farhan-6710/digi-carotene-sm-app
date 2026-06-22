-- Run once in Supabase SQL Editor (existing databases only).
-- Updates the signup trigger so staff signups (metadata signup_portal = 'staff')
-- create profiles.role = 'staff' instead of 'client'.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_role text := 'client';
begin
  if coalesce(new.raw_user_meta_data->>'signup_portal', '') = 'staff' then
    profile_role := 'staff';
  end if;

  insert into public.profiles (id, role, client_id)
  values (new.id, profile_role, null)
  on conflict (id) do nothing;
  return new;
end;
$$;
