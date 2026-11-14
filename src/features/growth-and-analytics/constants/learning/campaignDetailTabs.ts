import type { AdAccountKind } from "../../types/types";

/** Campaign detail tabs from PDF §3 / §8B (order matters). */
export type CampaignDetailTabId =
  | "overview"
  | "learning"
  | "changes"
  | "alerts"
  | "structure"
  | "settings";

/** Placeholder-only tabs until Changes / Alerts / Structure / Settings ship. */
export type CampaignPlaceholderTabId = Exclude<
  CampaignDetailTabId,
  "overview" | "learning"
>;

export const CAMPAIGN_PLACEHOLDER_TAB_IDS = [
  "changes",
  "alerts",
  "structure",
  "settings",
] as const satisfies readonly CampaignPlaceholderTabId[];

const PLACEHOLDER_COPY: Record<
  CampaignPlaceholderTabId,
  { title: string; description: string }
> = {
  changes: {
    title: "Changes tab coming soon",
    description:
      "Every Meta activity-log or Google change_event for this campaign, with reason and impact. Spec §8.3.",
  },
  alerts: {
    title: "Alerts tab coming soon",
    description:
      "Benchmark-gap and hard-rule alerts for this campaign, with acknowledge and resolve. Spec §8B.3.",
  },
  structure: {
    title: "Structure tab coming soon",
    description:
      "Drill-down below the campaign: Meta ad sets and ads, or Google ad groups, ads, and keywords. Spec §8B.2.",
  },
  settings: {
    title: "Settings tab coming soon",
    description:
      "How this campaign is judged and who owns it — measurement, benchmark defaults, and team. Spec §8B.4.",
  },
};

export function campaignStructureTabLabel(platform: AdAccountKind): string {
  return platform === "google_ads" ? "Ad groups" : "Ad sets";
}

export function campaignPlaceholderCopy(tab: CampaignPlaceholderTabId) {
  return PLACEHOLDER_COPY[tab];
}

export function resolveCampaignPlaceholderTab(
  pathname: string,
): CampaignPlaceholderTabId | null {
  const segment = pathname.split("/").filter(Boolean).at(-1);
  if (
    segment === "changes" ||
    segment === "alerts" ||
    segment === "structure" ||
    segment === "settings"
  ) {
    return segment;
  }
  return null;
}
