import { ClientTasksTableRow } from "@/features/client-portal/components/ClientTasksTableRow";
import { clientTasksDirectoryConfig } from "@/features/client-portal/constants/tasksDirectory";
import { TaskSortSelect } from "@/features/tasks-management/components/TaskSortSelect";
import { TaskStatusFilter } from "@/features/tasks-management/components/TaskStatusFilter";
import type { ClientTasksTableProps } from "@/features/client-portal/types/components";
import { DEFAULT_TASK_STATUS_FILTER } from "@/features/tasks-management/constants/taskStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingFiltersChrome } from "@/shared/components/ListingFiltersChrome";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

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
      filters={
        <ListingFiltersChrome
          title="Task filters"
          activeCount={statusFilter !== DEFAULT_TASK_STATUS_FILTER ? 1 : 0}
          className="w-full"
          search={
            <div className="w-full min-w-0 md:min-w-[200px] md:max-w-sm md:flex-1">
              <ListingSearchInput
                value={searchQuery}
                onChange={onSearchQueryChange}
                placeholder="Search tasks"
                disabled={isLoading}
              />
            </div>
          }
        >
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
        </ListingFiltersChrome>
      }
    >
      {tasks.map((task) => (
        <ClientTasksTableRow key={task.id} task={task} />
      ))}
    </DirectoryTable>
  );
}
