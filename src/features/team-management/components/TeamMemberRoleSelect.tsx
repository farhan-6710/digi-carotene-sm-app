import { useMemo } from "react";

import {
  TEAM_MEMBER_ROLES,
  TEAM_MEMBER_ROLE_LABELS,
} from "@/features/team-management/constants/teamMemberRoles";
import type { TeamMemberRoleSelectProps } from "@/features/team-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function TeamMemberRoleSelect({
  value,
  onChange,
  disabled = false,
}: TeamMemberRoleSelectProps) {
  const options = useMemo(
    () =>
      TEAM_MEMBER_ROLES.map((role) => ({
        value: role,
        label: TEAM_MEMBER_ROLE_LABELS[role],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) {
          onChange(next as typeof value);
        }
      }}
      options={options}
      disabled={disabled}
      placeholder="Select role"
      listTitle="Select team member role"
      mode="value"
    />
  );
}
