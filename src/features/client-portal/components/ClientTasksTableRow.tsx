import { buildClientTaskDetailPath } from "@/features/client-portal/constants/taskRoutes";
import { CLIENT_TASKS_ROW_GRID_CLASS } from "@/features/client-portal/constants/tasksDirectory";
import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import type { ClientTasksTableRowProps } from "@/features/client-portal/types/components";
import { formatAssigneeLabels } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { formatTaskEta } from "@/features/tasks-management/utils/taskDisplayUtils";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { cn } from "@/shared/lib/utils";

export function ClientTasksTableRow({ task }: ClientTasksTableRowProps) {
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
      : (task.assigned_to?.member_name ?? task.client?.client_name ?? "—");
  const etaFull = formatTaskEta(task.eta_date, task.eta_time);

  return (
    <DirectoryTableRow
      to={buildClientTaskDetailPath(task.id)}
      className={cn(
        "grid items-center gap-4 px-6 py-4",
        CLIENT_TASKS_ROW_GRID_CLASS,
      )}
    >
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
    </DirectoryTableRow>
  );
}
