import { OtherProjectsTableRow } from "@/features/other-projects/components/OtherProjectsTableRow";
import { otherProjectsDirectoryConfig } from "@/features/other-projects/constants/otherProjectsDirectory";
import type { OtherProjectsTableProps } from "@/features/other-projects/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PROJECT_STATUS_FILTER_LABELS } from "@/shared/constants/activeStatusFilter";

export function OtherProjectsTable({
  projects,
  isLoading,
  canEdit,
  onEditProject,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: OtherProjectsTableProps) {
  return (
    <DirectoryTable
      title={otherProjectsDirectoryConfig.title}
      description={otherProjectsDirectoryConfig.description}
      gridClass={otherProjectsDirectoryConfig.gridClass}
      columns={otherProjectsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No projects match that search."
          : otherProjectsDirectoryConfig.emptyMessage
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
        <OtherProjectsTableRow
          key={project.id}
          project={project}
          canEdit={canEdit}
          onEditProject={onEditProject}
        />
      ))}
    </DirectoryTable>
  );
}
