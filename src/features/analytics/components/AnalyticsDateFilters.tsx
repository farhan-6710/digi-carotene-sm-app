import { AnalyticsDateRangePicker } from "@/features/analytics/components/AnalyticsDateRangePicker";
import type { AnalyticsDateFiltersProps } from "@/features/analytics/types/components";
import { cn } from "@/shared/lib/utils";

export function AnalyticsDateFilters({
  quickPeriods,
  activeQuickPeriod,
  isDateRangeActive,
  periodLabel,
  rangeButtonLabel,
  pickerRange,
  isPickerOpen,
  pickerError,
  onToggleQuickPeriod,
  onClearFilters,
  onClearDateRange,
  onApplyDateRange,
  onPickerRangeChange,
  onPickerOpenChange,
  onPickerKeyDown,
}: AnalyticsDateFiltersProps) {
  const hasActiveFilter = activeQuickPeriod !== null || isDateRangeActive;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {hasActiveFilter ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
        >
          Clear
        </button>
      ) : (
        <span className="text-[11px] text-muted-foreground">{periodLabel}</span>
      )}

      {quickPeriods.map((period) => {
        const isActive = activeQuickPeriod === period.id;

        return (
          <button
            key={period.id}
            type="button"
            onClick={() => onToggleQuickPeriod(period.id)}
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

      <AnalyticsDateRangePicker
        open={isPickerOpen}
        onOpenChange={onPickerOpenChange}
        range={pickerRange}
        rangeLabel={rangeButtonLabel}
        isActive={isDateRangeActive}
        onRangeChange={onPickerRangeChange}
        onApply={onApplyDateRange}
        onClear={onClearDateRange}
        onKeyDown={onPickerKeyDown}
        error={pickerError}
      />
    </div>
  );
}
