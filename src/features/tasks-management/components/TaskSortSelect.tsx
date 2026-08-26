import { ArrowUpDown, Check, ChevronDown } from "lucide-react";

import {
  TASK_SORT_LABELS,
  TASK_SORTS,
  type TaskSortId,
} from "@/features/tasks-management/constants/taskSort";
import type { TaskSortSelectProps } from "@/features/tasks-management/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function TaskSortSelect({
  value,
  onChange,
  disabled = false,
}: TaskSortSelectProps) {
  return (
    <div className="w-full sm:w-[180px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-9 w-full justify-between gap-2 rounded-md border-input bg-transparent px-3 text-sm font-normal shadow-xs",
            )}
            aria-label={`Select sorting: ${TASK_SORT_LABELS[value]}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <ArrowUpDown
                className="size-3.5 shrink-0 opacity-70"
                aria-hidden="true"
              />
              <span className="truncate text-muted-foreground">
                Select sorting
              </span>
            </span>
            <ChevronDown
              className="size-3.5 shrink-0 opacity-70"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          {TASK_SORTS.map((sort) => (
            <DropdownMenuItem
              key={sort}
              onSelect={() => onChange(sort as TaskSortId)}
              className="flex items-center justify-between gap-2"
            >
              <span>{TASK_SORT_LABELS[sort]}</span>
              {value === sort ? (
                <Check className="size-3.5 shrink-0 text-primary" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
