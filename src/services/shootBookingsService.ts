import { SHOOT_SLOT_TAKEN_MESSAGE } from "@/features/shoot-bookings/constants/shootBookings";
import type {
  CreateShootBookingInput,
  ShootBooking,
  ShootBookingStatus,
  ShootBusySlot,
} from "@/features/shoot-bookings/types/types";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

/** Postgres exclusion-constraint violation = the slot overlaps a booking. */
const OVERLAP_ERROR_CODE = "23P01";

type ShootBookingRow = Omit<ShootBooking, "client_name" | "plan_name"> & {
  clients: { client_name: string } | null;
  production_plans: { plan_name: string } | null;
};

/** Postgres `time` comes back as "HH:mm:ss"; the app uses "HH:mm". */
const toClock = (value: string) => value.slice(0, 5);

function toShootBooking(row: ShootBookingRow): ShootBooking {
  const { clients, production_plans, ...rest } = row;
  return {
    ...rest,
    start_time: toClock(row.start_time),
    end_time: toClock(row.end_time),
    client_name: clients?.client_name ?? "",
    plan_name: production_plans?.plan_name ?? null,
  };
}

export async function fetchShootBookings(clientId?: string): Promise<ShootBooking[]> {
  let query = supabase
    .from(DB.SHOOT_BOOKINGS.TABLE)
    .select(DB.SHOOT_BOOKINGS.SELECT)
    .order("shoot_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as unknown as ShootBookingRow[]).map(toShootBooking);
}

export async function fetchShootBusySlots(
  from: string,
  to: string,
): Promise<ShootBusySlot[]> {
  const { data, error } = await supabase.rpc("fetch_shoot_busy_slots", {
    p_from: from,
    p_to: to,
  });
  if (error) throw error;
  return ((data ?? []) as { shoot_date: string; start_time: string; end_time: string }[]).map(
    (row) => ({
      date: row.shoot_date,
      start: toClock(row.start_time),
      end: toClock(row.end_time),
    }),
  );
}

export async function createShootBooking(input: CreateShootBookingInput): Promise<void> {
  const { error } = await supabase.from(DB.SHOOT_BOOKINGS.TABLE).insert({
    client_id: input.clientId,
    production_plan_id: input.productionPlanId,
    shoot_date: input.shootDate,
    start_time: input.startTime,
    end_time: input.endTime,
    notes: input.notes.trim() || null,
  });
  if (error?.code === OVERLAP_ERROR_CODE) throw new Error(SHOOT_SLOT_TAKEN_MESSAGE);
  if (error) throw error;
}

export async function updateShootBookingStatus(
  id: string,
  status: ShootBookingStatus,
): Promise<void> {
  const { error } = await supabase
    .from(DB.SHOOT_BOOKINGS.TABLE)
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
