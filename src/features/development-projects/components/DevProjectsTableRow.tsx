import { Pencil } from "lucide-react";

import {
  DEV_PROJECTS_DIRECTORY_BULK_ROW_GRID_CLASS,
  DEV_PROJECTS_DIRECTORY_ROW_GRID_CLASS,
} from "@/features/development-projects/constants/devProjectsDirectory";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { buildDevProjectDetailPath } from "@/features/development-projects/constants/routes";
import type { DevProjectsTableRowProps } from "@/features/development-projects/types/components";
import { DEV_PROJECT_STATUS_LABELS } from "@/features/development-projects/constants/devProjectStatus";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { cn } from "@/shared/lib/utils";

export function DevProjectsTableRow({
  project,
  canEdit,
  canDelete = false,
  selected = false,
  onToggleSelect,
  onEditProject,
}: DevProjectsTableRowProps) {
  return (
    <DirectoryTableRow
      to={buildDevProjectDetailPath(project.id)}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        canDelete
          ? DEV_PROJECTS_DIRECTORY_BULK_ROW_GRID_CLASS
          : DEV_PROJECTS_DIRECTORY_ROW_GRID_CLASS,
      )}
    >
      {canDelete && onToggleSelect ? (
        <DirectoryBulkCheckbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(project.id)}
          ariaLabel={`Select ${project.project_name}`}
        />
      ) : null}
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

      <div
        className="min-w-0 text-sm text-muted-foreground"
        onClick={stopDirectoryRowNav}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PRODUCTION
        </span>
        {project.production_url?.trim() ? (
          <a
            href={
              project.production_url.startsWith("http")
                ? project.production_url
                : `https://${project.production_url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-primary hover:underline"
            title={project.production_url}
          >
            {project.production_url.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          "—"
        )}
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
        <ActiveStatusLabel
          label={DEV_PROJECT_STATUS_LABELS[project.status]}
        />
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
