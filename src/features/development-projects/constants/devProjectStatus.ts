export const DEV_PROJECT_STATUSES = [
  "active",
  "inactive",
  "completed",
] as const;

export type DevProjectStatus = (typeof DEV_PROJECT_STATUSES)[number];

export const DEV_PROJECT_STATUS_LABELS: Record<DevProjectStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  completed: "Completed",
};

export const DEV_PROJECT_STATUS_OPTIONS = DEV_PROJECT_STATUSES.map((status) => ({
  value: status,
  label: DEV_PROJECT_STATUS_LABELS[status],
}));

export const DEV_PROJECT_STATUS_FILTERS = [
  "all",
  "active",
  "inactive",
  "completed",
] as const;

export type DevProjectStatusFilterId =
  (typeof DEV_PROJECT_STATUS_FILTERS)[number];

export const DEV_PROJECT_STATUS_FILTER_OPTIONS =
  DEV_PROJECT_STATUS_FILTERS.map((filter) => ({
    value: filter,
    label:
      filter === "all"
        ? "All projects"
        : DEV_PROJECT_STATUS_LABELS[filter],
  }));
