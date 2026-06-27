import { format } from "date-fns";

export function toReportDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatReportDateRangeLabel(
  from: Date | undefined,
  to: Date | undefined,
): string {
  if (!from) {
    return "Select date range";
  }

  if (!to) {
    return format(from, "MMM d, yyyy");
  }

  if (format(from, "yyyy-MM-dd") === format(to, "yyyy-MM-dd")) {
    return format(from, "MMM d, yyyy");
  }

  return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
}
