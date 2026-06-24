import { CalendarRange, X } from "lucide-react";

import type { AnalyticsDateRangePickerProps } from "@/features/analytics/types/components";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";

export function AnalyticsDateRangePicker({
  open,
  onOpenChange,
  range,
  rangeLabel,
  isActive,
  onRangeChange,
  onApply,
  onClear,
  onKeyDown,
  error,
}: AnalyticsDateRangePickerProps) {
  if (isActive) {
    return (
      <div
        className={cn(
          "inline-flex h-7 items-center overflow-hidden rounded-full border text-[11px] font-medium",
          "border-primary bg-primary/10 text-primary",
        )}
      >
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="inline-flex h-full items-center gap-1.5 px-2.5 transition hover:bg-primary/15"
        >
          <CalendarRange className="size-3 shrink-0" aria-hidden="true" />
          <span>{rangeLabel}</span>
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-full items-center border-l border-primary/20 px-2 transition hover:bg-primary/15"
          aria-label="Clear date range"
        >
          <X className="size-3" />
        </button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-colors",
            "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          <CalendarRange className="size-3 shrink-0" aria-hidden="true" />
          <span>{rangeLabel}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-muted-foreground/10 p-0 shadow-2xl"
        align="end"
        onKeyDown={onKeyDown}
      >
        <Calendar
          mode="range"
          selected={range}
          defaultMonth={range?.from}
          numberOfMonths={2}
          onSelect={onRangeChange}
          className="rounded-md border-none"
        />
        <div className="space-y-2 border-t border-border px-4 py-3">
          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Pick a start and end date, then apply.
            </p>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              onClick={onApply}
              disabled={!range?.from}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
