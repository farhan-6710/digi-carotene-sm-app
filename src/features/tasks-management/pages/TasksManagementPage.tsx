import { Plus } from "lucide-react";
import { useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { TaskDialog } from "@/features/tasks-management/components/TaskDialog";
import { TasksTable } from "@/features/tasks-management/components/TasksTable";
import { useTaskDialog } from "@/features/tasks-management/hooks/useTaskDialog";
import {
  useTaskSearchQuery,
  useTaskSort,
  useTaskStatusFilter,
  useTaskTabFilter,
} from "@/features/tasks-management/hooks/useTaskTabFilter";
import { useTasksQuery } from "@/features/tasks-management/hooks/useTasksQuery";
import {
  canEditTaskAccess,
  filterTasksByTab,
} from "@/features/tasks-management/utils/taskAccessUtils";
import { sortTasks } from "@/features/tasks-management/utils/taskSortUtils";
import { filterTasksByStatus } from "@/features/tasks-management/utils/taskStatusFilterUtils";
import { PageShell } from "@/shared/components/PageShell";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function TasksManagementPage() {
  const { can } = usePermissions();
  const { teamMemberId, teamRole } = useAuth();
  const { tasks, isLoading, error, setError, reload } = useTasksQuery();
  const { openAddDialog, openEditDialog, dialog } = useTaskDialog({
    reload,
    setError,
  });
  const { tab, setTab } = useTaskTabFilter();
  const { sort, setSort } = useTaskSort();
  const { statusFilter, setStatusFilter } = useTaskStatusFilter();
  const { searchQuery, setSearchQuery } = useTaskSearchQuery();

  const filteredTasks = useMemo(() => {
    const filtered = filterTasksByStatus(
      filterTasksByTab(tasks, tab, teamMemberId),
      statusFilter,
    ).filter((task) =>
      matchesListingSearch(searchQuery, [
        task.title,
        task.description,
        task.projects?.project_name,
        task.client?.client_name,
        task.projects?.clients?.client_name,
        task.created_by?.member_name,
        task.assigned_to?.member_name,
        task.priority,
        task.status,
        task.eta_date,
        task.eta_time,
      ]),
    );
    return sortTasks(filtered, sort);
  }, [tasks, tab, teamMemberId, sort, searchQuery, statusFilter]);

  return (
    <PageShell
      heading="Task Management"
      description="Create and assign project tasks. Admins and project managers see full oversight for their scope."
      error={error}
      actions={
        can("tasks.create") ? (
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Task
          </Button>
        ) : null
      }
      dialog={can("tasks.create") || can("tasks.update") ? (
        <TaskDialog {...dialog} />
      ) : null}
    >
      <TasksTable
        tasks={filteredTasks}
        isLoading={isLoading}
        canEditTask={(task) =>
          canEditTaskAccess({ task, teamRole, teamMemberId })
        }
        onEditTask={openEditDialog}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        sort={sort}
        onSortChange={setSort}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        tab={tab}
        onTabChange={setTab}
      />
    </PageShell>
  );
}
