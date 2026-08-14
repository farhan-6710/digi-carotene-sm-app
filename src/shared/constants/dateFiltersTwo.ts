export const DATE_FILTERS_TWO_PERIODS = [
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "last_3_months", label: "Last 3 Months" },
] as const;

export type DateFiltersTwoPeriodId =
  (typeof DATE_FILTERS_TWO_PERIODS)[number]["id"];
