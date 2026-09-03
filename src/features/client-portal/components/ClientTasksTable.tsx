import { ClientTasksTableRow } from "@/features/client-portal/components/ClientTasksTableRow";
import { clientTasksDirectoryConfig } from "@/features/client-portal/constants/tasksDirectory";
import { TaskSortSelect } from "@/features/tasks-management/components/TaskSortSelect";
import { TaskStatusFilter } from "@/features/tasks-management/components/TaskStatusFilter";
import type { TaskSortId } from "@/features/tasks-management/constants/taskSort";
import {
  DEFAULT_TASK_STATUS_FILTER,
  type TaskStatusFilterId,
} from "@/features/tasks-management/constants/taskStatusFilter";
import type { Task } from "@/features/tasks-management/types/types";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

type ClientTasksTableProps = {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sort: TaskSortId;
  onSortChange: (sort: TaskSortId) => void;
  statusFilter: TaskStatusFilterId;
  onStatusFilterChange: (filter: TaskStatusFilterId) => void;
};

export function ClientTasksTable({
  tasks,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  sort,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
}: ClientTasksTableProps) {
  const hasFilters =
    Boolean(searchQuery.trim()) || statusFilter !== DEFAULT_TASK_STATUS_FILTER;

  return (
    <DirectoryTable
      title={clientTasksDirectoryConfig.title}
      description={clientTasksDirectoryConfig.description}
      gridClass={clientTasksDirectoryConfig.gridClass}
      columns={clientTasksDirectoryConfig.columns}
      emptyMessage={
        hasFilters
          ? "No tasks match those filters."
          : clientTasksDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={tasks.length === 0}
      headerAside={
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <TaskStatusFilter
            value={statusFilter}
            onChange={onStatusFilterChange}
            disabled={isLoading}
          />
          <TaskSortSelect
            value={sort}
            onChange={onSortChange}
            disabled={isLoading}
          />
          <ListingSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search tasks"
            disabled={isLoading}
          />
        </div>
      }
    >
      {tasks.map((task) => (
        <ClientTasksTableRow key={task.id} task={task} />
      ))}
    </DirectoryTable>
  );
}
