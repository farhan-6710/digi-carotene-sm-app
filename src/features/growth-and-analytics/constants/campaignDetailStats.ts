import type { GrowthCampaignDetailView } from "../types/types";

type GrowthCampaignDetailStatItem = {
  label: string;
  getValue: (view: GrowthCampaignDetailView) => number;
  valueClassName?: string;
  format?: "currency" | "percent" | "compact";
};

export const growthCampaignDetailStatItems: GrowthCampaignDetailStatItem[] = [
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
