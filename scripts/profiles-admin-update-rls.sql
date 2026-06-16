-- Optional: lets admins unlink profiles.client_id from the app before deleting a brand.
-- Requires your user to have role = 'admin' (or 'user') in public.profiles.

drop policy if exists "Admins can update profile client links" on public.profiles;

create policy "Admins can update profile client links"
  on public.profiles
  for update
  to authenticated
  using (
    auth.uid() = id
    or exists (
      select 1
      from public.profiles as admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.role in ('admin', 'user')
    )
  )
  with check (true);
