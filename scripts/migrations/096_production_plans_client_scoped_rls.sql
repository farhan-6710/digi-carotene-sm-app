-- Migration 096 — Client-scoped RLS for production plans + plan items.
-- 029/030 left both tables open to every signed-in user, so a client could
-- read or edit another brand's plans. Team keeps full access (same as 069).
-- Clients read their own plans and update items on their own plans
-- (the client portal only changes client_approval).

drop policy if exists "Authenticated users manage production plans" on public.production_plans;
create policy "Team manage production plans"
  on public.production_plans for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read own production plans"
  on public.production_plans for select to authenticated
  using (client_id = public.current_profile_client_id());

drop policy if exists "Authenticated users manage production plan items" on public.production_plan_items;
create policy "Team manage production plan items"
  on public.production_plan_items for all to authenticated
  using (public.is_team_profile())
  with check (public.is_team_profile());
create policy "Portal users read own production plan items"
  on public.production_plan_items for select to authenticated
  using (
    exists (
      select 1 from public.production_plans p
      where p.id = production_plan_id
        and p.client_id = public.current_profile_client_id()
    )
  );
create policy "Portal users update own production plan items"
  on public.production_plan_items for update to authenticated
  using (
    exists (
      select 1 from public.production_plans p
      where p.id = production_plan_id
        and p.client_id = public.current_profile_client_id()
    )
  )
  with check (
    exists (
      select 1 from public.production_plans p
      where p.id = production_plan_id
        and p.client_id = public.current_profile_client_id()
    )
  );
