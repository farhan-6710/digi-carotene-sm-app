import { Pencil } from "lucide-react";

import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import { TASKS_ROW_GRID_CLASS } from "@/features/tasks-management/constants/tasksDirectory";
import { buildTaskDetailPath } from "@/features/tasks-management/constants/routes";
import type { TasksTableRowProps } from "@/features/tasks-management/types/components";
import { formatAssigneeLabels } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import {
  formatTaskEta,
  formatTaskEtaShort,
} from "@/features/tasks-management/utils/taskDisplayUtils";
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
  const etaFull = formatTaskEta(task.eta_date, task.eta_time);
  const etaShort = formatTaskEtaShort(task.eta_date, task.eta_time);

  return (
    <DirectoryTableRow
      to={href}
      className={cn(
        "relative grid grid-cols-1 items-center gap-0 px-4 py-3 sm:items-center sm:gap-4 sm:px-6 sm:py-4",
        TASKS_ROW_GRID_CLASS,
      )}
    >
      {/* Mobile: title + project stacked, ETA centered on the right */}
      <div className="relative flex min-w-0 items-center gap-3 pr-27 sm:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {task.title}
          </p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {projectLabel}
          </p>
        </div>
        <span
          className="absolute right-0 top-1/2 max-w-26 -translate-y-1/2 truncate rounded-md border border-border bg-muted/80 px-2 py-1 text-xs font-semibold leading-tight text-muted-foreground"
          title={etaFull}
        >
          {etaShort}
        </span>
      </div>

      {/* Desktop columns */}
      <div className="hidden min-w-0 sm:block">
        <p className="text-sm font-medium text-foreground">{task.title}</p>
        {task.description ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {task.description}
          </p>
        ) : null}
      </div>

      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-sm text-muted-foreground">{projectLabel}</p>
      </div>

      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-sm text-muted-foreground">
          {task.created_by?.member_name ?? "—"}
        </p>
      </div>

      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-sm text-muted-foreground">{assigneeLabel}</p>
      </div>

      <div className="hidden sm:block">
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

      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-sm text-muted-foreground">{etaFull}</p>
      </div>

      <div className="hidden sm:block">
        <span className="inline-flex w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>

      <div className="hidden justify-end sm:flex">
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
