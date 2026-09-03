import { TasksTableRow } from "@/features/tasks-management/components/TasksTableRow";
import { TaskSortSelect } from "@/features/tasks-management/components/TaskSortSelect";
import { TaskStatusFilter } from "@/features/tasks-management/components/TaskStatusFilter";
import { TaskTabFilter } from "@/features/tasks-management/components/TaskTabFilter";
import { DEFAULT_TASK_STATUS_FILTER } from "@/features/tasks-management/constants/taskStatusFilter";
import { tasksDirectoryConfig } from "@/features/tasks-management/constants/tasksDirectory";
import type { TasksTableProps } from "@/features/tasks-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

export function TasksTable({
  tasks,
  isLoading,
  canEditTask,
  onEditTask,
  searchQuery,
  onSearchQueryChange,
  sort,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  tab,
  onTabChange,
}: TasksTableProps) {
  const hasFilters =
    Boolean(searchQuery.trim()) || statusFilter !== DEFAULT_TASK_STATUS_FILTER;

  return (
    <DirectoryTable
      title={tasksDirectoryConfig.title}
      description={tasksDirectoryConfig.description}
      gridClass={tasksDirectoryConfig.gridClass}
      columns={tasksDirectoryConfig.columns}
      emptyMessage={
        hasFilters
          ? "No tasks match those filters."
          : tasksDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={tasks.length === 0}
      headerAside={
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <TaskTabFilter
            value={tab}
            onChange={onTabChange}
            disabled={isLoading}
          />
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
        <TasksTableRow
          key={task.id}
          task={task}
          canEdit={canEditTask(task)}
          onEdit={onEditTask}
        />
      ))}
    </DirectoryTable>
  );
}
