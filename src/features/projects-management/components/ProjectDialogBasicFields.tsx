import { formFieldClassName } from "@/features/projects-management/constants/formStyles";
import type { ProjectDialogProps } from "@/features/projects-management/types/components";

export function ProjectDialogBasicFields({
  values,
  onFieldChange,
  disabled = false,
}: Pick<ProjectDialogProps, "values" | "onFieldChange" | "isSaving"> & {
  disabled?: boolean;
}) {
  return (
    <label className="block text-xs font-semibold text-muted-foreground">
      Project name
      <input
        value={values.projectName}
        onChange={(event) => onFieldChange("projectName", event.target.value)}
        placeholder="e.g. Summer Campaign"
        className={formFieldClassName}
        disabled={disabled}
      />
    </label>
  );
}
