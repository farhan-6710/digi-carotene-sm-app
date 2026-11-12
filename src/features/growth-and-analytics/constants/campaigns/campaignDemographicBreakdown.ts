import type { DemographicBreakdown } from "../types/types";

export const CAMPAIGN_DEMOGRAPHIC_AGE_ORDER = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
] as const;

export const CAMPAIGN_DEMOGRAPHIC_GENDER_ORDER = [
  "male",
  "female",
  "unknown",
] as const;

export const campaignDemographicGenderLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
  unknown: "Uncategorised",
};

// Ads Manager uses "All" as the per-age gender summary row.
export const CAMPAIGN_DEMOGRAPHIC_AGE_SUMMARY_GENDER = "All";

// Readable labels for Meta `platform_position` placement values.
export const campaignPlacementLabels: Record<string, string> = {
  feed: "Feed",
  instagram_reels: "Instagram Reels",
  instagram_stories: "Instagram Stories",
  instagram_explore: "Instagram Explore",
  instagram_explore_home: "Explore home",
  instagram_search: "Instagram Search",
  instagram_profile_feed: "Instagram Profile Feed",
  facebook_reels: "Facebook Reels",
  facebook_stories: "Facebook Stories",
  story: "Stories",
  video_feeds: "Video Feeds",
  right_hand_column: "Right Column",
  marketplace: "Marketplace",
  search: "Search",
  messenger_inbox: "Messenger Inbox",
  an_classic: "Audience Network",
};

// Our breakdown token → Meta insights `breakdowns` param.
export const CAMPAIGN_BREAKDOWN_META_PARAM: Record<DemographicBreakdown, string> = {
  age: "age",
  gender: "gender",
  // Meta requires platform_position to be paired with publisher_platform.
  placement: "publisher_platform,platform_position",
};

// Placement is exclusive: picking it clears age/gender, and vice versa.
export const campaignDemographicBreakdownOptions: Array<{
  value: DemographicBreakdown;
  label: string;
  exclusive?: boolean;
}> = [
  { value: "age", label: "Age" },
  { value: "gender", label: "Gender" },
  { value: "placement", label: "Placement", exclusive: true },
];
