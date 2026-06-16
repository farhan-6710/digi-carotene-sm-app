import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import { cn } from "@/shared/lib/utils";
import type { StatusSelectProps } from "@/features/posts-management/types/components";

export function StatusSelect({
  value,
  onChange,
  options,
  disabled = false,
}: StatusSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-muted-foreground">
        Status
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-auto w-full justify-between gap-2 rounded-lg border border-ring/60 bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-muted/50 dark:border-input dark:bg-muted/40"
          >
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "size-2 rounded-full",
                  statusColors[value],
                )}
              />
              <span className={statusText[value]}>{value}</span>
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 opacity-50 transition-transform",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] border-muted-foreground/10 p-1 shadow-xl"
          align="start"
        >
          <div className="flex flex-col gap-0.5">
            {options.map((option) => {
              const isSelected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted/60",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        statusColors[option],
                      )}
                    />
                    <span className={statusText[option]}>{option}</span>
                  </span>
                  {isSelected ? (
                    <Check className="size-4 text-primary" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
