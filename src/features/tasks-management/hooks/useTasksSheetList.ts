import { useMemo, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { DEFAULT_TASK_SORT } from "@/features/tasks-management/constants/taskSort";
import { DEFAULT_TASK_STATUS_FILTER } from "@/features/tasks-management/constants/taskStatusFilter";
import {
  DEFAULT_TASK_TAB,
  type TaskTabId,
} from "@/features/tasks-management/constants/taskTabs";
import { useTasksQuery } from "@/features/tasks-management/hooks/useTasksQuery";
import { filterTasksByTab } from "@/features/tasks-management/utils/taskAccessUtils";
import { sortTasks } from "@/features/tasks-management/utils/taskSortUtils";
import { filterTasksByStatus } from "@/features/tasks-management/utils/taskStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function useTasksSheetList() {
  const { teamMemberId } = useAuth();
  const { tasks, isLoading, error } = useTasksQuery();
  const [tab, setTab] = useState<TaskTabId>(DEFAULT_TASK_TAB);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const scoped = filterTasksByStatus(
      filterTasksByTab(tasks, tab, teamMemberId),
      DEFAULT_TASK_STATUS_FILTER,
    ).filter((task) =>
      matchesListingSearch(searchQuery, [
        task.title,
        task.description,
        task.projects?.project_name,
        task.client?.client_name,
        task.projects?.clients?.client_name,
        task.assigned_to?.member_name,
        task.status,
        task.priority,
      ]),
    );
    return sortTasks(scoped, DEFAULT_TASK_SORT);
  }, [searchQuery, tab, tasks, teamMemberId]);

  return {
    tasks: filteredTasks,
    isLoading,
    error,
    tab,
    setTab,
    searchQuery,
    setSearchQuery,
    hasSearch: Boolean(searchQuery.trim()),
  };
}
