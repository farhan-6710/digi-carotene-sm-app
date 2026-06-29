import type { ReactNode } from "react";

import type {
  AdAccount,
  AdAccountForm,
  CampaignRow,
  CategoryDatum,
  ContentPostRow,
  LabeledValue,
  OrganicAccount,
  OrganicAccountForm,
  ReportRow,
  ReportType,
  SpendPoint,
  TopAccountRow,
  TrendPoint,
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

export type GrowthTrendChartProps = {
  title: string;
  description?: string;
  data: TrendPoint[];
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
};

export type TopAccountsTableProps = {
  rows: TopAccountRow[];
};

export type ContentPostsTableProps = {
  rows: ContentPostRow[];
};

export type CampaignTableProps = {
  rows: CampaignRow[];
};

export type ReportsTableProps = {
  rows: ReportRow[];
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
  onToggleAccount: (id: string) => void;
  onToggleMetric: (id: string) => void;
  onFieldChange: <Field extends "startDate" | "endDate" | "format">(
    field: Field,
    value: string,
  ) => void;
  onGenerate: () => void;
};
