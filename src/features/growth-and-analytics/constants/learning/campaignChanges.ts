import type {
  CampaignChangeCategory,
  CampaignChangeImpact,
  CampaignChangeVerification,
} from "../../types/types";

export const CHANGE_CATEGORY_LABEL: Record<CampaignChangeCategory, string> = {
  budget: "Budget",
  bidding: "Bidding",
  audience: "Audience",
  keywords: "Keywords",
  creative: "Creative",
  placement: "Placement",
  landing_page: "Landing page",
  tracking: "Tracking",
  status: "Status",
  other: "Other",
};

export const CHANGE_VERIFICATION_LABEL: Record<
  CampaignChangeVerification,
  string
> = {
  needs_reason: "Needs reason",
  verified: "Verified",
  mismatch: "Mismatch",
  not_applied: "Not applied",
  pending: "Pending",
};

export const CHANGE_IMPACT_LABEL: Record<CampaignChangeImpact, string> = {
  measuring: "Measuring",
  improved: "Improved",
  worsened: "Worsened",
  no_clear_effect: "No clear effect",
  inconclusive: "Inconclusive",
  pending: "Pending",
};

export const CHANGE_RANGE_OPTIONS = [
  { value: "60", label: "Last 60 days" },
  { value: "30", label: "Last 30 days" },
  { value: "14", label: "Last 14 days" },
  { value: "7", label: "Last 7 days" },
] as const;

export const CHANGE_TEXTAREA_CLASS =
  "min-h-24 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
