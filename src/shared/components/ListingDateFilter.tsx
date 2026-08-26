import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { ListingDateFilterProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { parseUrlDateParam, serializeUrlDate } from "@/shared/utils/urlDateParams";

/**
 * Compact single-date filter for directory table headers (same size language
 * as ListingSearchInput). Value is `yyyy-MM-dd` or empty.
 */
export function ListingDateFilter({
  value,
  onChange,
  placeholder = "Filter by date",
  disabled = false,
  className,
}: ListingDateFilterProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseUrlDateParam(value || null);
  const displayValue = selectedDate
    ? format(selectedDate, "MMM d, yyyy")
    : placeholder;

  return (
    <div className={cn("relative w-full sm:w-[180px]", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-9 w-full justify-start gap-2 rounded-md border-input bg-transparent px-3 text-sm font-normal shadow-xs",
              selectedDate ? "pr-8" : null,
              !selectedDate && "text-muted-foreground",
            )}
            aria-label={placeholder}
          >
            <CalendarIcon
              className="size-3.5 shrink-0 opacity-70"
              aria-hidden="true"
            />
            <span className="truncate">{displayValue}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-100 w-auto border-muted-foreground/10 p-0 shadow-2xl"
          align="end"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              onChange(serializeUrlDate(date));
              setOpen(false);
            }}
            className="rounded-md border-none"
          />
        </PopoverContent>
      </Popover>
      {selectedDate ? (
        <button
          type="button"
          disabled={disabled}
          className="absolute top-1/2 right-2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition hover:text-foreground disabled:pointer-events-none"
          aria-label="Clear date filter"
          onClick={() => onChange("")}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
