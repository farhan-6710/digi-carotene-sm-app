-- Migration 008 — reset profiles when a client is deleted + enable realtime on profiles.
-- Run after 007. Realtime lets revoked users leave team/client portal immediately.

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

drop trigger if exists on_client_deleted on public.clients;

create trigger on_client_deleted
  before delete on public.clients
  for each row
  execute function public.handle_client_deleted();

-- Push profile changes to connected browsers (Supabase Realtime).
alter publication supabase_realtime add table public.profiles;
