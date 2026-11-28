import type { ReactNode } from "react";

import type {
  ShootBooking,
  ShootBookingStatus,
  ShootBookingStatusFilter,
  ShootBusySlot,
  ShootSlotFormValues,
  ShootStatusChange,
} from "@/features/shoot-bookings/types/types";

export type ShootTimeGridProps = {
  label: string;
  times: string[];
  selected: string;
  onSelect: (time: string) => void;
  emptyMessage: string;
  disabled?: boolean;
};

export type ShootSlotDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: ShootSlotFormValues;
  onFieldChange: (field: keyof ShootSlotFormValues, value: string) => void;
  startOptions: string[];
  endOptions: string[];
  busy: ShootBusySlot[];
  planOptions: { value: string; label: string }[];
  isLoadingSlots: boolean;
  slotsError: string;
  isSaving: boolean;
  onConfirm: () => void;
};

export type ShootBookingStatusBadgeProps = {
  status: ShootBookingStatus;
};

export type ShootBookingsTableProps = {
  title: string;
  description: string;
  bookings: ShootBooking[];
  isLoading: boolean;
  emptyMessage: string;
  /** Team view adds the client column. */
  showClient?: boolean;
  /** Team view can mark a booking completed. */
  canComplete?: boolean;
  canCancel?: boolean;
  onStatusChange: (change: ShootStatusChange) => void;
  filters?: ReactNode;
};

export type ShootBookingStatusFilterProps = {
  value: ShootBookingStatusFilter;
  onChange: (value: ShootBookingStatusFilter) => void;
  disabled?: boolean;
};

export type ShootStatusConfirmModalProps = {
  pending: ShootStatusChange | null;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onConfirm: () => void | Promise<void>;
};
