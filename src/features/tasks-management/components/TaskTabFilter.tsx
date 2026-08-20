import {
  TASK_TAB_LABELS,
  TASK_TABS,
} from "@/features/tasks-management/constants/taskTabs";
import type { TaskTabFilterProps } from "@/features/tasks-management/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TaskTabFilter({
  value,
  onChange,
  disabled = false,
}: TaskTabFilterProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full border border-border bg-muted/30 p-1">
      {TASK_TABS.map((tab) => (
        <Button
          key={tab}
          type="button"
          size="sm"
          variant={value === tab ? "default" : "ghost"}
          disabled={disabled}
          className={cn(
            "h-8 rounded-full px-3 text-xs",
            value !== tab && "text-muted-foreground",
          )}
          onClick={() => onChange(tab)}
        >
          {TASK_TAB_LABELS[tab]}
        </Button>
      ))}
    </div>
  );
}
