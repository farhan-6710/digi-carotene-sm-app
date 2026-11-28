import { addDays, format } from "date-fns";

import {
  SHOOT_BOOKING_DAYS_AHEAD,
  SHOOT_DAY_END,
  SHOOT_DAY_START,
  SHOOT_MIN_DURATION_MINUTES,
  SHOOT_STEP_MINUTES,
} from "@/features/shoot-bookings/constants/shootBookings";
import type {
  ShootBusySlot,
  ShootSlotSelection,
} from "@/features/shoot-bookings/types/types";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

type Block = [number, number];

const DAY_START = toMinutes(SHOOT_DAY_START);
const DAY_END = toMinutes(SHOOT_DAY_END);

export function toMinutes(clock: string): number {
  const [hours, minutes] = clock.split(":").map(Number);
  return hours * 60 + minutes;
}

export function toClock(minutes: number): string {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  return `${hours}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Half-open [start, end) blocks: touching (10:00–11:00 then 11:00–12:00) is fine. */
function blocksOverlap(a: Block, b: Block): boolean {
  return a[0] < b[1] && b[0] < a[1];
}

function busyBlocks(date: string, busy: ShootBusySlot[]): Block[] {
  return busy
    .filter((slot) => slot.date === date)
    .map((slot) => [toMinutes(slot.start), toMinutes(slot.end)]);
}

function earliestStart(date: string, now: Date): number {
  const today = serializeUrlDate(now);
  if (date < today) return Number.POSITIVE_INFINITY;
  if (date > today) return DAY_START;
  const nowMinutes = now.getHours() * 60 + now.getMinutes() + 1;
  return Math.ceil(nowMinutes / SHOOT_STEP_MINUTES) * SHOOT_STEP_MINUTES;
}

export function getBookableRange(now = new Date()) {
  return {
    first: serializeUrlDate(now),
    last: serializeUrlDate(addDays(now, SHOOT_BOOKING_DAYS_AHEAD - 1)),
  };
}

/** Start times with at least the minimum duration free after them. */
export function getStartOptions(
  date: string,
  busy: ShootBusySlot[],
  now = new Date(),
): string[] {
  const blocks = busyBlocks(date, busy);
  const from = earliestStart(date, now);
  const options: string[] = [];
  for (let t = DAY_START; t + SHOOT_MIN_DURATION_MINUTES <= DAY_END; t += SHOOT_STEP_MINUTES) {
    const slot: Block = [t, t + SHOOT_MIN_DURATION_MINUTES];
    if (t >= from && !blocks.some((block) => blocksOverlap(slot, block))) {
      options.push(toClock(t));
    }
  }
  return options;
}

/** End times from start + minimum up to the next booking (or closing time). */
export function getEndOptions(
  date: string,
  start: string,
  busy: ShootBusySlot[],
): string[] {
  if (!start) return [];
  const startMinutes = toMinutes(start);
  const nextBusyStarts = busyBlocks(date, busy)
    .filter((block) => block[0] >= startMinutes)
    .map((block) => block[0]);
  const limit = Math.min(DAY_END, ...nextBusyStarts);
  const options: string[] = [];
  for (let t = startMinutes + SHOOT_MIN_DURATION_MINUTES; t <= limit; t += SHOOT_STEP_MINUTES) {
    options.push(toClock(t));
  }
  return options;
}

export function isDateBookable(date: string, busy: ShootBusySlot[], now = new Date()) {
  const { first, last } = getBookableRange(now);
  if (date < first || date > last) return false;
  return getStartOptions(date, busy, now).length > 0;
}

/** Same checks the picker applies, run again right before saving. */
export function getShootSlotError(
  selection: ShootSlotSelection,
  busy: ShootBusySlot[],
  now = new Date(),
): string | null {
  const { date, start, end } = selection;
  if (!date || !start || !end) return "Pick a date, start time and end time.";
  const { first, last } = getBookableRange(now);
  if (date < first || date > last) return "That date can't be booked.";
  if (!getStartOptions(date, busy, now).includes(start)) {
    return "That start time is no longer available.";
  }
  if (!getEndOptions(date, start, busy).includes(end)) {
    return "That end time overlaps another booking.";
  }
  return null;
}

export function hasShootStarted(date: string, start: string, now = new Date()) {
  const today = serializeUrlDate(now);
  if (date !== today) return date < today;
  return toMinutes(start) <= now.getHours() * 60 + now.getMinutes();
}

export function formatClock(clock: string): string {
  const minutes = toMinutes(clock);
  return format(new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60), "h:mm a");
}

export function formatShootDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return format(new Date(year, month - 1, day), "EEE, d MMM yyyy");
}

export function formatDuration(start: string, end: string): string {
  const total = toMinutes(end) - toMinutes(start);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes}m`;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}
