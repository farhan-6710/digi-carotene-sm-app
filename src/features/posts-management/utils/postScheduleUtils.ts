import { format } from "date-fns";

import {
  DEFAULT_POST_TIME,
  POST_AVAILABLE_TIMES,
} from "@/features/posts-management/constants/postSchedule";
import type { PostDateTimeValue } from "@/features/posts-management/types/types";

export function normalizePostTime(time: string): string {
  const trimmed = time.trim();
  if (!trimmed) {
    return DEFAULT_POST_TIME;
  }

  const match = POST_AVAILABLE_TIMES.find(
    (option) => option.toLowerCase() === trimmed.toLowerCase(),
  );

  return match ?? trimmed;
}

export function formatPostScheduleLabel(
  year: number,
  month: number,
  date: number,
  time: string,
): string {
  const dateLabel = format(new Date(year, month - 1, date), "MMMM do yyyy");
  return `${dateLabel} · ${time}`;
}

export function isValidPostTime(time: string): boolean {
  return POST_AVAILABLE_TIMES.some(
    (option) => option.toLowerCase() === time.trim().toLowerCase(),
  );
}

export function comparePostTimes(a: string, b: string): number {
  const normalizedA = normalizePostTime(a);
  const normalizedB = normalizePostTime(b);
  const indexA = POST_AVAILABLE_TIMES.findIndex(
    (time) => time.toLowerCase() === normalizedA.toLowerCase(),
  );
  const indexB = POST_AVAILABLE_TIMES.findIndex(
    (time) => time.toLowerCase() === normalizedB.toLowerCase(),
  );

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }

  return normalizedA.localeCompare(normalizedB, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function parsePostDate(
  dateValue: string | null | undefined,
): { year: number; month: number; day: number } | null {
  if (!dateValue) {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return { year, month, day };
}

export function toPostDateString(
  year: number,
  month: number,
  day: number,
): string {
  return format(new Date(year, month - 1, day), "yyyy-MM-dd");
}

export function formatOptionalPostScheduleLabel(
  year: number | null,
  month: number | null,
  day: number | null,
  time: string | null,
): string {
  if (!year || !month || !day || !time?.trim()) {
    return "Not set";
  }

  return formatPostScheduleLabel(year, month, day, time);
}

export function isCompletePostDateTime(
  dateValue: string | null,
  timeValue: string | null,
): boolean {
  return Boolean(dateValue && timeValue?.trim() && isValidPostTime(timeValue));
}

export function parseDateTime(dateStr: string, timeStr: string): Date | null {
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;

  const timeMatch = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!timeMatch) return null;

  let hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const period = timeMatch[3].toUpperCase();

  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return new Date(year, month - 1, day, hours, minutes);
}

export type DelayInfo = {
  isDelayed: boolean;
  hours: number;
};

export function calculateDelay(
  scheduledDate: string,
  scheduledTime: string,
  postedDate: string | null,
  postedTime: string | null,
): DelayInfo {
  if (!postedDate || !postedTime) {
    return { isDelayed: false, hours: 0 };
  }

  const scheduledDateTime = parseDateTime(scheduledDate, scheduledTime);
  const postedDateTime = parseDateTime(postedDate, postedTime);

  if (!scheduledDateTime || !postedDateTime) {
    return { isDelayed: false, hours: 0 };
  }

  const diffMs = postedDateTime.getTime() - scheduledDateTime.getTime();
  if (diffMs <= 0) {
    return { isDelayed: false, hours: 0 };
  }

  const diffHours = diffMs / (1000 * 60 * 60);
  return { isDelayed: true, hours: diffHours };
}

export function toPostDateTimeValue(
  dateValue: string | null | undefined,
  timeValue: string | null | undefined,
): PostDateTimeValue | null {
  const dateParts = parsePostDate(dateValue);
  const time = timeValue?.trim();

  if (!dateParts || !time || !isValidPostTime(time)) {
    return null;
  }

  return {
    year: dateParts.year,
    month: dateParts.month,
    day: dateParts.day,
    time: normalizePostTime(time),
  };
}

export function toRepositoryDateTime(
  value: PostDateTimeValue | null,
): { date: string; time: string } | null {
  if (!value?.time.trim() || !isValidPostTime(value.time)) {
    return null;
  }

  return {
    date: toPostDateString(value.year, value.month, value.day),
    time: normalizePostTime(value.time),
  };
}
