import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";

type ActiveStatusItem = {
  is_active: boolean;
};

export function filterByActiveStatus<T extends ActiveStatusItem>(
  items: T[],
  filter: ActiveStatusFilterId,
): T[] {
  if (filter === "all") {
    return items;
  }

  if (filter === "active") {
    return items.filter((item) => item.is_active);
  }

  return items.filter((item) => !item.is_active);
}
