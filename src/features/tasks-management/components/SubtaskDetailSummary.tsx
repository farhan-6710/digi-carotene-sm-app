import type { ReactNode } from "react";

import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import type { SubtaskDetailSummaryProps } from "@/features/tasks-management/types/components";
import { formatAssigneeLabels } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { formatTaskEta } from "@/features/tasks-management/utils/taskDisplayUtils";
import { cn } from "@/shared/lib/utils";

export function SubtaskDetailSummary({
  subtask,
  parentTaskTitle,
}: SubtaskDetailSummaryProps) {
  const raiserLabel =
    subtask.created_by?.member_name ??
    (subtask.created_by_client?.client_name
      ? `${subtask.created_by_client.client_name} (client)`
      : "—");
  const assigneeMembers = subtask.assignees
    .filter((row) => row.team_member)
    .map((row) => row.team_member!);
  const assigneeClients = subtask.assignees
    .filter((row) => row.client)
    .map((row) =>
      row.client
        ? { client_name: `${row.client.client_name} (client)` }
        : null,
    )
    .filter(Boolean) as { client_name: string }[];
  const assigneeLabel =
    assigneeMembers.length > 0 || assigneeClients.length > 0
      ? formatAssigneeLabels({
          members: assigneeMembers,
          clients: assigneeClients,
        })
      : (subtask.assigned_to?.member_name ??
        (subtask.assigned_to_client?.client_name
          ? `${subtask.assigned_to_client.client_name} (client)`
          : "—"));

  const details: Array<{ label: string; value: ReactNode }> = [
    ...(parentTaskTitle
      ? [{ label: "Parent task", value: parentTaskTitle }]
      : []),
    { label: "Raised by", value: raiserLabel },
    { label: "Assigned to", value: assigneeLabel },
    {
      label: "Priority",
      value: (
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
            subtask.priority === "high"
              ? "bg-destructive/10 text-destructive"
              : subtask.priority === "medium"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
          )}
        >
          {TASK_PRIORITY_LABELS[subtask.priority]}
        </span>
      ),
    },
    {
      label: "ETA",
      value: formatTaskEta(subtask.eta_date, subtask.eta_time),
    },
    {
      label: "Status",
      value: (
        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {TASK_STATUS_LABELS[subtask.status]}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Subtask details
        </p>
        {subtask.description ? (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {subtask.description}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No description.</p>
        )}
      </div>

      <div className="divide-y divide-border">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-start justify-between gap-4 px-5 py-3 sm:px-6"
          >
            <span className="shrink-0 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {detail.label}
            </span>
            <span className="min-w-0 text-right text-sm font-medium break-words text-foreground">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
