import type { PostDateTimeValue } from "@/features/posts-management/types/types";
import {
  isValidPostTime,
  normalizePostTime,
  parsePostDate,
  toPostDateString,
} from "@/features/posts-management/utils/postScheduleUtils";
import type {
  LeadActivityPriority,
  LeadActivityStatus,
  LeadCall,
  LeadMeeting,
  LeadMeetingVenue,
  LeadTask,
} from "@/features/crm/types/types";

/** CRM activities: date required, time optional. */
export function toLeadActivityDateTimeValue(
  dateValue: string | null | undefined,
  timeValue: string | null | undefined,
): PostDateTimeValue | null {
  const dateParts = parsePostDate(dateValue);
  if (!dateParts) return null;

  const time = timeValue?.trim() ?? "";
  return {
    year: dateParts.year,
    month: dateParts.month,
    day: dateParts.day,
    time: time && isValidPostTime(time) ? normalizePostTime(time) : "",
  };
}

/** CRM activities: date required, time optional (empty string when unset). */
export function toLeadActivityRepositoryDateTime(
  value: PostDateTimeValue | null,
): { date: string; time: string } | null {
  if (!value) return null;

  const time = value.time.trim();
  return {
    date: toPostDateString(value.year, value.month, value.day),
    time: time && isValidPostTime(time) ? normalizePostTime(time) : "",
  };
}

export type LeadTaskFormValues = {
  title: string;
  description: string;
  priority: LeadActivityPriority;
  status: LeadActivityStatus;
  eta: PostDateTimeValue | null;
};

export type LeadMeetingFormValues = {
  title: string;
  description: string;
  status: LeadActivityStatus;
  from: PostDateTimeValue | null;
  to: PostDateTimeValue | null;
  venue: LeadMeetingVenue;
};

export type LeadCallFormValues = {
  title: string;
  description: string;
  status: LeadActivityStatus;
  start: PostDateTimeValue | null;
  durationMinutes: string;
};

export type LeadAttachmentFormValues = {
  url: string;
  label: string;
};

export const EMPTY_LEAD_TASK_FORM: LeadTaskFormValues = {
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  eta: null,
};

export const EMPTY_LEAD_MEETING_FORM: LeadMeetingFormValues = {
  title: "",
  description: "",
  status: "pending",
  from: null,
  to: null,
  venue: "online",
};

export const EMPTY_LEAD_CALL_FORM: LeadCallFormValues = {
  title: "",
  description: "",
  status: "pending",
  start: null,
  durationMinutes: "30",
};

export const EMPTY_LEAD_ATTACHMENT_FORM: LeadAttachmentFormValues = {
  url: "",
  label: "",
};

export function leadTaskToFormValues(task: LeadTask): LeadTaskFormValues {
  return {
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    status: task.status,
    eta: toLeadActivityDateTimeValue(task.eta_date, task.eta_time),
  };
}

export function leadMeetingToFormValues(
  meeting: LeadMeeting,
): LeadMeetingFormValues {
  return {
    title: meeting.title,
    description: meeting.description ?? "",
    status: meeting.status,
    from: toLeadActivityDateTimeValue(meeting.from_date, meeting.from_time),
    to: toLeadActivityDateTimeValue(meeting.to_date, meeting.to_time),
    venue: meeting.venue,
  };
}

export function leadCallToFormValues(call: LeadCall): LeadCallFormValues {
  return {
    title: call.title,
    description: call.description ?? "",
    status: call.status,
    start: toLeadActivityDateTimeValue(call.start_date, call.start_time),
    durationMinutes: String(call.duration_minutes),
  };
}

export function isLeadActivityOpen(status: LeadActivityStatus): boolean {
  return status !== "completed";
}
