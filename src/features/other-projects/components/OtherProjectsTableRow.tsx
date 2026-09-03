import { Pencil } from "lucide-react";

import { OTHER_PROJECTS_DIRECTORY_ROW_GRID_CLASS } from "@/features/other-projects/constants/otherProjectsDirectory";
import { buildOtherProjectDetailPath } from "@/features/other-projects/constants/routes";
import type { OtherProjectsTableRowProps } from "@/features/other-projects/types/components";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { cn } from "@/shared/lib/utils";

export function OtherProjectsTableRow({
  project,
  canEdit,
  onEditProject,
}: OtherProjectsTableRowProps) {
  return (
    <DirectoryTableRow
      to={buildOtherProjectDetailPath(project.id)}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        OTHER_PROJECTS_DIRECTORY_ROW_GRID_CLASS,
      )}
    >
      <div className="min-w-0 text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PROJECT
        </span>
        <span className="truncate">{project.project_name}</span>
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          CLIENT
        </span>
        <span className="truncate">
          {project.clients?.client_name ?? "—"}
        </span>
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          MANAGER
        </span>
        <span className="truncate">
          {project.team_members?.member_name ?? "—"}
        </span>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          START
        </span>
        {project.start_date || "—"}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          ETA
        </span>
        {project.eta_date || "—"}
      </div>

      <div>
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          STATUS
        </span>
        <ActiveStatusLabel isActive={project.is_active} />
      </div>

      <div className="flex justify-end">
        {canEdit ? (
          <button
            type="button"
            onClick={(event) => {
              stopDirectoryRowNav(event);
              onEditProject(project);
            }}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit project</span>
          </button>
        ) : null}
      </div>
    </DirectoryTableRow>
  );
}
