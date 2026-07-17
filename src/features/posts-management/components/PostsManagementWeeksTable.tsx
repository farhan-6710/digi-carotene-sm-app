import { PostsWeekDayCell } from "@/features/posts-management/components/PostsWeekDayCell";
import {
  CALENDAR_DAY_COLUMN_WIDTH,
  CALENDAR_WEEK_COLUMN_MIN_WIDTH,
} from "@/features/posts-management/constants/calendarTable";
import { CALENDAR_DAY_LABELS } from "@/features/posts-management/constants/calendar";
import type { PostsManagementWeeksTableProps } from "@/features/posts-management/types/components";
import { isSameCalendarDay } from "@/features/posts-management/utils/calendarUtils";
import { TABLE_HORIZONTAL_SCROLL_CLASS } from "@/shared/constants/directoryTable";
import { cn } from "@/shared/lib/utils";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function PostsManagementWeeksTable({
  year,
  month,
  weeks,
  selectedDate,
  getSlot,
  onAdd,
  onEdit,
  statusColors,
  statusText,
}: PostsManagementWeeksTableProps) {
  const weekCount = weeks.length;
  const gridTemplateColumns = `${CALENDAR_DAY_COLUMN_WIDTH}px repeat(${weekCount}, minmax(${CALENDAR_WEEK_COLUMN_MIN_WIDTH}px, 1fr))`;
  const minTableWidth =
    CALENDAR_DAY_COLUMN_WIDTH + weekCount * CALENDAR_WEEK_COLUMN_MIN_WIDTH;

  return (
    <TooltipProvider>
      <div
        className={cn(
          TABLE_HORIZONTAL_SCROLL_CLASS,
          "rounded-2xl border border-border bg-card shadow-sm",
        )}
      >
        <div style={{ minWidth: minTableWidth }}>
          <div
            className="grid border-b border-border bg-muted text-xs font-semibold tracking-wider text-muted-foreground"
            style={{ gridTemplateColumns }}
          >
            <div className="sticky left-0 z-10 border-r border-border bg-muted px-4 py-3">
              Day
            </div>
            {weeks.map((week) => (
              <div key={week.label} className="px-4 py-3 text-center">
                <div className="whitespace-nowrap">{week.label}</div>
                <div className="whitespace-nowrap text-[11px] text-muted-foreground">
                  {week.range}
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-border">
            {CALENDAR_DAY_LABELS.map((dayLabel, dayIndex) => (
              <div
                key={dayLabel}
                className="grid"
                style={{ gridTemplateColumns }}
              >
                <div className="sticky left-0 z-10 flex items-center border-r border-border bg-muted/40 px-4 py-6 text-sm font-semibold">
                  {dayLabel}
                </div>
                {weeks.map((week) => {
                  const dateNumber = week.dates[dayIndex];

                  if (!dateNumber) {
                    return (
                      <div
                        key={`${dayLabel}-${week.label}-empty`}
                        className="min-h-[140px] border-r border-border/70 bg-muted/20"
                      />
                    );
                  }

                  return (
                    <PostsWeekDayCell
                      key={`${dayLabel}-${week.label}-${dateNumber}`}
                      year={year}
                      month={month}
                      dateNumber={dateNumber}
                      slot={getSlot(year, month, dateNumber)}
                      isSelected={isSameCalendarDay(
                        selectedDate,
                        year,
                        month,
                        dateNumber,
                      )}
                      statusColors={statusColors}
                      statusText={statusText}
                      onAdd={() => onAdd(year, month, dateNumber)}
                      onEdit={(postId) =>
                        onEdit(year, month, dateNumber, postId)
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
