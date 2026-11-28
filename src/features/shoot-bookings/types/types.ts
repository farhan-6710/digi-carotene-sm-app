export type ShootBookingStatus = "booked" | "completed" | "cancelled";

/** Times are 24h "HH:mm"; dates are "yyyy-MM-dd". */
export type ShootBooking = {
  id: string;
  client_id: string;
  client_name: string;
  production_plan_id: string | null;
  plan_name: string | null;
  shoot_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  status: ShootBookingStatus;
  created_at: string;
};

/** Someone's booked time (any client) — no details, just the block. */
export type ShootBusySlot = {
  date: string;
  start: string;
  end: string;
};

export type CreateShootBookingInput = {
  clientId: string;
  productionPlanId: string | null;
  shootDate: string;
  startTime: string;
  endTime: string;
  notes: string;
};

export type ShootSlotSelection = {
  date: string;
  start: string;
  end: string;
};

export type ShootBookingStatusFilter = ShootBookingStatus | "all";

export type ShootSlotFormValues = ShootSlotSelection & {
  planId: string;
  notes: string;
};

export type ShootStatusChange = {
  booking: ShootBooking;
  status: Exclude<ShootBookingStatus, "booked">;
};
