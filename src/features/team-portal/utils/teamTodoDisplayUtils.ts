import { formatPostScheduleLabel } from "@/features/posts-management/utils/postScheduleUtils";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";

export function formatTeamTodoEta(date: string, time: string): string {
  const parsed = parseUrlDateParam(date);
  if (!parsed) return `${date} · ${time}`;
  return formatPostScheduleLabel(
    parsed.getFullYear(),
    parsed.getMonth() + 1,
    parsed.getDate(),
    time,
  );
}
