import { Pencil } from "lucide-react";

import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import { SUBTASKS_ROW_GRID_CLASS } from "@/features/tasks-management/constants/subtasksDirectory";
import type { SubtasksTableRowProps } from "@/features/tasks-management/types/components";
import { formatAssigneeLabels } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { formatTaskEta } from "@/features/tasks-management/utils/taskDisplayUtils";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { cn } from "@/shared/lib/utils";

export function SubtasksTableRow({
  subtask,
  canEdit,
  onEdit,
  detailPath,
}: SubtasksTableRowProps) {
  const raiserLabel =
    subtask.created_by?.member_name ??
    subtask.created_by_client?.client_name ??
    "—";
  const assigneeMembers = subtask.assignees
    .filter((row) => row.team_member)
    .map((row) => row.team_member!);
  const assigneeClients = subtask.assignees
    .filter((row) => row.client)
    .map((row) => row.client!);
  const assigneeLabel =
    assigneeMembers.length > 0 || assigneeClients.length > 0
      ? formatAssigneeLabels({
          members: assigneeMembers,
          clients: assigneeClients,
        })
      : (subtask.assigned_to?.member_name ??
        subtask.assigned_to_client?.client_name ??
        "—");

  const cells = (
    <>
      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          TITLE
        </span>
        <p className="text-sm font-medium text-foreground">{subtask.title}</p>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          RAISED BY
        </span>
        <p className="truncate text-sm text-muted-foreground">{raiserLabel}</p>
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
            subtask.priority === "high"
              ? "bg-destructive/10 text-destructive"
              : subtask.priority === "medium"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
          )}
        >
          {TASK_PRIORITY_LABELS[subtask.priority]}
        </span>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          ETA
        </span>
        <p className="text-sm text-muted-foreground sm:truncate">
          {formatTaskEta(subtask.eta_date, subtask.eta_time)}
        </p>
      </div>

      <div>
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          STATUS
        </span>
        <span className="inline-flex w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {TASK_STATUS_LABELS[subtask.status]}
        </span>
      </div>

      <div className="flex justify-end">
        {canEdit ? (
          <button
            type="button"
            onClick={(event) => {
              stopDirectoryRowNav(event);
              onEdit(subtask);
            }}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit subtask</span>
          </button>
        ) : null}
      </div>
    </>
  );

  const rowClassName = cn(
    "grid grid-cols-1 items-start gap-3 px-6 py-4 sm:items-center sm:gap-4",
    SUBTASKS_ROW_GRID_CLASS,
  );

  if (detailPath) {
    return (
      <DirectoryTableRow to={detailPath} className={rowClassName}>
        {cells}
      </DirectoryTableRow>
    );
  }

  return <div className={cn(rowClassName, "hover:bg-muted/10")}>{cells}</div>;
}
