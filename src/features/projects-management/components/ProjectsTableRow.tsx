import { Pencil } from "lucide-react";

import { buildProjectDetailPath } from "@/features/projects-management/constants/routes";
import { PROJECTS_DIRECTORY_ROW_GRID_CLASS } from "@/features/projects-management/constants/projectsDirectory";
import type { ProjectsTableRowProps } from "@/features/projects-management/types/components";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { SocialPlatformButtons } from "@/shared/components/SocialPlatformButtons";
import { cn } from "@/shared/lib/utils";

export function ProjectsTableRow({
  project,
  canEdit,
  onEditProject,
}: ProjectsTableRowProps) {
  return (
    <DirectoryTableRow
      to={buildProjectDetailPath(project.id)}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        PROJECTS_DIRECTORY_ROW_GRID_CLASS,
      )}
    >
      <div className="text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PROJECT
        </span>
        {project.project_name}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          CLIENT
        </span>
        {project.clients?.client_name ?? "—"}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          MANAGER
        </span>
        {project.team_members?.member_name ?? "—"}
      </div>

      <div
        className="text-sm text-muted-foreground"
        onClick={stopDirectoryRowNav}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          SOCIALS
        </span>
        <SocialPlatformButtons socials={project.socials} />
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
