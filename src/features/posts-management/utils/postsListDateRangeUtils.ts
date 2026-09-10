import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

/** True when the calendar day falls inside an applied list date range. */
export function isPostsListDayInRange(
  year: number,
  month: number,
  date: number,
  range: { from: Date; to?: Date } | undefined,
): boolean {
  if (!range?.from) return true;

  const day = new Date(year, month - 1, date);
  const from = startOfDay(range.from);
  const to = endOfDay(range.to ?? range.from);

  return isWithinInterval(day, { start: from, end: to });
}
