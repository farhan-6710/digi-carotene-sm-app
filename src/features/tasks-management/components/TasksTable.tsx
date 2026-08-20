import { TasksTableRow } from "@/features/tasks-management/components/TasksTableRow";
import { TaskTabFilter } from "@/features/tasks-management/components/TaskTabFilter";
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
  tab,
  onTabChange,
}: TasksTableProps) {
  return (
    <DirectoryTable
      title={tasksDirectoryConfig.title}
      description={tasksDirectoryConfig.description}
      gridClass={tasksDirectoryConfig.gridClass}
      columns={tasksDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No tasks match that search."
          : tasksDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={tasks.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:max-w-md sm:items-end">
          <TaskTabFilter
            value={tab}
            onChange={onTabChange}
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
