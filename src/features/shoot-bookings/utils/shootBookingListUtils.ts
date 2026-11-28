import type { ShootBooking } from "@/features/shoot-bookings/types/types";
import { hasShootStarted } from "@/features/shoot-bookings/utils/shootSlotUtils";

const slotKey = (booking: ShootBooking) => `${booking.shoot_date} ${booking.start_time}`;

const isUpcoming = (booking: ShootBooking) =>
  booking.status === "booked" && !hasShootStarted(booking.shoot_date, booking.start_time);

/** Upcoming booked shoots first (soonest first), then everything else (newest first). */
export function sortShootBookings(bookings: ShootBooking[]): ShootBooking[] {
  const upcoming = bookings
    .filter(isUpcoming)
    .sort((a, b) => slotKey(a).localeCompare(slotKey(b)));
  const rest = bookings
    .filter((booking) => !isUpcoming(booking))
    .sort((a, b) => slotKey(b).localeCompare(slotKey(a)));
  return [...upcoming, ...rest];
}

export function countUpcomingShoots(bookings: ShootBooking[]): number {
  return bookings.filter(isUpcoming).length;
}
