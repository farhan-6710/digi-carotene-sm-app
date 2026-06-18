import { formFieldClassName } from "@/shared/constants/formStyles";
import { TeamMemberRoleSelect } from "@/features/team-management/components/TeamMemberRoleSelect";
import type { TeamMemberDialogFormFieldsProps } from "@/features/team-management/types/components";

export function TeamMemberDialogFormFields({
  values,
  onFieldChange,
  disabled = false,
}: TeamMemberDialogFormFieldsProps) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-semibold text-muted-foreground">
        Name
        <input
          value={values.memberName}
          onChange={(event) => onFieldChange("memberName", event.target.value)}
          placeholder="e.g. Jane Smith"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Email
        <input
          type="email"
          value={values.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          placeholder="e.g. jane@agency.com"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Mobile number
        <input
          value={values.mobileNumber}
          onChange={(event) => onFieldChange("mobileNumber", event.target.value)}
          placeholder="e.g. +1 555 0100"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Admin team role
        <div className="mt-2">
          <TeamMemberRoleSelect
            value={values.adminTeamRole}
            onChange={(adminTeamRole) => onFieldChange("adminTeamRole", adminTeamRole)}
            disabled={disabled}
          />
        </div>
      </label>
    </div>
  );
}
