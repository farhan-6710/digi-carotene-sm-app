import { Loader2, Search } from "lucide-react";

import { TaskTabFilter } from "@/features/tasks-management/components/TaskTabFilter";
import { TasksSheetRow } from "@/features/tasks-management/components/TasksSheetRow";
import { TASKS_MANAGEMENT_PATH } from "@/features/tasks-management/constants/routes";
import { tasksDirectoryConfig } from "@/features/tasks-management/constants/tasksDirectory";
import { useTasksSheetList } from "@/features/tasks-management/hooks/useTasksSheetList";
import type { TasksSheetListProps } from "@/features/tasks-management/types/components";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { Input } from "@/shared/ui/input";

export function TasksSheetList({ onNavigate }: TasksSheetListProps) {
  const {
    tasks,
    isLoading,
    error,
    tab,
    setTab,
    searchQuery,
    setSearchQuery,
    hasSearch,
  } = useTasksSheetList();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TaskTabFilter value={tab} onChange={setTab} disabled={isLoading} />

      <div className="relative mt-3">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search tasks"
          disabled={isLoading}
          className="h-9 pl-8"
          aria-label="Search tasks"
        />
      </div>

      {error ? (
        <div className="mt-3">
          <ErrorBanner message={error} />
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 flex justify-center py-6">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : tasks.length === 0 ? (
        <p className="mt-4 py-6 text-center text-sm text-muted-foreground">
          {hasSearch
            ? "No tasks match that search."
            : tasksDirectoryConfig.emptyMessage}
        </p>
      ) : (
        <div className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <TasksSheetRow
                key={task.id}
                task={task}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}

      <TransitionLink
        to={TASKS_MANAGEMENT_PATH}
        onClick={onNavigate}
        className="mt-3 text-center text-xs font-medium text-primary hover:underline"
      >
        Open Task Management
      </TransitionLink>
    </div>
  );
}
