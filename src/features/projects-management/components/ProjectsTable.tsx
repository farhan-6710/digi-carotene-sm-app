import { ProjectsTableRow } from "@/features/projects-management/components/ProjectsTableRow";
import { projectsDirectoryConfig } from "@/features/projects-management/constants/projectsDirectory";
import type { ProjectsTableProps } from "@/features/projects-management/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PROJECT_STATUS_FILTER_LABELS } from "@/shared/constants/activeStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ProjectsTable({
  projects,
  isLoading,
  canEdit,
  onEditProject,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: ProjectsTableProps) {
  return (
    <DirectoryTable
      title={projectsDirectoryConfig.title}
      description={projectsDirectoryConfig.description}
      gridClass={projectsDirectoryConfig.gridClass}
      columns={projectsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No projects match that search."
          : projectsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={projects.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <ListingSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search projects"
            disabled={isLoading}
          />
          <ActiveStatusFilter
            value={statusFilter}
            onChange={onStatusFilterChange}
            labels={PROJECT_STATUS_FILTER_LABELS}
            disabled={isLoading}
            placeholder="Filter projects"
          />
        </div>
      }
    >
      {projects.map((project) => (
        <ProjectsTableRow
          key={project.id}
          project={project}
          canEdit={canEdit}
          onEditProject={onEditProject}
        />
      ))}
    </DirectoryTable>
  );
}
