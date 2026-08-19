import { useState } from "react";

import { DateRangePicker } from "@/shared/components/DateRangePicker";
import { DATE_FILTERS_TWO_PERIODS } from "@/shared/constants/dateFiltersTwo";
import type { DateFiltersTwoProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

export function DateFiltersTwo({
  activeQuickPeriod,
  isDateRangeActive,
  periodLabel,
  rangeButtonLabel,
  pickerRange,
  pickerError,
  onToggleQuickPeriod,
  onClearFilters,
  onClearDateRange,
  onApplyDateRange,
  onPickerRangeChange,
  onPickerOpenChange,
  onPickerKeyDown,
}: DateFiltersTwoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAll = activeQuickPeriod === null && !isDateRangeActive;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          onClearFilters();
        }}
        className={cn(
          "inline-flex h-7 cursor-pointer items-center rounded-full border px-2.5 text-[11px] font-medium transition-colors",
          isAll
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-card text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </button>

      {DATE_FILTERS_TWO_PERIODS.map((period) => {
        const isActive = activeQuickPeriod === period.id;

        return (
          <button
            key={period.id}
            type="button"
            onClick={() => {
              setIsOpen(false);
              onToggleQuickPeriod(period.id);
            }}
            className={cn(
              "inline-flex h-7 cursor-pointer items-center rounded-full border px-2.5 text-[11px] font-medium transition-colors",
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {period.label}
          </button>
        );
      })}

      <DateRangePicker
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            onPickerOpenChange(true);
          }
        }}
        range={pickerRange}
        rangeLabel={rangeButtonLabel}
        isActive={isDateRangeActive}
        onRangeChange={onPickerRangeChange}
        onApply={() => {
          setIsOpen(false);
          onApplyDateRange();
        }}
        onClear={() => {
          setIsOpen(false);
          onClearDateRange();
        }}
        onKeyDown={onPickerKeyDown}
        error={pickerError}
      />

      {!isAll ? (
        <span className="sr-only">Active period: {periodLabel}</span>
      ) : null}
    </div>
  );
}
