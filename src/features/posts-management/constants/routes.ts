import {
  parseUrlDateParam,
  serializeUrlDate,
} from "@/shared/utils/urlDateParams";

import {
  POSTS_DATE_PARAM,
  POSTS_FROM_DAY,
  POSTS_FROM_PARAM,
  POSTS_PROJECT_NAME_PARAM,
  POSTS_PROJECT_PARAM,
} from "../utils/postsManagementUrlParams";

export const POSTS_MANAGEMENT_PATH = "/team-portal/posts-management";
export const POSTS_ADD_PATH = `${POSTS_MANAGEMENT_PATH}/add-post`;
export const POSTS_DAY_PATH = `${POSTS_MANAGEMENT_PATH}/day`;

export type AddPostsPathOptions = {
  date?: Date;
  projectId?: string;
  projectName?: string;
  /** When true, Add Posts back/save returns to this day's page. */
  returnToDay?: boolean;
};

export function buildPostsDayPath(
  date: Date,
  searchParams?: URLSearchParams,
): string {
  const base = `${POSTS_DAY_PATH}/${serializeUrlDate(date)}`;
  const query = searchParams?.toString();
  return query ? `${base}?${query}` : base;
}

export function buildPostsManagementPath(
  date?: Date,
  searchParams?: URLSearchParams,
): string {
  const params = new URLSearchParams(searchParams);

  if (date) {
    params.set(POSTS_DATE_PARAM, serializeUrlDate(date));
  }

  const query = params.toString();
  return query
    ? `${POSTS_MANAGEMENT_PATH}?${query}`
    : POSTS_MANAGEMENT_PATH;
}

export function buildAddPostsPath(options?: AddPostsPathOptions): string {
  const params = new URLSearchParams();

  if (options?.date) {
    params.set(POSTS_DATE_PARAM, serializeUrlDate(options.date));
  }

  if (options?.projectId) {
    params.set(POSTS_PROJECT_PARAM, options.projectId);
  }

  if (options?.projectName) {
    params.set(POSTS_PROJECT_NAME_PARAM, options.projectName);
  }

  if (options?.returnToDay) {
    params.set(POSTS_FROM_PARAM, POSTS_FROM_DAY);
  }

  const query = params.toString();
  return query ? `${POSTS_ADD_PATH}?${query}` : POSTS_ADD_PATH;
}

export function parsePostsDayDateParam(
  dateParam: string | undefined,
): Date | null {
  return parseUrlDateParam(dateParam ?? null) ?? null;
}

export function parseAddPostPrefillDate(
  searchParams: URLSearchParams,
): Date | null {
  return parseUrlDateParam(searchParams.get(POSTS_DATE_PARAM)) ?? null;
}

export function parseAddPostReturnToDay(
  searchParams: URLSearchParams,
): boolean {
  return searchParams.get(POSTS_FROM_PARAM) === POSTS_FROM_DAY;
}

export function parseAddPostPrefillProject(
  searchParams: URLSearchParams,
): { projectId: string; projectName: string } | null {
  const projectId = searchParams.get(POSTS_PROJECT_PARAM)?.trim();
  if (!projectId) {
    return null;
  }

  return {
    projectId,
    projectName: searchParams.get(POSTS_PROJECT_NAME_PARAM)?.trim() ?? "",
  };
}
