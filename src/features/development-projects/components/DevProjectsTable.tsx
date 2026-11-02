import { useMemo } from "react";

import { DevProjectsTableRow } from "@/features/development-projects/components/DevProjectsTableRow";
import {
  DEV_PROJECTS_DIRECTORY_BULK_GRID_CLASS,
  devProjectsDirectoryColumns,
  devProjectsDirectoryConfig,
} from "@/features/development-projects/constants/devProjectsDirectory";
import type { DevProjectsTableProps } from "@/features/development-projects/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PROJECT_STATUS_FILTER_LABELS } from "@/shared/constants/activeStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import type { DirectoryTableColumn } from "@/shared/types/components";

export function DevProjectsTable({
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
}: DevProjectsTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!canDelete || !onToggleAllVisible) {
      return devProjectsDirectoryColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={allVisibleSelected}
            onCheckedChange={onToggleAllVisible}
            ariaLabel="Select all development projects"
            disabled={isLoading || projects.length === 0}
          />
        ),
      },
      ...devProjectsDirectoryColumns,
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
      title={devProjectsDirectoryConfig.title}
      description={devProjectsDirectoryConfig.description}
      gridClass={
        canDelete
          ? DEV_PROJECTS_DIRECTORY_BULK_GRID_CLASS
          : devProjectsDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={
        searchQuery.trim()
          ? "No projects match that search."
          : devProjectsDirectoryConfig.emptyMessage
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
        <DevProjectsTableRow
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
