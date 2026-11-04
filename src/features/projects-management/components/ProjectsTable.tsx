import { useMemo } from "react";

import { ProjectsTableRow } from "@/features/projects-management/components/ProjectsTableRow";
import {
  PROJECTS_DIRECTORY_BULK_GRID_CLASS,
  projectsDirectoryColumns,
  projectsDirectoryConfig,
} from "@/features/projects-management/constants/projectsDirectory";
import type { ProjectsTableProps } from "@/features/projects-management/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PROJECT_STATUS_FILTER_OPTIONS } from "@/shared/constants/activeStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import type { DirectoryTableColumn } from "@/shared/types/components";

export function ProjectsTable({
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
}: ProjectsTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!canDelete || !onToggleAllVisible) {
      return projectsDirectoryColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={allVisibleSelected}
            onCheckedChange={onToggleAllVisible}
            ariaLabel="Select all projects"
            disabled={isLoading || projects.length === 0}
          />
        ),
      },
      ...projectsDirectoryColumns,
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
      title={projectsDirectoryConfig.title}
      description={projectsDirectoryConfig.description}
      gridClass={
        canDelete
          ? PROJECTS_DIRECTORY_BULK_GRID_CLASS
          : projectsDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={
        searchQuery.trim()
          ? "No projects match that search."
          : projectsDirectoryConfig.emptyMessage
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
            onChange={(value) =>
              onStatusFilterChange(value as typeof statusFilter)
            }
            options={PROJECT_STATUS_FILTER_OPTIONS}
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
          canDelete={canDelete}
          selected={selectedSet.has(project.id)}
          onToggleSelect={onToggleSelect}
          onEditProject={onEditProject}
        />
      ))}
    </DirectoryTable>
  );
}
