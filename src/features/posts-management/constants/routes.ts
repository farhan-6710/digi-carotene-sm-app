import {
  parseUrlDateParam,
  serializeUrlDate,
} from "@/shared/utils/urlDateParams";

import {
  POSTS_DATE_PARAM,
  POSTS_PROJECT_NAME_PARAM,
  POSTS_PROJECT_PARAM,
} from "../utils/postsManagementUrlParams";

export const POSTS_MANAGEMENT_PATH = "/team-portal/posts-management";
export const POSTS_ADD_PATH = `${POSTS_MANAGEMENT_PATH}/add-post`;

export type AddPostsPathOptions = {
  date?: Date;
  projectId?: string;
  projectName?: string;
};

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

  const query = params.toString();
  return query ? `${POSTS_ADD_PATH}?${query}` : POSTS_ADD_PATH;
}

export function parseAddPostPrefillDate(
  searchParams: URLSearchParams,
): Date | null {
  return parseUrlDateParam(searchParams.get(POSTS_DATE_PARAM)) ?? null;
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
