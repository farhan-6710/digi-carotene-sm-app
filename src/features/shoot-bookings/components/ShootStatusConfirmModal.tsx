import type { ShootStatusConfirmModalProps } from "@/features/shoot-bookings/types/components";
import {
  formatClock,
  formatShootDate,
} from "@/features/shoot-bookings/utils/shootSlotUtils";
import { ConfirmationModal } from "@/shared/ConfirmationModal";

export function ShootStatusConfirmModal({
  pending,
  onOpenChange,
  isSaving,
  onConfirm,
}: ShootStatusConfirmModalProps) {
  const isCancel = pending?.status === "cancelled";
  const slot = pending
    ? `${formatShootDate(pending.booking.shoot_date)}, ${formatClock(pending.booking.start_time)} – ${formatClock(pending.booking.end_time)}`
    : "";

  return (
    <ConfirmationModal
      open={pending !== null}
      onOpenChange={onOpenChange}
      title={isCancel ? "Cancel this shoot?" : "Mark shoot as completed?"}
      description={
        isCancel
          ? `${slot}. The slot will be freed for others to book. This can't be undone.`
          : `${slot}. The booking moves to completed.`
      }
      confirmLabel={isCancel ? "Cancel shoot" : "Mark completed"}
      cancelLabel={isCancel ? "Keep booking" : "Cancel"}
      confirmVariant={isCancel ? "destructive" : "default"}
      loading={isSaving}
      onConfirm={onConfirm}
    />
  );
}
