import { LeadScoreSelect } from "@/features/crm/components/LeadScoreSelect";
import { LeadSourceSelect } from "@/features/crm/components/LeadSourceSelect";
import { LeadStatusSelect } from "@/features/crm/components/LeadStatusSelect";
import type { LeadDialogFieldsProps } from "@/features/crm/types/components";
import { formFieldClassName } from "@/shared/constants/formStyles";

export function LeadDialogFields({
  values,
  onFieldChange,
  disabled = false,
}: LeadDialogFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Name *
        <input
          value={values.name}
          onChange={(event) => onFieldChange("name", event.target.value)}
          placeholder="e.g. Christopher Maclead"
          className={formFieldClassName}
          required
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Company
        <input
          value={values.company}
          onChange={(event) => onFieldChange("company", event.target.value)}
          placeholder="e.g. Rangoni Of Florence"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Industry
        <input
          value={values.industry}
          onChange={(event) => onFieldChange("industry", event.target.value)}
          placeholder="e.g. Retail"
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
          placeholder="e.g. chris@example.com"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Phone
        <input
          value={values.phone}
          onChange={(event) => onFieldChange("phone", event.target.value)}
          placeholder="e.g. 555-555-5555"
          className={formFieldClassName}
          disabled={disabled}
        />
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Lead status *
        <div className="mt-2">
          <LeadStatusSelect
            value={values.status}
            onChange={(status) => onFieldChange("status", status)}
            disabled={disabled}
          />
        </div>
      </label>

      <label className="block text-xs font-semibold text-muted-foreground">
        Lead source *
        <div className="mt-2">
          <LeadSourceSelect
            value={values.leadSource}
            onChange={(leadSource) => onFieldChange("leadSource", leadSource)}
            disabled={disabled}
          />
        </div>
      </label>

      <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
        Lead score
        <div className="mt-2">
          <LeadScoreSelect
            value={values.leadScore}
            onChange={(leadScore) => onFieldChange("leadScore", leadScore)}
            disabled={disabled}
          />
        </div>
      </label>
    </div>
  );
}
