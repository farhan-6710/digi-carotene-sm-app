-- Migration 090 — Add posts.status value: changes_suggested
-- (after sent_for_approval in the workflow).
-- Run in Supabase SQL editor.

alter table public.posts
  drop constraint if exists posts_status_check;

alter table public.posts
  add constraint posts_status_check
  check (
    status in (
      'editing',
      'sent_for_approval',
      'changes_suggested',
      'approved',
      'scheduled',
      'posted'
    )
  );
