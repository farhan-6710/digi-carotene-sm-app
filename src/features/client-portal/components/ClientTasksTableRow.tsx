import { buildClientTaskDetailPath } from "@/features/client-portal/constants/taskRoutes";
import { CLIENT_TASKS_ROW_GRID_CLASS } from "@/features/client-portal/constants/tasksDirectory";
import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import type { Task } from "@/features/tasks-management/types/types";
import { formatTaskEta } from "@/features/tasks-management/utils/taskDisplayUtils";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { cn } from "@/shared/lib/utils";

type ClientTasksTableRowProps = {
  task: Task;
};

export function ClientTasksTableRow({ task }: ClientTasksTableRowProps) {
  return (
    <DirectoryTableRow
      to={buildClientTaskDetailPath(task.id)}
      className={cn(
        "grid grid-cols-1 items-start gap-3 px-6 py-4 sm:items-center sm:gap-4",
        CLIENT_TASKS_ROW_GRID_CLASS,
      )}
    >
      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          TITLE
        </span>
        <p className="text-sm font-medium text-foreground">{task.title}</p>
        {task.description ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:truncate sm:line-clamp-none">
            {task.description}
          </p>
        ) : null}
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PROJECT
        </span>
        <p className="truncate text-sm text-muted-foreground">
          {task.projects?.project_name ?? "—"}
        </p>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          ASSIGNED TO
        </span>
        <p className="truncate text-sm text-muted-foreground">
          {task.assigned_to?.member_name ?? "—"}
        </p>
      </div>

      <div>
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PRIORITY
        </span>
        <span
          className={cn(
            "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
            task.priority === "high"
              ? "bg-destructive/10 text-destructive"
              : task.priority === "medium"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
          )}
        >
          {TASK_PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          ETA
        </span>
        <p className="text-sm text-muted-foreground sm:truncate">
          {formatTaskEta(task.eta_date, task.eta_time)}
        </p>
      </div>

      <div>
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          STATUS
        </span>
        <span className="inline-flex w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>
    </DirectoryTableRow>
  );
}
