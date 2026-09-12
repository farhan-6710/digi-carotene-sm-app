import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { TaskDialog } from "@/features/tasks-management/components/TaskDialog";
import { TaskSortSelect } from "@/features/tasks-management/components/TaskSortSelect";
import { TaskStatusFilter } from "@/features/tasks-management/components/TaskStatusFilter";
import { TasksTableRow } from "@/features/tasks-management/components/TasksTableRow";
import { DEFAULT_TASK_SORT } from "@/features/tasks-management/constants/taskSort";
import { DEFAULT_TASK_STATUS_FILTER } from "@/features/tasks-management/constants/taskStatusFilter";
import {
  TASKS_GRID_CLASS,
  tasksColumns,
} from "@/features/tasks-management/constants/tasksDirectory";
import { useTaskDialog } from "@/features/tasks-management/hooks/useTaskDialog";
import { useTasksQuery } from "@/features/tasks-management/hooks/useTasksQuery";
import { canEditTaskAccess } from "@/features/tasks-management/utils/taskAccessUtils";
import { sortTasks } from "@/features/tasks-management/utils/taskSortUtils";
import { filterTasksByStatus } from "@/features/tasks-management/utils/taskStatusFilterUtils";
import type { TaskSortId } from "@/features/tasks-management/constants/taskSort";
import type { TaskStatusFilterId } from "@/features/tasks-management/constants/taskStatusFilter";
import {
  encodeProjectKey,
  type ProjectKind,
} from "@/features/projects-management/utils/projectKindUtils";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

type ProjectTasksSectionProps = {
  projectId: string;
  projectKind: ProjectKind;
};

function taskMatchesProject(
  task: {
    sm_project_id: string | null;
    dev_project_id: string | null;
    other_project_id: string | null;
  },
  projectKind: ProjectKind,
  projectId: string,
): boolean {
  if (projectKind === "sm") return task.sm_project_id === projectId;
  if (projectKind === "dev") return task.dev_project_id === projectId;
  return task.other_project_id === projectId;
}

/**
 * Tasks on a project detail page.
 * List scope still comes from `fetchTasksForMember` (RBAC) — then filtered to this project.
 */
export function ProjectTasksSection({
  projectId,
  projectKind,
}: ProjectTasksSectionProps) {
  const { can } = usePermissions();
  const { teamMemberId, teamRole } = useAuth();
  const { tasks, isLoading, error, setError, reload } = useTasksQuery();
  const { openAddDialog, openEditDialog, dialog } = useTaskDialog({
    reload,
    setError,
  });

  const [sort, setSort] = useState<TaskSortId>(DEFAULT_TASK_SORT);
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilterId>(
    DEFAULT_TASK_STATUS_FILTER,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const canReadTasks = can("tasks.read");
  const canCreateTasks = can("tasks.create");
  const canMutateTasks = can("tasks.create") || can("tasks.update");

  const projectTasks = useMemo(() => {
    const forProject = tasks.filter((task) =>
      taskMatchesProject(task, projectKind, projectId),
    );
    const filtered = filterTasksByStatus(forProject, statusFilter).filter(
      (task) =>
        matchesListingSearch(searchQuery, [
          task.title,
          task.description,
          task.created_by?.member_name,
          task.assigned_to?.member_name,
          task.priority,
          task.status,
          task.eta_date,
          task.eta_time,
        ]),
    );
    return sortTasks(filtered, sort);
  }, [tasks, projectKind, projectId, statusFilter, searchQuery, sort]);

  if (!canReadTasks) {
    return null;
  }

  const projectKey = encodeProjectKey(projectKind, projectId);
  const hasFilters =
    Boolean(searchQuery.trim()) || statusFilter !== DEFAULT_TASK_STATUS_FILTER;

  return (
    <div className="space-y-3">
      {error ? <ErrorBanner message={error} /> : null}

      <DirectoryTable
        title="Project tasks"
        description="Tasks linked to this project that you can access. Visibility follows your role and assignments."
        gridClass={TASKS_GRID_CLASS}
        columns={tasksColumns}
        emptyMessage={
          hasFilters
            ? "No tasks match those filters."
            : "No tasks on this project yet."
        }
        isLoading={isLoading}
        isEmpty={projectTasks.length === 0}
        headerAside={
          canCreateTasks ? (
            <Button
              type="button"
              className="rounded-full shadow-sm"
              onClick={() => openAddDialog({ projectKey })}
            >
              <Plus className="mr-2 size-4" />
              Add Task
            </Button>
          ) : null
        }
        filters={
          <>
            <TaskStatusFilter
              value={statusFilter}
              onChange={setStatusFilter}
              disabled={isLoading}
            />
            <TaskSortSelect
              value={sort}
              onChange={setSort}
              disabled={isLoading}
            />
            <div className="w-full min-w-0 sm:min-w-[200px] sm:flex-1 sm:max-w-sm">
              <ListingSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks"
                disabled={isLoading}
              />
            </div>
          </>
        }
      >
        {projectTasks.map((task) => (
          <TasksTableRow
            key={task.id}
            task={task}
            canEdit={canEditTaskAccess({ task, teamRole, teamMemberId })}
            onEdit={openEditDialog}
          />
        ))}
      </DirectoryTable>

      {canMutateTasks ? <TaskDialog {...dialog} /> : null}
    </div>
  );
}
