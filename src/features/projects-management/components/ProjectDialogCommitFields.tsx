import { formFieldClassName } from "@/shared/constants/formStyles";
import type { ProjectDialogProps } from "@/features/projects-management/types/components";

const COMMIT_FIELDS = [
  { field: "committedSinglePosts", label: "Committed single posts" },
  { field: "committedCarousels", label: "Committed carousels" },
  { field: "committedReels", label: "Committed reels" },
  { field: "committedStories", label: "Committed stories" },
  { field: "committedVideos", label: "Committed videos" },
] as const;

export function ProjectDialogCommitFields({
  values,
  onFieldChange,
  disabled = false,
}: Pick<ProjectDialogProps, "values" | "onFieldChange"> & {
  disabled?: boolean;
}) {
  return (
    <div className="border-t border-border/60 pt-4">
      <h4 className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
        Committed content
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {COMMIT_FIELDS.map(({ field, label }) => (
          <label
            key={field}
            className="block text-xs font-semibold text-muted-foreground"
          >
            {label}
            <input
              type="number"
              min="0"
              step="1"
              value={values[field]}
              onChange={(event) => onFieldChange(field, event.target.value)}
              className={formFieldClassName}
              disabled={disabled}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
