-- Run after profiles.client_id is set. Lets portal users read their brand + posts.

-- Own brand row
drop policy if exists "Clients can read own brand" on public.clients;
create policy "Clients can read own brand"
  on public.clients
  for select
  to authenticated
  using (
    id in (
      select client_id
      from public.profiles
      where id = auth.uid()
        and client_id is not null
    )
  );

-- Posts for that brand (matched by client_name text on posts)
drop policy if exists "Clients can read own posts" on public.posts;
create policy "Clients can read own posts"
  on public.posts
  for select
  to authenticated
  using (
    client_name in (
      select c.client_name
      from public.clients c
      inner join public.profiles p on p.client_id = c.id
      where p.id = auth.uid()
    )
  );
