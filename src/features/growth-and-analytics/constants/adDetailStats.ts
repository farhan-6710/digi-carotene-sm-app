import type { GrowthAdDetailView } from "../types/types";

type GrowthAdDetailStatItem = {
  label: string;
  getValue: (view: GrowthAdDetailView) => number;
  valueClassName?: string;
  format?: "currency" | "percent" | "compact";
};

export const growthAdDetailStatItems: GrowthAdDetailStatItem[] = [
  {
    label: "Spend",
    getValue: (view) => view.spend,
    format: "currency",
  },
  {
    label: "Impressions",
    getValue: (view) => view.impressions,
    format: "compact",
  },
  {
    label: "Reach",
    getValue: (view) => view.reach,
    format: "compact",
  },
  {
    label: "Clicks",
    getValue: (view) => view.clicks,
    format: "compact",
  },
  {
    label: "CTR",
    getValue: (view) => view.ctr,
    format: "percent",
    valueClassName: "text-primary",
  },
  {
    label: "Conversions",
    getValue: (view) => view.conversions,
    format: "compact",
    valueClassName: "text-primary",
  },
];
