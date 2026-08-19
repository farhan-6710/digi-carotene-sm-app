-- Share tokens for public view-only project / production-plan links.

alter table public.projects
  add column if not exists share_token text unique;

alter table public.production_plans
  add column if not exists share_token text unique;

create or replace function public.fetch_shared_project(p_token text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'project', row_to_json(p),
    'client', row_to_json(c),
    'manager', json_build_object('id', m.id, 'member_name', m.member_name, 'team_role', m.team_role),
    'posts', coalesce((
      select json_agg(po order by po.to_be_posted_date desc)
      from public.posts po
      where po.project_id = p.id
    ), '[]'::json)
  )
  from public.projects p
  left join public.clients c on c.id = p.client_id
  left join public.team_members m on m.id = p.manager_id
  where p.share_token = p_token
  limit 1;
$$;

create or replace function public.fetch_shared_production_plan(p_token text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'plan', row_to_json(pl),
    'client', row_to_json(c),
    'manager', json_build_object('id', mgr.id, 'member_name', mgr.member_name),
    'shoot_incharge', json_build_object('id', si.id, 'member_name', si.member_name),
    'items', coalesce((
      select json_agg(i order by i.created_at)
      from public.production_plan_items i
      where i.production_plan_id = pl.id
    ), '[]'::json)
  )
  from public.production_plans pl
  left join public.clients c on c.id = pl.client_id
  left join public.team_members mgr on mgr.id = pl.manager_id
  left join public.team_members si on si.id = pl.shoot_incharge_id
  where pl.share_token = p_token
  limit 1;
$$;

grant execute on function public.fetch_shared_project(text) to anon, authenticated;
grant execute on function public.fetch_shared_production_plan(text) to anon, authenticated;

-- Matching logged-in client (clients.email = auth email) can update Client approval only.
create or replace function public.update_shared_plan_item_client_approval(
  p_token text,
  p_item_id uuid,
  p_status text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_plan_id uuid;
  v_row public.production_plan_items;
begin
  if p_status not in ('pending', 'approved', 'rejected') then
    raise exception 'invalid approval status';
  end if;

  v_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  if v_email = '' then
    raise exception 'Sign in with the client email to update approval.';
  end if;

  select pl.id
  into v_plan_id
  from public.production_plans pl
  join public.clients c on c.id = pl.client_id
  where pl.share_token = p_token
    and lower(trim(c.email)) = v_email;

  if v_plan_id is null then
    raise exception 'You can only update approval for your own plan.';
  end if;

  update public.production_plan_items
  set client_approval = p_status
  where id = p_item_id
    and production_plan_id = v_plan_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Content not found.';
  end if;

  return row_to_json(v_row);
end;
$$;

grant execute on function public.update_shared_plan_item_client_approval(text, uuid, text)
  to authenticated;
