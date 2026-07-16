import { PostTimeSelect } from "@/features/posts-management/components/PostTimeSelect";
import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/components/DatePicker";
import {
  formatOptionalPostScheduleLabel,
  formatPostScheduleLabel,
} from "@/features/posts-management/utils/postScheduleUtils";
import type { PostDateTimePickerProps } from "@/features/posts-management/types/components";
import { cn } from "@/shared/lib/utils";
import { parseUrlDateParam, serializeUrlDate } from "@/shared/utils/urlDateParams";
import { X } from "lucide-react";

export function PostDateTimePicker({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  onRemove,
}: PostDateTimePickerProps) {
  const displayLabel = value
    ? formatPostScheduleLabel(value.year, value.month, value.day, value.time)
    : formatOptionalPostScheduleLabel(null, null, null, null);

  const dateValue = value
    ? serializeUrlDate(new Date(value.year, value.month - 1, value.day))
    : "";

  const showClearHeader = Boolean(label) || (!required && value && !onRemove);

  return (
    <div className="space-y-2">
      {showClearHeader ? (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <span className="block text-xs font-semibold text-muted-foreground">
              {label}
            </span>
          ) : (
            <span />
          )}
          {!required && value && !onRemove ? (
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
      ) : null}

      <div
        className={cn(
          "grid items-center gap-2",
          onRemove
            ? "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            : "sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
        )}
      >
        <DatePicker
          value={dateValue}
          onChange={(nextDate) => {
            const date = parseUrlDateParam(nextDate);
            if (!date) {
              return;
            }

            onChange({
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
              time: value?.time ?? "",
            });
          }}
          disabled={disabled}
        />

        <PostTimeSelect
          selectedTime={value?.time ?? ""}
          summaryLabel={displayLabel}
          listLabel={`${label || "Schedule"} times`}
          disabled={disabled || !value}
          onTimeChange={(time) => {
            if (!value) {
              return;
            }

            onChange({ ...value, time });
          }}
        />

        {onRemove ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 shrink-0 rounded-lg"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove this day"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
