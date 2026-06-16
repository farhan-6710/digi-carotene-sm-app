-- Run once in Supabase → SQL Editor.
-- Lets you delete a client row even when portal users reference it via profiles.client_id.
-- Their profile.client_id is cleared automatically (portal access paused until reassigned).

alter table public.profiles
  drop constraint if exists profiles_client_id_fkey;

alter table public.profiles
  add constraint profiles_client_id_fkey
  foreign key (client_id)
  references public.clients (id)
  on delete set null;
