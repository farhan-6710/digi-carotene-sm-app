import { CalendarRange } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";
import type { ReportDateRangePickerProps } from "@/features/reports/types/components";

export function ReportDateRangePicker({
  open,
  onOpenChange,
  range,
  rangeLabel,
  onRangeChange,
  onApply,
  onKeyDown,
  isLoading = false,
}: ReportDateRangePickerProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-11 gap-2.5 rounded-full border-ring/60 bg-card px-5 text-sm font-semibold shadow-sm",
            !range?.from && "text-muted-foreground",
          )}
        >
          <CalendarRange className="size-5 shrink-0" aria-hidden="true" />
          <span>{rangeLabel}</span>
        </Button>
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
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Click Apply to confirm your selected date range.
          </p>
          <Button
            type="button"
            size="sm"
            className="rounded-full"
            onClick={onApply}
            disabled={!range?.from || isLoading}
          >
            {isLoading ? "Loading..." : "Apply"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
