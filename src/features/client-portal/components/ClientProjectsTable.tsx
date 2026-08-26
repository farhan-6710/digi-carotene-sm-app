import { Link } from "react-router";

import {
  CLIENT_PROJECTS_ROW_GRID_CLASS,
  clientProjectsDirectoryConfig,
} from "@/features/client-portal/constants/projectsDirectory";
import type { ClientProjectsTableProps } from "@/features/client-portal/types/components";
import { projectKindLabel } from "@/features/projects-management/utils/projectKindUtils";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { SocialPlatformButtons } from "@/shared/components/SocialPlatformButtons";
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
        <div
          key={`${project.project_kind}-${project.id}`}
          className={cn(
            "grid items-center gap-2 px-6 py-4 sm:gap-4",
            CLIENT_PROJECTS_ROW_GRID_CLASS,
          )}
        >
          <Link
            to={project.detailPath}
            className="text-sm font-medium hover:text-primary hover:underline"
          >
            {project.project_name}
          </Link>
          <p className="text-sm text-muted-foreground">
            {projectKindLabel(project.project_kind)}
          </p>
          <p className="text-sm text-muted-foreground">
            {project.manager_name ?? "—"}
          </p>
          {project.project_kind === "sm" ? (
            <SocialPlatformButtons socials={project.socials} />
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
          <ActiveStatusLabel isActive={project.is_active} />
        </div>
      ))}
    </DirectoryTable>
  );
}
