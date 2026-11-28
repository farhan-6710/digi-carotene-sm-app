import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { SHOOT_BOOKING_STATUS_PARAM } from "@/features/shoot-bookings/constants/shootBookings";
import type {
  ShootBooking,
  ShootBookingStatusFilter,
} from "@/features/shoot-bookings/types/types";
import { sortShootBookings } from "@/features/shoot-bookings/utils/shootBookingListUtils";

const STATUS_VALUES: ShootBookingStatusFilter[] = ["all", "booked", "completed", "cancelled"];

/** Status lives in the URL; search (client / plan / notes) is local. */
export function useShootBookingFilters(bookings: ShootBooking[]) {
  const [params, setParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const raw = params.get(SHOOT_BOOKING_STATUS_PARAM) as ShootBookingStatusFilter | null;
  const status = raw && STATUS_VALUES.includes(raw) ? raw : "all";

  const setStatus = (next: ShootBookingStatusFilter) => {
    setParams(
      (prev) => {
        const updated = new URLSearchParams(prev);
        if (next === "all") updated.delete(SHOOT_BOOKING_STATUS_PARAM);
        else updated.set(SHOOT_BOOKING_STATUS_PARAM, next);
        return updated;
      },
      { replace: true },
    );
  };

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matches = bookings.filter((booking) => {
      if (status !== "all" && booking.status !== status) return false;
      if (!query) return true;
      return [booking.client_name, booking.plan_name, booking.notes]
        .some((text) => text?.toLowerCase().includes(query));
    });
    return sortShootBookings(matches);
  }, [bookings, status, searchQuery]);

  return { status, setStatus, searchQuery, setSearchQuery, filtered };
}
