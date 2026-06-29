export type GrowthPlatform = "instagram" | "facebook";

// `from`/`to` are `yyyy-MM-dd`; omit both for "all time".
export type GrowthDateRange = { from?: string; to?: string };

export type MetaOrganicInfo = {
  accountName: string;
  followers: number;
  profilePicture: string | null;
};

export type MetaAdInfo = {
  accountName: string;
  currency: string;
};

// Raw rows returned by the analytics service before aggregation.
export type DailyMetricRow = {
  accountId: string;
  accountName: string;
  platform: GrowthPlatform;
  date: string;
  followers: number;
  newFollowers: number;
  reach: number;
  impressions: number;
  engagement: number;
};

export type PostRow = {
  id: string;
  caption: string;
  mediaType: ContentPostRow["mediaType"];
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  engagementRate: number;
  postedAt: string;
};

export type CampaignMetricRow = {
  campaignName: string;
  status: CampaignRow["status"];
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  date: string;
};

export type TrendPoint = {
  label: string;
  followers: number;
  reach: number;
  engagement: number;
};

export type CategoryDatum = {
  key: string;
  label: string;
  value: number;
  color: string;
};

export type LabeledValue = {
  label: string;
  value: number;
};

export type SpendPoint = {
  label: string;
  spend: number;
  conversions: number;
};

export type TopAccountRow = {
  id: string;
  name: string;
  platform: GrowthPlatform;
  followers: number;
  engagementRate: number;
  reach: number;
};

export type ContentPostRow = {
  id: string;
  caption: string;
  mediaType: "Reel" | "Image" | "Carousel" | "Story";
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  engagementRate: number;
};

export type CampaignRow = {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Completed";
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
};

export type ReportType =
  | "instagram"
  | "facebook"
  | "campaigns"
  | "content_performance";

export type ReportRow = {
  id: string;
  title: string;
  type: ReportType;
  platform: GrowthPlatform | "campaigns";
  periodStart: string;
  periodEnd: string;
  createdAt: string;
};

export type OrganicAccount = {
  id: string;
  platform: GrowthPlatform;
  accountName: string;
  accountId: string;
  followers: number;
  isActive: boolean;
};

export type AdAccount = {
  id: string;
  clientName: string;
  accountName: string;
  adAccountId: string;
  currency: string;
};

export type OrganicAccountForm = {
  platform: GrowthPlatform;
  accountName: string;
  accountId: string;
  accessToken: string;
};

export type AdAccountForm = {
  clientName: string;
  accountName: string;
  adAccountId: string;
  accessToken: string;
  currency: string;
};
