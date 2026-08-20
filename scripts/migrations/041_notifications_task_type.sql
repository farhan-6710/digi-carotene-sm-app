-- Migration 041 — Allow notification_type = 'task'.

alter table public.notifications
  drop constraint if exists notifications_notification_type_check;

alter table public.notifications
  add constraint notifications_notification_type_check
  check (notification_type in ('approval', 'post_digest', 'task'));
