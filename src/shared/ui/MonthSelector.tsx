import { format } from "date-fns";
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";

const MONTH_INDICES = Array.from({ length: 12 }, (_, index) => index);

export type MonthSelectorProps = {
  year: number;
  month: number;
  onSelect: (date: Date) => void;
  className?: string;
};

export function MonthSelector({
  year,
  month,
  onSelect,
  className,
}: MonthSelectorProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setViewYear(year);
    }
    setOpen(nextOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="default"
          className={cn(
            "h-auto w-full justify-between gap-2 rounded-full border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted/50 sm:w-auto sm:justify-start",
            className,
          )}
        >
          <CalendarIcon className="size-3.5 opacity-70" aria-hidden="true" />
          <span>{format(new Date(year, month - 1, 1), "MMMM yyyy")}</span>
          <ChevronDown className="size-3.5 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-2rem,17.5rem)] border-muted-foreground/10 p-0 shadow-2xl"
        align="start"
      >
        <div className="bg-background p-2">
          <div className="relative flex items-center justify-between px-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Previous year"
              onClick={() => setViewYear((current) => current - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium select-none">{viewYear}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Next year"
              onClick={() => setViewYear((current) => current + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div
            role="grid"
            aria-label={`Select month in ${viewYear}`}
            className="mt-2 grid grid-cols-3 gap-1 p-1"
          >
            {MONTH_INDICES.map((monthIndex) => {
              const isSelected =
                viewYear === year && monthIndex + 1 === month;
              const monthLabel = format(
                new Date(viewYear, monthIndex, 1),
                "MMM",
              );

              return (
                <button
                  key={monthIndex}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelect(new Date(viewYear, monthIndex, 1));
                    setOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-2.5 text-sm font-medium transition-colors",
                    "hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25",
                    isSelected
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-foreground",
                  )}
                >
                  {monthLabel}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
