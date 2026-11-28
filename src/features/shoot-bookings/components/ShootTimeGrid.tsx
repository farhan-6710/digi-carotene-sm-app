import type { ShootTimeGridProps } from "@/features/shoot-bookings/types/components";
import { formatClock } from "@/features/shoot-bookings/utils/shootSlotUtils";
import { cn } from "@/shared/lib/utils";

export function ShootTimeGrid({
  label,
  times,
  selected,
  onSelect,
  emptyMessage,
  disabled = false,
}: ShootTimeGridProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        {times.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            {times.length} {times.length === 1 ? "option" : "options"}
          </span>
        ) : null}
      </div>
      {times.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 min-[420px]:grid-cols-4">
          {times.map((time) => (
            <button
              key={time}
              type="button"
              disabled={disabled}
              aria-pressed={time === selected}
              onClick={() => onSelect(time)}
              className={cn(
                "h-9 rounded-lg border text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                time === selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {formatClock(time)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
