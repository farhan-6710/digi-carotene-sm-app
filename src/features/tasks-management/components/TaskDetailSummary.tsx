import type { ReactNode } from "react";

import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import type { TaskDetailSummaryProps } from "@/features/tasks-management/types/components";
import { formatTaskEta } from "@/features/tasks-management/utils/taskDisplayUtils";
import { cn } from "@/shared/lib/utils";

export function TaskDetailSummary({ task }: TaskDetailSummaryProps) {
  const projectLabel = task.projects?.project_name ?? "—";
  const assigneeLabel =
    task.assigned_to?.member_name ??
    (task.client?.client_name
      ? `${task.client.client_name} (client)`
      : "—");

  const dependencyParts = [
    ...task.tagged_members.map((m) => m.member_name),
    ...(task.dependency_client
      ? [`${task.dependency_client.client_name} (client)`]
      : []),
  ];
  const dependenciesLabel =
    dependencyParts.length > 0 ? dependencyParts.join(", ") : "—";

  const details: Array<{
    label: string;
    value: ReactNode;
  }> = [
    { label: "Project", value: projectLabel },
    {
      label: "Raised by",
      value: task.created_by?.member_name ?? "—",
    },
    {
      label: "Assigned to",
      value: assigneeLabel,
    },
    {
      label: "Project manager",
      value: task.projects?.manager?.member_name ?? "—",
    },
    { label: "Dependencies", value: dependenciesLabel },
    {
      label: "Priority",
      value: (
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
            task.priority === "high"
              ? "bg-destructive/10 text-destructive"
              : task.priority === "medium"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
          )}
        >
          {TASK_PRIORITY_LABELS[task.priority]}
        </span>
      ),
    },
    {
      label: "ETA",
      value: formatTaskEta(task.eta_date, task.eta_time),
    },
    {
      label: "Status",
      value: (
        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {TASK_STATUS_LABELS[task.status]}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Task details
        </p>
        {task.description ? (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {task.description}
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
