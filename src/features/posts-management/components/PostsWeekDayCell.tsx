import type { PostsWeekDayCellProps } from "@/features/posts-management/types/components";
import {
  formatMonthDayLabel,
  getDayLabel,
} from "@/features/posts-management/utils/calendarUtils";
import {
  calculateDelay,
  comparePostTimes,
} from "@/features/posts-management/utils/postScheduleUtils";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function PostsWeekDayCell({
  year,
  month,
  dateNumber,
  slot,
  isSelected,
  statusColors,
  statusText,
  onAdd,
  onEdit,
}: PostsWeekDayCellProps) {
  const hasClients = Boolean(slot?.clients.length);
  const dayName = getDayLabel(year, month, dateNumber);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group flex min-h-[140px] cursor-pointer flex-col border-r p-4 text-left transition hover:bg-muted/40",
        isSelected ? "border-2 border-primary" : "border-border/70",
      )}
      aria-label={`Add post for ${dayName} ${formatMonthDayLabel(year, month, dateNumber)}`}
      aria-current={isSelected ? "date" : undefined}
      onClick={onAdd}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onAdd();
        }
      }}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Date</span>
        <span className="font-mono">
          {formatMonthDayLabel(year, month, dateNumber)}
        </span>
      </div>

      <div className="mt-3 flex max-h-[160px] flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
        {hasClients ? (
          [...(slot?.clients ?? [])]
            .sort((a, b) => comparePostTimes(a.scheduledTime, b.scheduledTime))
            .map((client) => {
              const delay =
                client.status === "Posted"
                  ? calculateDelay(
                      client.scheduledDate,
                      client.scheduledTime,
                      client.postedDate,
                      client.postedTime,
                    )
                  : null;

              return (
                <Tooltip key={client.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background/70 px-3 py-1.5 text-left transition hover:border-ring/50"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(client.id);
                      }}
                      aria-label={`Edit ${client.name}`}
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 shrink-0 rounded-full ${statusColors[client.status]}`}
                          />
                          <span className="truncate text-sm font-medium">
                            {client.name}
                          </span>
                        </div>
                        {delay?.isDelayed ? (
                          <span
                            className={cn(
                              "pl-4 text-[10px] font-semibold transition-colors",
                              delay.hours > 24 ? "text-red-500" : "text-amber-500",
                            )}
                          >
                            Delayed
                          </span>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {client.scheduledTime}
                        </span>
                        <span
                          className={`text-[11px] font-semibold ${statusText[client.status]}`}
                        >
                          {client.status}
                        </span>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{client.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            Click to add post
          </div>
        )}
      </div>
    </div>
  );
}
