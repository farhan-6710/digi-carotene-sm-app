import { formFieldClassName } from "@/shared/constants/formStyles";
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

      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Portal user email
        <input
          type="email"
          value={values.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          placeholder="e.g. contact@brand.com"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Primary contact person
        <input
          value={values.primaryContactName}
          onChange={(event) =>
            onFieldChange("primaryContactName", event.target.value)
          }
          placeholder="e.g. Jane Doe"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Primary mobile number
        <input
          value={values.mobileNumber}
          onChange={(event) => onFieldChange("mobileNumber", event.target.value)}
          placeholder="e.g. +1 555-0199"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Secondary contact person
        <span className="ml-1 font-normal text-muted-foreground/80">
          (optional)
        </span>
        <input
          value={values.secondaryContactName}
          onChange={(event) =>
            onFieldChange("secondaryContactName", event.target.value)
          }
          placeholder="e.g. John Smith"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Secondary mobile number
        <span className="ml-1 font-normal text-muted-foreground/80">
          (optional)
        </span>
        <input
          value={values.secondaryMobileNumber}
          onChange={(event) =>
            onFieldChange("secondaryMobileNumber", event.target.value)
          }
          placeholder="e.g. +1 555-0188"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
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
