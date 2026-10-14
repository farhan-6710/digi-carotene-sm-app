import { LEAD_MONTH_FILTER_ALL } from "@/features/crm/constants/leadSort";
import type { LeadMonthFilterProps } from "@/features/crm/types/components";
import { Button } from "@/shared/ui/button";
import { MonthSelector } from "@/shared/ui/MonthSelector";
import { cn } from "@/shared/lib/utils";

function parseMonthKey(monthKey: string, fallback = new Date()) {
  if (monthKey === LEAD_MONTH_FILTER_ALL) {
    return {
      year: fallback.getFullYear(),
      month: fallback.getMonth() + 1,
    };
  }

  const [yearPart, monthPart] = monthKey.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  if (!year || !month) {
    return {
      year: fallback.getFullYear(),
      month: fallback.getMonth() + 1,
    };
  }

  return { year, month };
}

function toMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function LeadMonthFilter({
  value,
  onChange,
  disabled = false,
}: LeadMonthFilterProps) {
  const { year, month } = parseMonthKey(value);
  const isAll = value === LEAD_MONTH_FILTER_ALL;

  return (
    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
      <MonthSelector
        year={year}
        month={month}
        onSelect={(date) => {
          if (disabled) return;
          onChange(toMonthKey(date));
        }}
        className={cn(
          "h-9",
          disabled && "pointer-events-none opacity-50",
          isAll && "border-dashed text-muted-foreground",
        )}
      />
      <Button
        type="button"
        size="sm"
        variant={isAll ? "default" : "outline"}
        disabled={disabled}
        className="h-9 rounded-full px-3 text-xs font-medium"
        onClick={() => onChange(LEAD_MONTH_FILTER_ALL)}
      >
        All months
      </Button>
    </div>
  );
}
