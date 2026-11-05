-- Migration 089 — Post status workflow.
-- Replaces Not posted / Scheduled / Posted with:
-- editing | sent_for_approval | approved | scheduled | posted
-- Run in Supabase SQL editor.

-- Map existing rows first (constraint still allows old values).
update public.posts
set status = case status
  when 'Not posted' then 'editing'
  when 'Scheduled' then 'scheduled'
  when 'Posted' then 'posted'
  else status
end
where status in ('Not posted', 'Scheduled', 'Posted');

alter table public.posts
  drop constraint if exists posts_status_check;

alter table public.posts
  add constraint posts_status_check
  check (
    status in (
      'editing',
      'sent_for_approval',
      'approved',
      'scheduled',
      'posted'
    )
  );

alter table public.posts
  alter column status set default 'editing';
