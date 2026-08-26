import {
  CLIENT_PROJECTS_ROW_GRID_CLASS,
  clientProjectsDirectoryConfig,
} from "@/features/client-portal/constants/projectsDirectory";
import type { ClientProjectsTableProps } from "@/features/client-portal/types/components";
import { projectKindLabel } from "@/features/projects-management/utils/projectKindUtils";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { SocialPlatformButtons } from "@/shared/components/SocialPlatformButtons";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { cn } from "@/shared/lib/utils";

export function ClientProjectsTable({
  projects,
  isLoading,
  searchQuery,
  onSearchQueryChange,
}: ClientProjectsTableProps) {
  return (
    <DirectoryTable
      title={clientProjectsDirectoryConfig.title}
      description={clientProjectsDirectoryConfig.description}
      gridClass={clientProjectsDirectoryConfig.gridClass}
      columns={clientProjectsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No projects match that search."
          : clientProjectsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={projects.length === 0}
      headerAside={
        <ListingSearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search projects"
          disabled={isLoading}
        />
      }
    >
      {projects.map((project) => (
        <DirectoryTableRow
          key={`${project.project_kind}-${project.id}`}
          to={project.detailPath}
          className={cn(
            "grid items-center gap-2 px-6 py-4 sm:gap-4",
            CLIENT_PROJECTS_ROW_GRID_CLASS,
          )}
        >
          <p className="text-sm font-medium text-foreground">
            {project.project_name}
          </p>
          <p className="text-sm text-muted-foreground">
            {projectKindLabel(project.project_kind)}
          </p>
          <p className="text-sm text-muted-foreground">
            {project.manager_name ?? "—"}
          </p>
          {project.project_kind === "sm" ? (
            <div
              onClick={stopDirectoryRowNav}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <SocialPlatformButtons socials={project.socials} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
          <ActiveStatusLabel isActive={project.is_active} />
        </DirectoryTableRow>
      ))}
    </DirectoryTable>
  );
}
