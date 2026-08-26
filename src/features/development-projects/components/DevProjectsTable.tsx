import { DevProjectsTableRow } from "@/features/development-projects/components/DevProjectsTableRow";
import { devProjectsDirectoryConfig } from "@/features/development-projects/constants/devProjectsDirectory";
import type { DevProjectsTableProps } from "@/features/development-projects/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PROJECT_STATUS_FILTER_LABELS } from "@/shared/constants/activeStatusFilter";

export function DevProjectsTable({
  projects,
  isLoading,
  canEdit,
  onEditProject,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: DevProjectsTableProps) {
  return (
    <DirectoryTable
      title={devProjectsDirectoryConfig.title}
      description={devProjectsDirectoryConfig.description}
      gridClass={devProjectsDirectoryConfig.gridClass}
      columns={devProjectsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No projects match that search."
          : devProjectsDirectoryConfig.emptyMessage
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
        <DevProjectsTableRow
          key={project.id}
          project={project}
          canEdit={canEdit}
          onEditProject={onEditProject}
        />
      ))}
    </DirectoryTable>
  );
}
