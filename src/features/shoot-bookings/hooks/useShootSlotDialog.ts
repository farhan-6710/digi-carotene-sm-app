import { useMemo, useState } from "react";

import { useShootBusySlots } from "@/features/shoot-bookings/hooks/useShootBusySlots";
import type { ShootSlotFormValues } from "@/features/shoot-bookings/types/types";
import {
  getEndOptions,
  getShootSlotError,
  getStartOptions,
} from "@/features/shoot-bookings/utils/shootSlotUtils";
import { createShootBooking } from "@/services/shootBookingsService";
import { showToast } from "@/shared/utils/showToast";

const EMPTY_VALUES: ShootSlotFormValues = {
  date: "",
  start: "",
  end: "",
  planId: "",
  notes: "",
};

/** Booking dialog state: pick date → start → end, then save with a fresh overlap check. */
export function useShootSlotDialog(clientId: string | null, onBooked: () => void) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [isSaving, setIsSaving] = useState(false);
  const availability = useShootBusySlots(open);

  const startOptions = useMemo(
    () => (values.date ? getStartOptions(values.date, availability.busy) : []),
    [values.date, availability.busy],
  );
  const endOptions = useMemo(
    () => getEndOptions(values.date, values.start, availability.busy),
    [values.date, values.start, availability.busy],
  );

  const onFieldChange = (field: keyof ShootSlotFormValues, value: string) => {
    setValues((prev) => {
      if (field === "date") return { ...prev, date: value, start: "", end: "" };
      if (field === "start") return { ...prev, start: value, end: "" };
      return { ...prev, [field]: value };
    });
  };

  const openDialog = () => {
    setValues(EMPTY_VALUES);
    setOpen(true);
  };

  const confirm = async () => {
    if (!clientId) return;
    setIsSaving(true);
    try {
      const busy = await availability.reload();
      if (!busy) return;
      const slotError = getShootSlotError(values, busy);
      if (slotError) {
        showToast("error", slotError);
        setValues((prev) => ({ ...prev, start: "", end: "" }));
        return;
      }
      await createShootBooking({
        clientId,
        productionPlanId: values.planId || null,
        shootDate: values.date,
        startTime: values.start,
        endTime: values.end,
        notes: values.notes,
      });
      showToast("success", "Shoot slot booked.");
      setOpen(false);
      onBooked();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Could not book the slot.");
      void availability.reload();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    open,
    setOpen,
    openDialog,
    values,
    onFieldChange,
    startOptions,
    endOptions,
    busy: availability.busy,
    isLoadingSlots: availability.isLoading,
    slotsError: availability.error,
    isSaving,
    confirm,
  };
}
