import { useCallback } from "react";

import type { ShootBooking } from "@/features/shoot-bookings/types/types";
import { fetchShootBookings } from "@/services/shootBookingsService";
import { useFetch } from "@/shared/hooks/useFetch";

const EMPTY: ShootBooking[] = [];

/** Pass a clientId for one client's bookings; omit it for every booking (team). */
export function useShootBookingsQuery(clientId?: string | null) {
  const load = useCallback(async () => {
    if (clientId === null) return EMPTY;
    return fetchShootBookings(clientId);
  }, [clientId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return { bookings: data, isLoading, error, setError, reload };
}
