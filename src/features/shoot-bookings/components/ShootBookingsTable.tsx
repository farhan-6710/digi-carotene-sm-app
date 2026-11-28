import { ShootBookingStatusBadge } from "@/features/shoot-bookings/components/ShootBookingStatusBadge";
import {
  shootBookingsDirectoryConfig,
  teamShootBookingsDirectoryConfig,
} from "@/features/shoot-bookings/constants/shootBookings";
import type { ShootBookingsTableProps } from "@/features/shoot-bookings/types/components";
import {
  formatClock,
  formatDuration,
  formatShootDate,
  hasShootStarted,
} from "@/features/shoot-bookings/utils/shootSlotUtils";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ShootBookingsTable({
  title,
  description,
  bookings,
  isLoading,
  emptyMessage,
  showClient = false,
  canComplete = false,
  canCancel = true,
  onStatusChange,
  filters,
}: ShootBookingsTableProps) {
  const config = showClient ? teamShootBookingsDirectoryConfig : shootBookingsDirectoryConfig;

  return (
    <DirectoryTable
      title={title}
      description={description}
      gridClass={config.gridClass}
      columns={[...config.columns]}
      emptyMessage={emptyMessage}
      isLoading={isLoading}
      isEmpty={bookings.length === 0}
      headerAside={filters}
    >
      {bookings.map((booking) => {
        const isOpen = booking.status === "booked";
        const started = hasShootStarted(booking.shoot_date, booking.start_time);
        return (
          <div
            key={booking.id}
            className={cn("grid items-center gap-2 px-6 py-4 sm:gap-4", config.gridClass)}
          >
            {showClient ? (
              <p className="truncate text-sm font-medium text-foreground">
                {booking.client_name || "—"}
              </p>
            ) : null}
            <div className="min-w-0">
              <p className={cn("text-sm text-foreground", !showClient && "font-medium")}>
                {formatShootDate(booking.shoot_date)}
              </p>
              {booking.notes ? (
                <p className="truncate text-xs text-muted-foreground" title={booking.notes}>
                  {booking.notes}
                </p>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatClock(booking.start_time)} – {formatClock(booking.end_time)}
            </p>
            {showClient ? null : (
              <p className="text-sm text-muted-foreground">
                {formatDuration(booking.start_time, booking.end_time)}
              </p>
            )}
            <p className="truncate text-sm text-muted-foreground">
              {booking.plan_name ?? "—"}
            </p>
            <ShootBookingStatusBadge status={booking.status} />
            <div className="flex justify-end gap-2">
              {isOpen && canComplete ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange({ booking, status: "completed" })}
                >
                  Complete
                </Button>
              ) : null}
              {isOpen && canCancel && (canComplete || !started) ? (
                <Button
                  size="sm"
                  variant="destructive-outline"
                  onClick={() => onStatusChange({ booking, status: "cancelled" })}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        );
      })}
    </DirectoryTable>
  );
}
