import { formFieldClassName } from "@/features/clients-management/constants/formStyles";
import type { ClientDialogBasicFieldsProps } from "@/features/clients-management/types/components";

export function ClientDialogBasicFields({
  values,
  onFieldChange,
  disabled = false,
}: ClientDialogBasicFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Client name *
        <input
          value={values.clientName}
          onChange={(event) => onFieldChange("clientName", event.target.value)}
          placeholder="e.g. Bloom Skincare"
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

      <label className="block text-xs font-semibold text-muted-foreground">
        Website name / URL
        <input
          value={values.websiteName}
          onChange={(event) => onFieldChange("websiteName", event.target.value)}
          placeholder="e.g. bloomskincare.com"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
