import type {
  DevProjectStatus,
  DevProjectStatusFilterId,
} from "@/features/development-projects/constants/devProjectStatus";

type StatusItem = {
  status: DevProjectStatus;
};

const STATUS_SORT_ORDER: Record<DevProjectStatus, number> = {
  active: 0,
  inactive: 1,
  completed: 2,
};

export function filterByDevProjectStatus<T extends StatusItem>(
  items: T[],
  filter: DevProjectStatusFilterId,
): T[] {
  if (filter === "all") {
    return [...items].sort(
      (a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status],
    );
  }

  return items.filter((item) => item.status === filter);
}
