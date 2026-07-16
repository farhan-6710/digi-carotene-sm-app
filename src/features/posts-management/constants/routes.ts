import {
  parseUrlDateParam,
  serializeUrlDate,
} from "@/shared/utils/urlDateParams";

import { POSTS_DATE_PARAM } from "../utils/postsManagementUrlParams";

export const POSTS_MANAGEMENT_PATH = "/team-portal/posts-management";
export const POSTS_ADD_PATH = `${POSTS_MANAGEMENT_PATH}/add-post`;

export function buildAddPostsPath(date?: Date): string {
  if (!date) {
    return POSTS_ADD_PATH;
  }

  return `${POSTS_ADD_PATH}?${POSTS_DATE_PARAM}=${serializeUrlDate(date)}`;
}

export function parseAddPostPrefillDate(
  searchParams: URLSearchParams,
): Date | null {
  return parseUrlDateParam(searchParams.get(POSTS_DATE_PARAM)) ?? null;
}
