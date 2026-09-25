import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { buildTaskDetailPath } from "@/features/tasks-management/constants/routes";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import type { TasksSheetRowProps } from "@/features/tasks-management/types/components";
import { formatTaskEtaShort } from "@/features/tasks-management/utils/taskDisplayUtils";
import { TransitionLink } from "@/shared/components/TransitionLink";

export function TasksSheetRow({ task, onNavigate }: TasksSheetRowProps) {
  return (
    <TransitionLink
      to={buildTaskDetailPath(task.id)}
      onClick={onNavigate}
      className="block rounded-lg px-1 py-3 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-medium text-foreground">
          {task.title}
        </p>
        <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>
      <p className="mt-1 truncate text-xs text-muted-foreground">
        {task.projects?.project_name ?? "No project"}
        {" · "}
        {TASK_PRIORITY_LABELS[task.priority]}
      </p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">
        {formatTaskEtaShort(task.eta_date, task.eta_time)}
      </p>
    </TransitionLink>
  );
}
