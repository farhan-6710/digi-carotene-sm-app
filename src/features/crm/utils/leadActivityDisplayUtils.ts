import { format } from "date-fns";

import { formatPostScheduleLabel } from "@/features/posts-management/utils/postScheduleUtils";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";

export function formatLeadDateTime(date: string, time: string): string {
  const parsed = parseUrlDateParam(date);
  const trimmedTime = time?.trim() ?? "";

  if (!parsed) {
    return trimmedTime ? `${date} · ${trimmedTime}` : date;
  }

  if (!trimmedTime) {
    return format(parsed, "MMMM do yyyy");
  }

  return formatPostScheduleLabel(
    parsed.getFullYear(),
    parsed.getMonth() + 1,
    parsed.getDate(),
    trimmedTime,
  );
}
