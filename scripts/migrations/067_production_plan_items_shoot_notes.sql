-- Migration 067 — Rename shoot_completed_notes → shoot_notes
-- (notes can be added any time, not only when shoot is completed).
-- DB already has shoot_completed_notes from an earlier apply of this migration number.

alter table public.production_plan_items
  rename column shoot_completed_notes to shoot_notes;
