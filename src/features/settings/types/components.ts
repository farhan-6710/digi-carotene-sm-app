import type {
  SettingsSection,
  SettingsToggleId,
} from "@/features/settings/types/types";

export type SettingToggleRowProps = {
  id: SettingsToggleId;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export type SettingsSectionCardProps = {
  section: SettingsSection;
  isToggleEnabled: (id: SettingsToggleId) => boolean;
  onToggleChange: (id: SettingsToggleId, enabled: boolean) => void;
};
