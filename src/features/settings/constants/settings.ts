import type { SettingsSection } from "@/features/settings/types/types";

export const settingsSections: SettingsSection[] = [
  {
    id: "notifications",
    title: "Notifications",
    description:
      "Choose how Digi Carotene keeps your team informed about posts and client activity.",
    toggles: [
      {
        id: "appointment-reminders",
        label: "Post reminders",
        description:
          "Notify team members when a new client post is scheduled or rescheduled.",
        defaultEnabled: true,
      },
      {
        id: "no-show-alerts",
        label: "Missed post alerts",
        description:
          "Send an alert when a scheduled post is missed or not published on time.",
        defaultEnabled: true,
      },
      {
        id: "daily-schedule-digest",
        label: "Daily content digest",
        description:
          "Receive a morning summary of today’s posts and pending approvals.",
        defaultEnabled: false,
      },
      {
        id: "patient-outcome-reports",
        label: "Campaign reports",
        description:
          "Email when monthly campaign performance reports finish generating.",
        defaultEnabled: true,
      },
    ],
  },
  {
    id: "appearance",
    title: "Appearance",
    description:
      "Adjust how the Digi Carotene team portal looks and feels during daily work.",
    toggles: [
      {
        id: "dark-theme",
        label: "Dark theme",
        description:
          "Use a darker palette for low-light environments and reduced glare.",
        defaultEnabled: false,
      },
      {
        id: "compact-sidebar",
        label: "Compact sidebar by default",
        description:
          "Start each session with the navigation sidebar collapsed.",
        defaultEnabled: false,
      },
    ],
  },
  {
    id: "agency-preferences",
    title: "Agency preferences",
    description:
      "Workflow defaults that apply across posts, drafts, and analytics.",
    toggles: [
      {
        id: "auto-save-notes",
        label: "Auto-save post drafts",
        description:
          "Automatically save in-progress copy while drafting client content.",
        defaultEnabled: true,
      },
      {
        id: "anonymized-analytics",
        label: "Share anonymized analytics",
        description:
          "Include de-identified campaign data in Digi Carotene benchmark insights.",
        defaultEnabled: false,
      },
    ],
  },
];
