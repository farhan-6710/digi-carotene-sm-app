import { ClientTasksTableRow } from "@/features/client-portal/components/ClientTasksTableRow";
import { clientTasksDirectoryConfig } from "@/features/client-portal/constants/tasksDirectory";
import { TaskSortSelect } from "@/features/tasks-management/components/TaskSortSelect";
import type { TaskSortId } from "@/features/tasks-management/constants/taskSort";
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
};

export function ClientTasksTable({
  tasks,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  sort,
  onSortChange,
}: ClientTasksTableProps) {
  const hasFilters = Boolean(searchQuery.trim());

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
