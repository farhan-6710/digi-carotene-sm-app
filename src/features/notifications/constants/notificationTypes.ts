export const NOTIFICATION_TYPES = ["approval", "post_digest", "task"] as const;

export const NOTIFICATION_STATUSES = ["unread", "read"] as const;

export const NOTIFICATION_TYPE_LABELS = {
  approval: "Approvals",
  post_digest: "Post digest",
  task: "Tasks",
} as const;

export const NOTIFICATIONS_UPDATED_EVENT = "notifications-updated";

export const postDigestDirectoryConfig = {
  title: "Post digest",
  description: "Daily posting reminders sent with your midnight email.",
  gridClass: "grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,0.8fr)_auto]",
  columns: [
    { label: "TITLE" },
    { label: "MESSAGE" },
    { label: "SENT" },
    { label: "ACTIONS", align: "right" as const },
  ],
  emptyMessage: "No unread post digest notifications.",
} as const;

export const taskNotificationsDirectoryConfig = {
  title: "Tasks",
  description: "Alerts when you are assigned, tagged, or need project oversight.",
  gridClass: "grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,0.8fr)_auto]",
  columns: [
    { label: "TITLE" },
    { label: "MESSAGE" },
    { label: "SENT" },
    { label: "ACTIONS", align: "right" as const },
  ],
  emptyMessage: "No unread task notifications.",
} as const;
