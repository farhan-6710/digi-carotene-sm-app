import { ProjectsTableRow } from "@/features/projects-management/components/ProjectsTableRow";
import { projectsDirectoryConfig } from "@/features/projects-management/constants/projectsDirectory";
import type { ProjectsTableProps } from "@/features/projects-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ProjectsTable({
  projects,
  isLoading,
  canEdit,
  onEditProject,
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
