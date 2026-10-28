import type { PostDateTimeValue } from "@/features/posts-management/types/types";
import type {
  LeadFollowUp,
  LeadFollowUpStatus,
} from "@/features/crm/types/types";
import {
  toLeadActivityDateTimeValue,
  toLeadActivityRepositoryDateTime,
} from "@/features/crm/utils/leadActivityFormUtils";

export type LeadFollowUpFormValues = {
  when: PostDateTimeValue | null;
  status: LeadFollowUpStatus;
  note: string;
};

export const EMPTY_LEAD_FOLLOW_UP_FORM: LeadFollowUpFormValues = {
  when: null,
  status: "pending",
  note: "",
};

export function leadFollowUpToFormValues(
  followUp: LeadFollowUp,
): LeadFollowUpFormValues {
  return {
    when: toLeadActivityDateTimeValue(
      followUp.follow_up_date,
      followUp.follow_up_time,
    ),
    status: followUp.status,
    note: followUp.note ?? "",
  };
}

export function leadFollowUpFormToInput(values: LeadFollowUpFormValues) {
  const when = toLeadActivityRepositoryDateTime(values.when);
  if (!when) return null;
  return {
    followUpDate: when.date,
    followUpTime: when.time,
    status: values.status,
    note: values.note.trim() || null,
  };
}
