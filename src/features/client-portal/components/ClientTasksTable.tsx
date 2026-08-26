import { ClientTasksTableRow } from "@/features/client-portal/components/ClientTasksTableRow";
import { clientTasksDirectoryConfig } from "@/features/client-portal/constants/tasksDirectory";
import type { Task } from "@/features/tasks-management/types/types";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingDateFilter } from "@/shared/components/ListingDateFilter";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

type ClientTasksTableProps = {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  etaDate: string;
  onEtaDateChange: (value: string) => void;
};

export function ClientTasksTable({
  tasks,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  etaDate,
  onEtaDateChange,
}: ClientTasksTableProps) {
  const hasFilters = Boolean(searchQuery.trim() || etaDate);

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
        <ClientTasksTableRow key={task.id} task={task} />
      ))}
    </DirectoryTable>
  );
}
