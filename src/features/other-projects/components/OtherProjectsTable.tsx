import { useMemo } from "react";

import { OtherProjectsTableRow } from "@/features/other-projects/components/OtherProjectsTableRow";
import {
  OTHER_PROJECTS_DIRECTORY_BULK_GRID_CLASS,
  otherProjectsDirectoryColumns,
  otherProjectsDirectoryConfig,
} from "@/features/other-projects/constants/otherProjectsDirectory";
import type { OtherProjectsTableProps } from "@/features/other-projects/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PROJECT_STATUS_FILTER_LABELS } from "@/shared/constants/activeStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import type { DirectoryTableColumn } from "@/shared/types/components";

export function OtherProjectsTable({
  projects,
  isLoading,
  canEdit,
  canDelete = false,
  selectedIds = [],
  allVisibleSelected = false,
  isDeleting = false,
  onToggleSelect,
  onToggleAllVisible,
  onClearSelection,
  onBulkDelete,
  onEditProject,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: OtherProjectsTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!canDelete || !onToggleAllVisible) {
      return otherProjectsDirectoryColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={allVisibleSelected}
            onCheckedChange={onToggleAllVisible}
            ariaLabel="Select all other projects"
            disabled={isLoading || projects.length === 0}
          />
        ),
      },
      ...otherProjectsDirectoryColumns,
    ];
  }, [
    allVisibleSelected,
    canDelete,
    isLoading,
    onToggleAllVisible,
    projects.length,
  ]);

  return (
    <DirectoryTable
      title={otherProjectsDirectoryConfig.title}
      description={otherProjectsDirectoryConfig.description}
      gridClass={
        canDelete
          ? OTHER_PROJECTS_DIRECTORY_BULK_GRID_CLASS
          : otherProjectsDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={
        searchQuery.trim()
          ? "No projects match that search."
          : otherProjectsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={projects.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {canDelete && onClearSelection && onBulkDelete ? (
            <DirectoryBulkDeleteBar
              selectedCount={selectedIds.length}
              singularLabel="project"
              pluralLabel="projects"
              isDeleting={isDeleting}
              onClear={onClearSelection}
              onConfirmDelete={onBulkDelete}
            />
          ) : null}
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
          canDelete={canDelete}
          selected={selectedSet.has(project.id)}
          onToggleSelect={onToggleSelect}
          onEditProject={onEditProject}
        />
      ))}
    </DirectoryTable>
  );
}
