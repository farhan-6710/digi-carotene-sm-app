import {
  SHOOT_BOOKING_STATUS_LABELS,
  SHOOT_BOOKING_STATUS_STYLES,
} from "@/features/shoot-bookings/constants/shootBookings";
import type { ShootBookingStatusBadgeProps } from "@/features/shoot-bookings/types/components";
import { cn } from "@/shared/lib/utils";

export function ShootBookingStatusBadge({ status }: ShootBookingStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase",
        SHOOT_BOOKING_STATUS_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {SHOOT_BOOKING_STATUS_LABELS[status]}
    </span>
  );
}
