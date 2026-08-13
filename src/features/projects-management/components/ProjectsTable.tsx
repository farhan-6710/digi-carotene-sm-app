import { ProjectsTableRow } from "@/features/projects-management/components/ProjectsTableRow";
import { projectsDirectoryConfig } from "@/features/projects-management/constants/projectsDirectory";
import type { ProjectsTableProps } from "@/features/projects-management/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { PROJECT_STATUS_FILTER_LABELS } from "@/shared/constants/activeStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ProjectsTable({
  projects,
  isLoading,
  canEdit,
  onEditProject,
  statusFilter,
  onStatusFilterChange,
}: ProjectsTableProps) {
  return (
    <DirectoryTable
      title={projectsDirectoryConfig.title}
      description={projectsDirectoryConfig.description}
      gridClass={projectsDirectoryConfig.gridClass}
      columns={projectsDirectoryConfig.columns}
      emptyMessage={projectsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={projects.length === 0}
      headerAside={
        <ActiveStatusFilter
          value={statusFilter}
          onChange={onStatusFilterChange}
          labels={PROJECT_STATUS_FILTER_LABELS}
          disabled={isLoading}
          placeholder="Filter projects"
        />
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
