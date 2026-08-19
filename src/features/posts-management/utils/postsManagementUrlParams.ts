import {
  parseUrlDateParam,
  serializeUrlDate,
} from "@/shared/utils/urlDateParams";

export const POSTS_DATE_PARAM = "date";
export const POSTS_PROJECT_PARAM = "project";
export const POSTS_PROJECT_NAME_PARAM = "projectName";
export const POSTS_FROM_PARAM = "from";
export const POSTS_FROM_DAY = "day";
export const POSTS_CLIENTS_PARAM = "clients";
export const POSTS_PROJECTS_PARAM = "projects";

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
