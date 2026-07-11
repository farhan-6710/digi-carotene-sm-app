import type { ReactNode } from "react";

import type {
  AdAccount,
  AdAccountForm,
  CampaignRow,
  CategoryDatum,
  ContentPostRow,
  DailyMetricRow,
  LabeledValue,
  GrowthPostDetailView,
  GrowthCampaignDetailView,
  GrowthAdsetDetailView,
  GrowthAdDetailView,
  OrganicAccount,
  OrganicAccountForm,
  ReportableAccount,
  ReportRow,
  ReportType,
  SpendPoint,
  SpendTrendGranularity,
  TopAccountRow,
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

export type TopAccountsTableProps = {
  rows: TopAccountRow[];
};

export type ContentPostsTableProps = {
  rows: ContentPostRow[];
};

export type GrowthPostProfileCardProps = {
  view: GrowthPostDetailView;
};

export type GrowthCampaignProfileCardProps = {
  view: GrowthCampaignDetailView;
  adAccountId?: string;
  periodLabel?: string;
};

export type CampaignDailyMetricsTableProps = {
  rows: GrowthCampaignDetailView["dailyRows"];
  currencyCode: string;
};

export type AdsetsTableProps = {
  rows: GrowthCampaignDetailView["adsetRows"];
  campaignId: string;
  adAccountId?: string;
  currencyCode: string;
};

export type AdsTableProps = {
  rows: GrowthAdsetDetailView["adRows"];
  campaignId: string;
  adsetId: string;
  adAccountId?: string;
  currencyCode: string;
};

export type GrowthAdsetProfileCardProps = {
  view: GrowthAdsetDetailView;
  adAccountId?: string;
  periodLabel?: string;
};

export type GrowthAdProfileCardProps = {
  view: GrowthAdDetailView;
  periodLabel?: string;
};

export type AdDailyMetricsTableProps = {
  rows: GrowthAdDetailView["dailyRows"];
  currencyCode: string;
};

export type CampaignTableProps = {
  rows: CampaignRow[];
  adAccountId?: string;
};

export type ReportsTableProps = {
  rows: ReportRow[];
  isLoading?: boolean;
};

export type GrowthReportTabsProps = {
  activeType: ReportType | "all";
  onTypeChange: (type: ReportType | "all") => void;
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

export type CustomReportFormState = {
  selectedAccountIds: string[];
  selectedMetricIds: string[];
  startDate: string;
  endDate: string;
  format: string;
};

export type CustomReportBuilderFormProps = {
  values: CustomReportFormState;
  accounts: ReportableAccount[];
  isAccountsLoading?: boolean;
  accountsEmpty?: boolean;
  isGenerating?: boolean;
  onToggleAccount: (id: string) => void;
  onToggleMetric: (id: string) => void;
  onFieldChange: <Field extends "startDate" | "endDate" | "format">(
    field: Field,
    value: string,
  ) => void;
  onGenerate: () => void;
};
