import { useMemo } from "react";

import { ClientTasksTableRow } from "@/features/client-portal/components/ClientTasksTableRow";
import { clientTasksDirectoryConfig } from "@/features/client-portal/constants/tasksDirectory";
import { useClientTasksQuery } from "@/features/client-portal/hooks/useClientTasksQuery";
import type { ClientProjectTasksSectionProps } from "@/features/client-portal/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

/** Read-only tasks for one project (SM, dev or other), same rows as the client tasks page. */
export function ClientProjectTasksSection({ projectId }: ClientProjectTasksSectionProps) {
  const { tasks, isLoading } = useClientTasksQuery();
  const projectTasks = useMemo(
    () =>
      tasks.filter((task) =>
        [task.sm_project_id, task.dev_project_id, task.other_project_id].includes(projectId),
      ),
    [tasks, projectId],
  );

  return (
    <DirectoryTable
      title="Project tasks"
      description="Tasks on this project that include your brand. Open one to review and chat."
      gridClass={clientTasksDirectoryConfig.gridClass}
      columns={clientTasksDirectoryConfig.columns}
      emptyMessage="No tasks on this project yet."
      isLoading={isLoading}
      isEmpty={projectTasks.length === 0}
    >
      {projectTasks.map((task) => (
        <ClientTasksTableRow key={task.id} task={task} />
      ))}
    </DirectoryTable>
  );
}
