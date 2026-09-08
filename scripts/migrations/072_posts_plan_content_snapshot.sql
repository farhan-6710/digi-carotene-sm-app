-- Snapshot production-plan content onto posts when moved to the calendar,
-- so post detail can show context/script/etc. without relying only on reverse lookup.
-- Also store source_production_plan_item_id for a direct link back to the plan item.

alter table public.posts
  add column if not exists content_pillar text,
  add column if not exists context_description text,
  add column if not exists script text,
  add column if not exists reference_link text,
  add column if not exists shoot_date date,
  add column if not exists shoot_notes text,
  add column if not exists source_production_plan_item_id uuid
    references public.production_plan_items (id) on delete set null;

create index if not exists posts_source_production_plan_item_id_idx
  on public.posts (source_production_plan_item_id);

-- Backfill from items already linked via moved_to_post_id.
update public.posts p
set
  content_pillar = coalesce(p.content_pillar, i.content_pillar),
  context_description = coalesce(p.context_description, i.context_description),
  script = coalesce(p.script, i.script),
  reference_link = coalesce(p.reference_link, i.reference_link),
  shoot_date = coalesce(p.shoot_date, i.shoot_date),
  shoot_notes = coalesce(p.shoot_notes, i.shoot_notes),
  source_production_plan_item_id = coalesce(p.source_production_plan_item_id, i.id)
from public.production_plan_items i
where i.moved_to_post_id = p.id;
