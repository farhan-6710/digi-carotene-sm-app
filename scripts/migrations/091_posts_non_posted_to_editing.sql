-- Migration 091 — Reset non-posted posts to editing.
-- Run in Supabase SQL editor.

update public.posts
set status = 'editing'
where status <> 'posted';
