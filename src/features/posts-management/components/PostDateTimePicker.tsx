import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { PostTimeSelect } from "@/features/posts-management/components/PostTimeSelect";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import {
  formatOptionalPostScheduleLabel,
  formatPostScheduleLabel,
} from "@/features/posts-management/utils/postScheduleUtils";
import type { PostDateTimePickerProps } from "@/features/posts-management/types/components";

export function PostDateTimePicker({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
}: PostDateTimePickerProps) {
  const [dateOpen, setDateOpen] = useState(false);

  const selectedDate = value
    ? new Date(value.year, value.month - 1, value.day)
    : undefined;

  const displayLabel = value
    ? formatPostScheduleLabel(value.year, value.month, value.day, value.time)
    : formatOptionalPostScheduleLabel(null, null, null, null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="block text-xs font-semibold text-muted-foreground">
          {label}
        </span>
        {!required && value ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-auto px-2 py-1 text-[11px] text-muted-foreground"
            onClick={() => onChange(null)}
            disabled={disabled}
          >
            <X className="size-3" aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="h-auto w-full justify-start gap-2 rounded-lg border border-ring/60 bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-muted/50 dark:border-input dark:bg-muted/40"
            >
              <CalendarIcon className="size-3.5 opacity-70" aria-hidden="true" />
              {value
                ? format(new Date(value.year, value.month - 1, value.day), "MMMM do yyyy")
                : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="z-[100] w-auto border-muted-foreground/10 p-0 shadow-2xl"
            align="start"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate}
              onSelect={(date) => {
                if (!date) {
                  return;
                }

                onChange({
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  day: date.getDate(),
                  time: value?.time ?? "",
                });
                setDateOpen(false);
              }}
              className="rounded-md border-none"
            />
          </PopoverContent>
        </Popover>

        <PostTimeSelect
          selectedTime={value?.time ?? ""}
          summaryLabel={displayLabel}
          listLabel={`${label} times`}
          disabled={disabled || !value}
          onTimeChange={(time) => {
            if (!value) {
              return;
            }

            onChange({ ...value, time });
          }}
        />
      </div>
    </div>
  );
}
