import {
  DEFAULT_POST_STATUS,
  DEFAULT_POST_TYPE,
} from "@/features/posts-management/constants/postsManagement";
import { DEFAULT_POST_TIME } from "@/features/posts-management/constants/postSchedule";
import type {
  PostDateTimeValue,
  PostType,
  Slot,
  StatusKey,
} from "@/features/posts-management/types/types";
import {
  toPostDateTimeValue,
  toRepositoryDateTime,
  normalizePostTime,
} from "@/features/posts-management/utils/postScheduleUtils";

export type PostFormValues = {
  projectId: string;
  projectName: string;
  postTitle: string;
  postType: PostType;
  socials: string[];
  postLinks: Record<string, string>;
  toBePostedOn: PostDateTimeValue | null;
  postedOn: PostDateTimeValue | null;
  clientStatus: StatusKey;
};

/** One draft day on the Add Post page (full form values per day). */
export type PostDraftDay = {
  id: string;
  values: PostFormValues;
};

export const emptyPostFormValues = (): PostFormValues => ({
  projectId: "",
  projectName: "",
  postTitle: "",
  postType: DEFAULT_POST_TYPE,
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

function getSlotProjectLabel(client: NonNullable<Slot["clients"][number]>): string {
  return client.clientName
    ? `${client.name} (${client.clientName})`
    : client.name;
}

export function buildEditFormValues(
  client: NonNullable<Slot["clients"][number]>,
  slotYear: number,
  slotMonth: number,
  date: number,
): PostFormValues {
  return {
    projectId: client.projectId,
    projectName: getSlotProjectLabel(client),
    postTitle: client.postTitle ?? "",
    postType: client.postType,
    socials: client.socials ?? [],
    postLinks: (client.postLinks as Record<string, string>) ?? {},
    toBePostedOn:
      toPostDateTimeValue(client.toBePostedDate, client.toBePostedTime) ?? {
        year: slotYear,
        month: slotMonth,
        day: date,
        time: normalizePostTime(client.toBePostedTime),
      },
    postedOn: toPostDateTimeValue(client.postedDate, client.postedTime),
    clientStatus: client.status,
  };
}

export function validatePostForm(values: PostFormValues): string | null {
  const toBePostedOn = toRepositoryDateTime(values.toBePostedOn);
  const posted =
    values.clientStatus === "Posted"
      ? toRepositoryDateTime(values.postedOn)
      : null;
  const hasPostedInput = Boolean(
    values.clientStatus === "Posted" &&
      values.postedOn &&
      (values.postedOn.time.trim() ||
        values.postedOn.day ||
        values.postedOn.month ||
        values.postedOn.year),
  );

  if (!values.projectId.trim()) {
    return "Project is required.";
  }

  if (!toBePostedOn) {
    return "To be posted on requires both date and time.";
  }

  if (hasPostedInput && !posted) {
    return "Posted on requires both date and time, or leave both empty.";
  }

  return null;
}

export function postFormToPayload(values: PostFormValues) {
  const toBePostedOn = toRepositoryDateTime(values.toBePostedOn)!;
  const posted =
    values.clientStatus === "Posted"
      ? toRepositoryDateTime(values.postedOn)
      : null;

  return {
    projectId: values.projectId.trim(),
    postTitle: values.postTitle.trim() || null,
    postType: values.postType,
    socials: values.socials.length > 0 ? values.socials : null,
    postLinks: values.postLinks,
    toBePostedOn,
    posted,
    status: values.clientStatus,
  };
}

export function createDraftDayId(): string {
  return `day-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDraftDay(values: PostFormValues): PostDraftDay {
  return {
    id: createDraftDayId(),
    values,
  };
}

export type { ActiveSlot } from "@/features/posts-management/types/types";
