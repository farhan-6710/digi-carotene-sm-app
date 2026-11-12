import type { GrowthPostDetailView } from "../types/types";

type GrowthPostDetailStatItem = {
  label: string;
  getValue: (view: GrowthPostDetailView) => number;
  valueClassName?: string;
};

export const growthPostDetailStatItems: GrowthPostDetailStatItem[] = [
  { label: "Reach", getValue: (view) => view.post.reach },
  { label: "Views", getValue: (view) => view.post.impressions },
  { label: "Likes", getValue: (view) => view.post.likes },
  { label: "Comments", getValue: (view) => view.post.comments },
  { label: "Saves", getValue: (view) => view.post.saves },
  { label: "Shares", getValue: (view) => view.post.shares },
  { label: "Reposts", getValue: (view) => view.post.reposts },
  {
    label: "Eng. rate",
    getValue: (view) => view.engagementRate,
    valueClassName: "text-primary",
  },
];
