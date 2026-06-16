import {
  parseUrlDateParam,
  serializeUrlDate,
} from "@/shared/utils/urlDateParams";

export const POSTS_DATE_PARAM = "date";

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
