-- Run in Supabase → SQL Editor (one shot).
-- Matches minimal profiles table: id, role, client_id (no full_name column).

insert into public.profiles (id, role, client_id)
select
  u.id,
  'client',
  null
from auth.users u
on conflict (id) do update
set role = excluded.role;

-- Promote your own admin account (replace UUID):
-- update public.profiles set role = 'admin', client_id = null where id = '<your-auth-user-uuid>';
