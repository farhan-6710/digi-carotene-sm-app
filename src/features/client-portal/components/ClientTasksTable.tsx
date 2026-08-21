import { ClientTasksTableRow } from "@/features/client-portal/components/ClientTasksTableRow";
import { clientTasksDirectoryConfig } from "@/features/client-portal/constants/tasksDirectory";
import type { Task } from "@/features/tasks-management/types/types";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

type ClientTasksTableProps = {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export function ClientTasksTable({
  tasks,
  isLoading,
  searchQuery,
  onSearchQueryChange,
}: ClientTasksTableProps) {
  return (
    <DirectoryTable
      title={clientTasksDirectoryConfig.title}
      description={clientTasksDirectoryConfig.description}
      gridClass={clientTasksDirectoryConfig.gridClass}
      columns={clientTasksDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No tasks match that search."
          : clientTasksDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={tasks.length === 0}
      headerAside={
        <ListingSearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search tasks"
          disabled={isLoading}
        />
      }
    >
      {tasks.map((task) => (
        <ClientTasksTableRow key={task.id} task={task} />
      ))}
    </DirectoryTable>
  );
}
