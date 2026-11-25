import { Pencil } from "lucide-react";

import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import {
  TASKS_BULK_ROW_GRID_CLASS,
  TASKS_ROW_GRID_CLASS,
} from "@/features/tasks-management/constants/tasksDirectory";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
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
  canDelete = false,
  selected = false,
  onToggleSelect,
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

  return (
    <DirectoryTableRow
      to={href}
      className={cn(
        "grid items-center gap-4 px-6 py-4",
        canDelete ? TASKS_BULK_ROW_GRID_CLASS : TASKS_ROW_GRID_CLASS,
      )}
    >
      {canDelete && onToggleSelect ? (
        <DirectoryBulkCheckbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(task.id)}
          ariaLabel={`Select ${task.title}`}
        />
      ) : null}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{task.title}</p>
        {task.description ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {task.description}
          </p>
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{projectLabel}</p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">
          {task.created_by?.member_name ?? "—"}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{assigneeLabel}</p>
      </div>

      <div>
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
        <p className="truncate text-sm text-muted-foreground">{etaFull}</p>
      </div>

      <div>
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
