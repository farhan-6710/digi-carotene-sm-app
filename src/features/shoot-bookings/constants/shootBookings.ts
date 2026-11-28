import type {
  ShootBookingStatus,
  ShootBookingStatusFilter,
} from "@/features/shoot-bookings/types/types";

/** Studio hours a client can book within (24h "HH:mm"). */
export const SHOOT_DAY_START = "08:00";
export const SHOOT_DAY_END = "22:00";
/** Start/end times move in these steps. */
export const SHOOT_STEP_MINUTES = 30;
export const SHOOT_MIN_DURATION_MINUTES = 30;
/** How far ahead (days, including today) a client can book. */
export const SHOOT_BOOKING_DAYS_AHEAD = 60;

export const SHOOT_BOOKINGS_PATH = "/team-portal/shoot-bookings";
export const SHOOT_BOOKING_STATUS_PARAM = "status";

export const SHOOT_BOOKING_STATUS_LABELS: Record<ShootBookingStatus, string> = {
  booked: "Booked",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const SHOOT_BOOKING_STATUS_STYLES: Record<ShootBookingStatus, string> = {
  booked: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
  completed:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  cancelled:
    "bg-muted text-muted-foreground border-border",
};

export const shootBookingStatusFilterOptions: {
  value: ShootBookingStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All statuses" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const SHOOT_SLOT_TAKEN_MESSAGE =
  "That time was just booked by someone else. Please pick another slot.";

export const shootBookingsDirectoryConfig = {
  gridClass:
    "grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)_minmax(0,0.6fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_7rem]",
  columns: [
    { label: "DATE" },
    { label: "TIME" },
    { label: "LENGTH" },
    { label: "PLAN" },
    { label: "STATUS" },
    { label: "ACTIONS", align: "right" as const },
  ],
} as const;

export const teamShootBookingsDirectoryConfig = {
  gridClass:
    "grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,1.1fr)_minmax(0,0.8fr)_9rem]",
  columns: [
    { label: "CLIENT" },
    { label: "DATE" },
    { label: "TIME" },
    { label: "PLAN" },
    { label: "STATUS" },
    { label: "ACTIONS", align: "right" as const },
  ],
} as const;
