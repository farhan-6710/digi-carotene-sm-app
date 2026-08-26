import { TasksTableRow } from "@/features/tasks-management/components/TasksTableRow";
import { TaskTabFilter } from "@/features/tasks-management/components/TaskTabFilter";
import { tasksDirectoryConfig } from "@/features/tasks-management/constants/tasksDirectory";
import type { TasksTableProps } from "@/features/tasks-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingDateFilter } from "@/shared/components/ListingDateFilter";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

export function TasksTable({
  tasks,
  isLoading,
  canEditTask,
  onEditTask,
  searchQuery,
  onSearchQueryChange,
  etaDate,
  onEtaDateChange,
  tab,
  onTabChange,
}: TasksTableProps) {
  const hasFilters = Boolean(searchQuery.trim() || etaDate);

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
          <ListingDateFilter
            value={etaDate}
            onChange={onEtaDateChange}
            placeholder="Filter by ETA"
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
