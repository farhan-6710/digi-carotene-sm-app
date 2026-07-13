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
export type InteractionTotals = {
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts: number;
  views: number;
};

export type InstagramDbMediaType = "REEL" | "IMAGE" | "CAROUSEL" | "VIDEO";

export type InstagramProfile = {
  id: string;
  instagramId: string;
  username: string;
  followersCount: number;
  organicAccountId: string | null;
};

export type PastPostMetric = {
  id: string;
  accountId: string;
  postId: string;
  caption: string;
  mediaType: InstagramDbMediaType;
  createdAt: string;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts: number;
  postThumbnail: string | null;
};

export type GrowthPostDetailView = {
  post: PastPostMetric;
  accountUsername: string;
  mediaTypeLabel: ContentPostRow["mediaType"];
  engagementRate: number;
  previousPostId: string | null;
  nextPostId: string | null;
};

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
  likes: number;
  comments: number;
  shares: number;
  reposts: number;
  saves: number;
  clicks: number;
};

export type PostRow = {
  id: string;
  caption: string;
  mediaType: ContentPostRow["mediaType"];
  reach: number;
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts: number;
  engagementRate: number;
  postedAt: string;
  postThumbnail: string | null;
};

export type CampaignMetricRow = {
  campaignId: string;
  campaignName: string;
  status: CampaignRow["status"];
  objective: string | null;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
  date: string;
};

export type TrendPoint = {
  label: string;
  value: number;
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
  date: string;
  label: string;
  spend: number;
  conversions: number;
};

export type SpendTrendGranularity = "day" | "month";

export type SpendTrend = {
  points: SpendPoint[];
  granularity: SpendTrendGranularity;
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
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts: number;
  engagementRate: number;
  postThumbnail: string | null;
};

export type CampaignRow = {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Completed";
  objective: string | null;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
};

export type Adset = {
  adsetId: string;
  campaignId: string;
  adsetName: string;
  performanceGoal: string | null;
  locationSummary: string | null;
  ageSummary: string | null;
  customTargetingSummary: string | null;
  detailedTargetingSummary: string | null;
  placementsSummary: string | null;
};

export type AdsetMetricRow = {
  adsetId: string;
  adsetName: string;
  campaignId: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
  date: string;
};

export type AdsetRow = {
  id: string;
  name: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpm: number;
  frequency: number;
  conversions: number;
};

export type Ad = {
  adId: string;
  adsetId: string;
  campaignId: string;
  adName: string;
  thumbnailUrl: string | null;
  primaryText: string | null;
  headline: string | null;
};

export type AdMetricRow = {
  adId: string;
  adName: string;
  adsetId: string;
  campaignId: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
  date: string;
};

export type AdRow = {
  id: string;
  name: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpm: number;
  frequency: number;
  conversions: number;
};

export type DemographicBreakdown = "age" | "gender" | "placement";

export type CampaignDemographicMetric = {
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
};

export type CampaignDemographicRow = {
  id: string;
  age: string | null;
  gender: string | null;
  placement: string | null;
  metrics: CampaignDemographicMetric;
  isAgeSummary: boolean;
};

export type CampaignDemographicTableView = {
  rows: CampaignDemographicRow[];
  total: CampaignDemographicMetric;
};

export type GrowthCampaignDetailView = {
  campaignId: string;
  campaignName: string;
  status: CampaignRow["status"];
  objective: string | null;
  adAccountName: string;
  currencyCode: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  dailyRows: CampaignMetricRow[];
  adsetRows: AdsetRow[];
  previousCampaignId: string | null;
  nextCampaignId: string | null;
};

export type GrowthAdsetDetailView = {
  campaignId: string;
  adsetId: string;
  adsetName: string;
  performanceGoal: string | null;
  locationSummary: string | null;
  ageSummary: string | null;
  customTargetingSummary: string | null;
  detailedTargetingSummary: string | null;
  placementsSummary: string | null;
  adAccountName: string;
  currencyCode: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpm: number;
  frequency: number;
  conversions: number;
  adRows: AdRow[];
  previousAdsetId: string | null;
  nextAdsetId: string | null;
};

export type GrowthAdDetailView = {
  campaignId: string;
  adsetId: string;
  adId: string;
  adName: string;
  thumbnailUrl: string | null;
  primaryText: string | null;
  headline: string | null;
  adAccountName: string;
  currencyCode: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpm: number;
  frequency: number;
  conversions: number;
  dailyRows: AdMetricRow[];
  previousAdId: string | null;
  nextAdId: string | null;
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

export type CreateGrowthReportInput = {
  title: string;
  type: ReportType;
  platform: ReportRow["platform"];
  periodStart: string;
  periodEnd: string;
};

export type ReportableAccount = {
  id: string;
  label: string;
  caption: string;
  kind: "organic" | "ad";
  growthPlatform?: GrowthPlatform;
};

export type OrganicAccount = {
  id: string;
  platform: GrowthPlatform;
  accountName: string;
  accountId: string;
  followers: number;
  isActive: boolean;
  clientId: string | null;
};

export type AdAccount = {
  id: string;
  clientId: string | null;
  clientName: string;
  accountName: string;
  adAccountId: string;
  currencyCode: string;
};

export type Currency = {
  code: string;
  name: string;
  symbol: string;
};

export type OrganicAccountForm = {
  platform: GrowthPlatform;
  accountName: string;
  accountId: string;
  accessToken: string;
  clientId: string;
  // Only used to seed the client selector label when editing.
  clientName: string;
};

export type AdAccountForm = {
  clientId: string;
  // Only used to seed the client selector label when editing.
  clientName: string;
  accountName: string;
  adAccountId: string;
  accessToken: string;
  currencyCode: string;
};
