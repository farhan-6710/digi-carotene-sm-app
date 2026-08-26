import { Pencil } from "lucide-react";

import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import { TASKS_ROW_GRID_CLASS } from "@/features/tasks-management/constants/tasksDirectory";
import { buildTaskDetailPath } from "@/features/tasks-management/constants/routes";
import type { TasksTableRowProps } from "@/features/tasks-management/types/components";
import { formatAssigneeLabels } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { formatTaskEta } from "@/features/tasks-management/utils/taskDisplayUtils";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { cn } from "@/shared/lib/utils";

export function TasksTableRow({
  task,
  canEdit,
  onEdit,
  detailPath,
}: TasksTableRowProps) {
  const projectLabel = task.projects?.project_name ?? "—";
  const assigneeMembers = task.assignees
    .filter((row) => row.team_member)
    .map((row) => row.team_member!);
  const assigneeClients = task.assignees
    .filter((row) => row.client)
    .map((row) => row.client!);
  const assigneeLabel =
    assigneeMembers.length > 0 || assigneeClients.length > 0
      ? formatAssigneeLabels({
          members: assigneeMembers,
          clients: assigneeClients,
        })
      : (task.assigned_to?.member_name ??
        task.client?.client_name ??
        "—");
  const href = detailPath ?? buildTaskDetailPath(task.id);

  return (
    <DirectoryTableRow
      to={href}
      className={cn(
        "grid grid-cols-1 items-start gap-3 px-6 py-4 sm:items-center sm:gap-4",
        TASKS_ROW_GRID_CLASS,
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
        <p className="truncate text-sm text-muted-foreground">{projectLabel}</p>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          RAISED BY
        </span>
        <p className="truncate text-sm text-muted-foreground">
          {task.created_by?.member_name ?? "—"}
        </p>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          ASSIGNED TO
        </span>
        <p className="truncate text-sm text-muted-foreground">{assigneeLabel}</p>
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

      <div className="flex justify-end">
        {canEdit ? (
          <button
            type="button"
            onClick={(event) => {
              stopDirectoryRowNav(event);
              onEdit(task);
            }}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit task</span>
          </button>
        ) : null}
      </div>
    </DirectoryTableRow>
  );
}
