import {
  TEAM_MEMBER_ROLES,
  TEAM_MEMBER_ROLE_LABELS,
} from "@/features/team-management/constants/teamMemberRoles";
import { formFieldClassName } from "@/shared/constants/formStyles";
import type { TeamMemberRoleSelectProps } from "@/features/team-management/types/components";

export function TeamMemberRoleSelect({
  value,
  onChange,
  disabled = false,
}: TeamMemberRoleSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as typeof value)}
      className={formFieldClassName}
      disabled={disabled}
    >
      {TEAM_MEMBER_ROLES.map((role) => (
        <option key={role} value={role}>
          {TEAM_MEMBER_ROLE_LABELS[role]}
        </option>
      ))}
    </select>
  );
}
