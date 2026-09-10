import type { DateRange } from "react-day-picker";

import {
  POST_STATUS_SELECT_ALL,
  type PostStatusSelectId,
} from "@/features/posts-management/constants/postStatusSelect";
import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import {
  parseUrlDateParam,
  serializeUrlDate,
} from "@/shared/utils/urlDateParams";

export const POSTS_DATE_PARAM = "date";
export const POSTS_PROJECT_PARAM = "project";
export const POSTS_PROJECT_NAME_PARAM = "projectName";
export const POSTS_FROM_PARAM = "from";
export const POSTS_FROM_DAY = "day";
export const POSTS_FROM_PROJECT = "project";
export const POSTS_CLIENTS_PARAM = "clients";
export const POSTS_PROJECTS_PARAM = "projects";
export const POSTS_STATUS_PARAM = "status";
export const POSTS_LIST_FROM_PARAM = "listFrom";
export const POSTS_LIST_TO_PARAM = "listTo";

export function parsePostsDateFromSearchParams(
  searchParams: URLSearchParams,
): Date | undefined {
  return parseUrlDateParam(searchParams.get(POSTS_DATE_PARAM));
}

export function buildPostsDateSearchParams(
  date: Date,
  existing?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(existing);
  params.set(POSTS_DATE_PARAM, serializeUrlDate(date));
  return params;
}

export function parseFilterIdsParam(
  searchParams: URLSearchParams,
  key: string,
): string[] {
  const raw = searchParams.get(key);
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

export function setFilterIdsParam(
  params: URLSearchParams,
  key: string,
  ids: string[],
): void {
  if (ids.length === 0) {
    params.delete(key);
  } else {
    params.set(key, ids.join(","));
  }
}

export function parsePostsStatusParam(
  searchParams: URLSearchParams,
): PostStatusSelectId {
  const raw = searchParams.get(POSTS_STATUS_PARAM);
  if (!raw || raw === POST_STATUS_SELECT_ALL) {
    return POST_STATUS_SELECT_ALL;
  }
  return statusOptions.includes(raw as (typeof statusOptions)[number])
    ? (raw as PostStatusSelectId)
    : POST_STATUS_SELECT_ALL;
}

export function setPostsStatusParam(
  params: URLSearchParams,
  status: PostStatusSelectId,
): void {
  if (status === POST_STATUS_SELECT_ALL) {
    params.delete(POSTS_STATUS_PARAM);
  } else {
    params.set(POSTS_STATUS_PARAM, status);
  }
}

export function parsePostsListDateRange(
  searchParams: URLSearchParams,
): DateRange | undefined {
  const from = parseUrlDateParam(searchParams.get(POSTS_LIST_FROM_PARAM));
  if (!from) return undefined;
  const to =
    parseUrlDateParam(searchParams.get(POSTS_LIST_TO_PARAM)) ?? from;
  return { from, to };
}

export function setPostsListDateRange(
  params: URLSearchParams,
  range: { from: Date; to: Date } | null,
): void {
  if (!range) {
    params.delete(POSTS_LIST_FROM_PARAM);
    params.delete(POSTS_LIST_TO_PARAM);
    return;
  }
  params.set(POSTS_LIST_FROM_PARAM, serializeUrlDate(range.from));
  params.set(POSTS_LIST_TO_PARAM, serializeUrlDate(range.to));
}
