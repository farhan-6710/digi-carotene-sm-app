import { useCallback, useEffect, useState } from "react";

import type { ShootBusySlot } from "@/features/shoot-bookings/types/types";
import { getBookableRange } from "@/features/shoot-bookings/utils/shootSlotUtils";
import { fetchShootBusySlots } from "@/services/shootBookingsService";

/** Reloads taken times every time the booking dialog opens. */
export function useShootBusySlots(open: boolean) {
  const [busy, setBusy] = useState<ShootBusySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    const { first, last } = getBookableRange();
    setIsLoading(true);
    setError("");
    try {
      const next = await fetchShootBusySlots(first, last);
      setBusy(next);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Slots could not load.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) void reload();
  }, [open, reload]);

  return { busy, isLoading, error, reload };
}
