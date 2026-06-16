import { formFieldClassName } from "@/features/employees-management/constants/formStyles";
import { EmployeeRoleSelect } from "@/features/employees-management/components/EmployeeRoleSelect";
import type { EmployeeDialogFormFieldsProps } from "@/features/employees-management/types/components";

export function EmployeeDialogFormFields({
  values,
  onFieldChange,
  disabled = false,
}: EmployeeDialogFormFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Name *
        <input
          value={values.memberName}
          onChange={(event) => onFieldChange("memberName", event.target.value)}
          placeholder="e.g. Jane Cooper"
          className={formFieldClassName}
          required
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Email *
        <input
          type="email"
          value={values.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          placeholder="e.g. jane@digicarotene.com"
          className={formFieldClassName}
          required
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Mobile number
        <input
          value={values.mobileNumber}
          onChange={(event) => onFieldChange("mobileNumber", event.target.value)}
          placeholder="e.g. +1 555-0199"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <div className="sm:pt-0">
        <EmployeeRoleSelect
          value={values.role}
          onChange={(role) => onFieldChange("role", role)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
