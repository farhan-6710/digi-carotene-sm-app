import type { PostDateTimeValue } from "@/features/posts-management/types/types";
import { toPostDateTimeValue } from "@/features/posts-management/utils/postScheduleUtils";
import type {
  LeadActivityPriority,
  LeadActivityStatus,
  LeadCall,
  LeadMeeting,
  LeadMeetingVenue,
  LeadTask,
} from "@/features/crm/types/types";

export type LeadTaskFormValues = {
  title: string;
  description: string;
  priority: LeadActivityPriority;
  status: LeadActivityStatus;
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
  };
}

export function leadMeetingToFormValues(
  meeting: LeadMeeting,
): LeadMeetingFormValues {
  return {
    title: meeting.title,
    description: meeting.description ?? "",
    status: meeting.status,
    from: toPostDateTimeValue(meeting.from_date, meeting.from_time),
    to: toPostDateTimeValue(meeting.to_date, meeting.to_time),
    venue: meeting.venue,
  };
}

export function leadCallToFormValues(call: LeadCall): LeadCallFormValues {
  return {
    title: call.title,
    description: call.description ?? "",
    status: call.status,
    start: toPostDateTimeValue(call.start_date, call.start_time),
    durationMinutes: String(call.duration_minutes),
  };
}

export function isLeadActivityOpen(status: LeadActivityStatus): boolean {
  return status !== "completed";
}
