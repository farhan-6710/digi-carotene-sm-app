export type SettingsToggleId =
  | "appointment-reminders"
  | "no-show-alerts"
  | "daily-schedule-digest"
  | "patient-outcome-reports"
  | "dark-theme"
  | "compact-sidebar"
  | "auto-save-notes"
  | "anonymized-analytics";

export type SettingsToggle = {
  id: SettingsToggleId;
  label: string;
  description: string;
  defaultEnabled: boolean;
};

export type SettingsSection = {
  id: string;
  title: string;
  description: string;
  toggles: SettingsToggle[];
};
