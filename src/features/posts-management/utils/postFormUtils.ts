import {
  DEFAULT_POST_STATUS,
} from "@/features/posts-management/constants/postsManagement";
import { DEFAULT_POST_TIME } from "@/features/posts-management/constants/postSchedule";
import type {
  PostDateTimeValue,
  Slot,
  StatusKey,
} from "@/features/posts-management/types/types";
import {
  toPostDateTimeValue,
  toRepositoryDateTime,
  normalizePostTime,
} from "@/features/posts-management/utils/postScheduleUtils";

export type PostFormValues = {
  clientId: string;
  clientName: string;
  postTitle: string;
  socials: string[];
  postLinks: Record<string, string>;
  toBePostedOn: PostDateTimeValue | null;
  postedOn: PostDateTimeValue | null;
  clientStatus: StatusKey;
};

export const emptyPostFormValues = (): PostFormValues => ({
  clientId: "",
  clientName: "",
  postTitle: "",
  socials: [],
  postLinks: {},
  toBePostedOn: null,
  postedOn: null,
  clientStatus: DEFAULT_POST_STATUS,
});

export function buildAddFormValues(
  slotYear: number,
  slotMonth: number,
  date: number,
): PostFormValues {
  return {
    ...emptyPostFormValues(),
    toBePostedOn: {
      year: slotYear,
      month: slotMonth,
      day: date,
      time: DEFAULT_POST_TIME,
    },
  };
}

export function buildEditFormValues(
  client: NonNullable<Slot["clients"][number]>,
  slotYear: number,
  slotMonth: number,
  date: number,
): PostFormValues {
  return {
    clientId: client.id,
    clientName: client.name,
    postTitle: client.postTitle ?? "",
    socials: client.socials ?? [],
    postLinks: (client.postLinks as Record<string, string>) ?? {},
    toBePostedOn:
      toPostDateTimeValue(client.scheduledDate, client.scheduledTime) ?? {
        year: slotYear,
        month: slotMonth,
        day: date,
        time: normalizePostTime(client.scheduledTime),
      },
    postedOn: toPostDateTimeValue(client.postedDate, client.postedTime),
    clientStatus: client.status,
  };
}

export function validatePostForm(values: PostFormValues): string | null {
  const scheduled = toRepositoryDateTime(values.toBePostedOn);
  const posted = toRepositoryDateTime(values.postedOn);
  const hasPostedInput = Boolean(
    values.postedOn &&
      (values.postedOn.time.trim() ||
        values.postedOn.day ||
        values.postedOn.month ||
        values.postedOn.year),
  );

  if (!values.clientName.trim()) {
    return "Client is required.";
  }

  if (!scheduled) {
    return "To be posted on requires both date and time.";
  }

  if (hasPostedInput && !posted) {
    return "Posted on requires both date and time, or leave both empty.";
  }

  return null;
}

export function postFormToPayload(values: PostFormValues) {
  const scheduled = toRepositoryDateTime(values.toBePostedOn)!;
  const posted = toRepositoryDateTime(values.postedOn);

  return {
    clientName: values.clientName.trim(),
    postTitle: values.postTitle.trim() || null,
    socials: values.socials.length > 0 ? values.socials : null,
    postLinks: values.postLinks,
    scheduled,
    posted,
    status: values.clientStatus,
  };
}

export type { ActiveSlot } from "@/features/posts-management/types/types";
