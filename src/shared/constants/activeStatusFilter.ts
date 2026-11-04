export const ACTIVE_STATUS_FILTERS = ["all", "active", "inactive"] as const;

export type ActiveStatusFilterId = (typeof ACTIVE_STATUS_FILTERS)[number];

export const ACTIVE_STATUS_FILTER_LABELS: Record<ActiveStatusFilterId, string> = {
  all: "All clients",
  active: "Active",
  inactive: "Inactive",
};

export const PROJECT_STATUS_FILTER_LABELS: Record<ActiveStatusFilterId, string> = {
  all: "All projects",
  active: "Active",
  inactive: "Inactive",
};

export const ACTIVE_STATUS_FILTER_OPTIONS = ACTIVE_STATUS_FILTERS.map(
  (filter) => ({
    value: filter,
    label: ACTIVE_STATUS_FILTER_LABELS[filter],
  }),
);

export const PROJECT_STATUS_FILTER_OPTIONS = ACTIVE_STATUS_FILTERS.map(
  (filter) => ({
    value: filter,
    label: PROJECT_STATUS_FILTER_LABELS[filter],
  }),
);
