import type { StatusKey } from "@/features/posts-management/types/types";

export const POST_STATUS_FILTER_ALL = "All" as const;

export type PostStatusFilterTarget = StatusKey | typeof POST_STATUS_FILTER_ALL;

export type PostStatusFilterState = {
  showAll: boolean;
  statuses: StatusKey[];
};

export function getDefaultPostStatusFilterState(): PostStatusFilterState {
  return { showAll: true, statuses: [] };
}

export function togglePostStatusFilter(
  current: PostStatusFilterState,
  target: PostStatusFilterTarget,
): PostStatusFilterState {
  if (target === POST_STATUS_FILTER_ALL) {
    return getDefaultPostStatusFilterState();
  }

  if (current.showAll) {
    return { showAll: false, statuses: [target] };
  }

  if (current.statuses.includes(target)) {
    const nextStatuses = current.statuses.filter((entry) => entry !== target);
    if (nextStatuses.length === 0) {
      return getDefaultPostStatusFilterState();
    }

    return { showAll: false, statuses: nextStatuses };
  }

  return { showAll: false, statuses: [...current.statuses, target] };
}

export function resolveStatusesForFetch(
  state: PostStatusFilterState,
): StatusKey[] | null {
  if (state.showAll) {
    return null;
  }

  return state.statuses;
}

export function filterPostsByStatus<T extends { status: StatusKey }>(
  items: T[],
  state: PostStatusFilterState,
): T[] {
  if (state.showAll) {
    return items;
  }

  if (state.statuses.length === 0) {
    return [];
  }

  return items.filter((item) => state.statuses.includes(item.status));
}

export function filterPostsByMonth<T extends { to_be_posted_date: string }>(
  items: T[],
  year: number,
  month: number,
): T[] {
  return items.filter((item) => {
    const [itemYear, itemMonth] = item.to_be_posted_date.split("-").map(Number);
    return itemYear === year && itemMonth === month;
  });
}
