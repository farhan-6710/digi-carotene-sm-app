import { useState } from "react";

import { SHOOT_BOOKING_STATUS_LABELS } from "@/features/shoot-bookings/constants/shootBookings";
import type { ShootStatusChange } from "@/features/shoot-bookings/types/types";
import { updateShootBookingStatus } from "@/services/shootBookingsService";
import { showToast } from "@/shared/utils/showToast";

/** Holds the pending cancel/complete action until the user confirms it. */
export function useShootStatusChange(onDone: () => void) {
  const [pending, setPending] = useState<ShootStatusChange | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const confirm = async () => {
    if (!pending) return;
    setIsSaving(true);
    try {
      await updateShootBookingStatus(pending.booking.id, pending.status);
      showToast(
        "success",
        `Shoot marked ${SHOOT_BOOKING_STATUS_LABELS[pending.status].toLowerCase()}.`,
      );
      setPending(null);
      onDone();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Could not update the booking.");
    } finally {
      setIsSaving(false);
    }
  };

  return { pending, setPending, isSaving, confirm };
}
