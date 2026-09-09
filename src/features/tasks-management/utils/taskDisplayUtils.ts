import { format } from "date-fns";

import { formatPostScheduleLabel } from "@/features/posts-management/utils/postScheduleUtils";

export function formatTaskEta(etaDate: string, etaTime: string): string {
  const [year, month, day] = etaDate.split("-").map(Number);
  if (!year || !month || !day) return `${etaDate} · ${etaTime}`;
  return formatPostScheduleLabel(year, month, day, etaTime);
}

/** Compact ETA for mobile list badges (e.g. "Aug 27 · 7:00 PM"). */
export function formatTaskEtaShort(etaDate: string, etaTime: string): string {
  const [year, month, day] = etaDate.split("-").map(Number);
  if (!year || !month || !day) return `${etaDate} · ${etaTime}`;
  return `${format(new Date(year, month - 1, day), "MMM d")} · ${etaTime}`;
}
