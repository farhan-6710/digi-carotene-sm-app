import type { ReactNode } from "react";

import type {
  AdAccount,
  AdAccountForm,
  AdAccountKind,
  CampaignDemographicMetric,
  CampaignDemographicTableView,
  CampaignRow,
  DemographicBreakdown,
  CategoryDatum,
  ContentPostRow,
  DailyMetricRow,
  LabeledValue,
  GrowthPlatform,
  GrowthPostDetailView,
  GrowthCampaignDetailView,
  GrowthAdsetDetailView,
  GrowthAdDetailView,
  OrganicAccount,
  OrganicAccountForm,
  ReportRow,
  ReportType,
  SpendPoint,
  SpendTrendGranularity,
} from "./types";

export type GrowthChartCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
  children: ReactNode;
};

export type GrowthPostsDataChartProps = {
  title: string;
  description?: string;
  rows: DailyMetricRow[];
};

export type GrowthBarChartProps = {
  title: string;
  description?: string;
  data: LabeledValue[];
  color?: string;
  emptyMessage?: string;
};

export type GrowthDonutChartProps = {
  title: string;
  description?: string;
  data: CategoryDatum[];
  centerLabel?: string;
};

export type GrowthSpendChartProps = {
  title: string;
  description?: string;
  data: SpendPoint[];
  granularity: SpendTrendGranularity;
};

export type ContentPostsTableProps = {
  rows: ContentPostRow[];
  /** Facebook live rows use reactions/comments/shares instead of reach/saves. */
  variant?: "instagram" | "facebook";
};

export type GrowthPostProfileCardProps = {
  view: GrowthPostDetailView;
};

export type CampaignTableProps = {
  rows: CampaignRow[];
  adAccountId?: string;
  platform?: AdAccountKind;
};

export type GrowthCampaignProfileCardProps = {
  view: GrowthCampaignDetailView;
  adAccountId?: string;
  platform?: AdAccountKind;
  periodLabel?: string;
  breakdowns: DemographicBreakdown[];
  onBreakdownsChange: (breakdowns: DemographicBreakdown[]) => void;
  demographicView: CampaignDemographicTableView;
  isDemographicLoading: boolean;
};

export type GoogleCampaignTypePageProps = {
  view: GrowthCampaignDetailView;
  adAccountId?: string;
  periodLabel?: string;
};

export type CampaignDailyMetricsTableProps = {
  rows: GrowthCampaignDetailView["dailyRows"];
  currencyCode: string;
  breakdowns: DemographicBreakdown[];
  onBreakdownsChange: (breakdowns: DemographicBreakdown[]) => void;
  demographicView: CampaignDemographicTableView;
  isDemographicLoading: boolean;
  /** Meta-only age/gender/placement breakdown controls. */
  showDemographicBreakdown?: boolean;
};

export type CampaignMetricCellsMetric = CampaignDemographicMetric;

export type DailyMetricsBreakdownSelectProps = {
  value: DemographicBreakdown[];
  onChange: (breakdowns: DemographicBreakdown[]) => void;
  emptyLabel?: string;
};

export type AdsetsTableProps = {
  rows: GrowthCampaignDetailView["adsetRows"];
  campaignId: string;
  adAccountId?: string;
  currencyCode: string;
  platform?: AdAccountKind;
  /** Override default Ad set / Ad group copy (e.g. Asset groups for PMax). */
  entityLabel?: { plural: string; singular: string };
};

export type AdsTableProps = {
  rows: GrowthAdsetDetailView["adRows"];
  campaignId: string;
  adsetId: string;
  adAccountId?: string;
  currencyCode: string;
  platform?: AdAccountKind;
  breakdowns: DemographicBreakdown[];
  onBreakdownsChange: (breakdowns: DemographicBreakdown[]) => void;
  demographicView: CampaignDemographicTableView;
  isDemographicLoading: boolean;
  showDemographicBreakdown?: boolean;
};

export type GrowthAdsetProfileCardProps = {
  view: GrowthAdsetDetailView;
  adAccountId?: string;
  platform?: AdAccountKind;
  periodLabel?: string;
  breakdowns: DemographicBreakdown[];
  onBreakdownsChange: (breakdowns: DemographicBreakdown[]) => void;
  demographicView: CampaignDemographicTableView;
  isDemographicLoading: boolean;
};

export type GrowthAdProfileCardProps = {
  view: GrowthAdDetailView;
  platform?: AdAccountKind;
  periodLabel?: string;
  breakdowns: DemographicBreakdown[];
  onBreakdownsChange: (breakdowns: DemographicBreakdown[]) => void;
  demographicView: CampaignDemographicTableView;
  isDemographicLoading: boolean;
};

export type AdDailyMetricsTableProps = {
  rows: GrowthAdDetailView["dailyRows"];
  currencyCode: string;
  breakdowns: DemographicBreakdown[];
  onBreakdownsChange: (breakdowns: DemographicBreakdown[]) => void;
  demographicView: CampaignDemographicTableView;
  isDemographicLoading: boolean;
  showDemographicBreakdown?: boolean;
};

export type ReportsTableProps = {
  rows: ReportRow[];
  isLoading?: boolean;
};

export type GrowthReportTabsProps = {
  activeType: ReportType | "all";
  onTypeChange: (type: ReportType | "all") => void;
};

export type GrowthOrganicPlatformToggleProps = {
  value: GrowthPlatform;
  onChange: (platform: GrowthPlatform) => void;
  availablePlatforms: GrowthPlatform[];
  className?: string;
};

export type GrowthAdsPlatformToggleProps = {
  value: AdAccountKind;
  onChange: (platform: AdAccountKind) => void;
  /** When omitted, both Meta and Google stay enabled (connect modal). */
  availablePlatforms?: AdAccountKind[];
  disableUnavailable?: boolean;
  className?: string;
};

export type OrganicAccountsListProps = {
  accounts: OrganicAccount[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (account: OrganicAccount) => void;
};

export type AdAccountsListProps = {
  accounts: AdAccount[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (account: AdAccount) => void;
};

export type OrganicAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: OrganicAccountForm;
  onFieldChange: <Field extends keyof OrganicAccountForm>(
    field: Field,
    value: OrganicAccountForm[Field],
  ) => void;
  onSave: () => void;
  onDelete?: () => void;
};

export type AdAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: AdAccountForm;
  onFieldChange: <Field extends keyof AdAccountForm>(
    field: Field,
    value: AdAccountForm[Field],
  ) => void;
  onSave: () => void;
  onDelete?: () => void;
};

