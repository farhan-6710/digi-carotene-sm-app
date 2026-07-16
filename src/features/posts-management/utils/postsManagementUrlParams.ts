import {
  parseUrlDateParam,
  serializeUrlDate,
} from "@/shared/utils/urlDateParams";

export const POSTS_DATE_PARAM = "date";
export const POSTS_PROJECT_PARAM = "project";
export const POSTS_PROJECT_NAME_PARAM = "projectName";

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
