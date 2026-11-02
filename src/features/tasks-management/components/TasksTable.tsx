import { useMemo } from "react";

import { TaskClientFilter } from "@/features/tasks-management/components/TaskClientFilter";
import { TasksTableRow } from "@/features/tasks-management/components/TasksTableRow";
import { TaskSortSelect } from "@/features/tasks-management/components/TaskSortSelect";
import { TaskStatusFilter } from "@/features/tasks-management/components/TaskStatusFilter";
import { TaskTabFilter } from "@/features/tasks-management/components/TaskTabFilter";
import { TASKS_ALL_CLIENTS } from "@/features/tasks-management/constants/taskClientFilter";
import { DEFAULT_TASK_STATUS_FILTER } from "@/features/tasks-management/constants/taskStatusFilter";
import {
  TASKS_BULK_GRID_CLASS,
  tasksColumns,
  tasksDirectoryConfig,
} from "@/features/tasks-management/constants/tasksDirectory";
import type { TasksTableProps } from "@/features/tasks-management/types/components";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import type { DirectoryTableColumn } from "@/shared/types/components";

export function TasksTable({
  tasks,
  isLoading,
  canEditTask,
  canDelete = false,
  selectedIds = [],
  allVisibleSelected = false,
  isDeleting = false,
  onToggleSelect,
  onToggleAllVisible,
  onClearSelection,
  onBulkDelete,
  onEditTask,
  searchQuery,
  onSearchQueryChange,
  sort,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  clientFilter,
  onClientFilterChange,
  clientOptions,
  tab,
  onTabChange,
}: TasksTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const hasFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== DEFAULT_TASK_STATUS_FILTER ||
    clientFilter !== TASKS_ALL_CLIENTS;

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!canDelete || !onToggleAllVisible) {
      return tasksColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={allVisibleSelected}
            onCheckedChange={onToggleAllVisible}
            ariaLabel="Select all tasks"
            disabled={isLoading || tasks.length === 0}
          />
        ),
      },
      ...tasksColumns,
    ];
  }, [
    allVisibleSelected,
    canDelete,
    isLoading,
    onToggleAllVisible,
    tasks.length,
  ]);

  return (
    <DirectoryTable
      title={tasksDirectoryConfig.title}
      description={tasksDirectoryConfig.description}
      gridClass={
        canDelete ? TASKS_BULK_GRID_CLASS : tasksDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={
        hasFilters
          ? "No tasks match those filters."
          : tasksDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={tasks.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {canDelete && onClearSelection && onBulkDelete ? (
            <DirectoryBulkDeleteBar
              selectedCount={selectedIds.length}
              singularLabel="task"
              pluralLabel="tasks"
              isDeleting={isDeleting}
              onClear={onClearSelection}
              onConfirmDelete={onBulkDelete}
            />
          ) : null}
          <TaskTabFilter value={tab} onChange={onTabChange} disabled={isLoading} />
        </div>
      }
      filters={
        <>
          <TaskClientFilter
            value={clientFilter}
            onChange={onClientFilterChange}
            clients={clientOptions}
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
          <div className="w-full min-w-0 sm:min-w-[200px] sm:flex-1 sm:max-w-sm">
            <ListingSearchInput
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="Search tasks"
              disabled={isLoading}
            />
          </div>
        </>
      }
    >
      {tasks.map((task) => (
        <TasksTableRow
          key={task.id}
          task={task}
          canEdit={canEditTask(task)}
          canDelete={canDelete}
          selected={selectedSet.has(task.id)}
          onToggleSelect={onToggleSelect}
          onEdit={onEditTask}
        />
      ))}
    </DirectoryTable>
  );
}
