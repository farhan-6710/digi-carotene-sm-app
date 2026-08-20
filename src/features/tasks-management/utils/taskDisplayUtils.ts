import { formatPostScheduleLabel } from "@/features/posts-management/utils/postScheduleUtils";

export function formatTaskEta(etaDate: string, etaTime: string): string {
  const [year, month, day] = etaDate.split("-").map(Number);
  if (!year || !month || !day) return `${etaDate} · ${etaTime}`;
  return formatPostScheduleLabel(year, month, day, etaTime);
}
