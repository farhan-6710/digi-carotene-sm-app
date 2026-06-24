import type { KeyboardEvent, ReactNode } from "react";
import type { DateRange } from "react-day-picker";

import {
  ANALYTICS_QUICK_PERIODS,
  type AnalyticsQuickPeriodId,
} from "@/features/analytics/constants/analyticsFilters";
import type { AnalyticsTabId } from "@/features/analytics/constants/analyticsTabs";
import type {
  AnalyticsDataset,
  AnalyticsDateFilterState,
  CategoryDatum,
  EntityPostBreakdown,
  LabeledValue,
  MonthlyTrendDatum,
  PostsTopClient,
} from "@/features/analytics/types/types";
import type { Post } from "@/features/posts-management/types/types";

export type AnalyticsTabNavProps = {
  activeTab: AnalyticsTabId;
  onTabChange: (tab: AnalyticsTabId) => void;
};

export type AnalyticsTabPanelProps = {
  activeTab: AnalyticsTabId;
  data: AnalyticsDataset;
  filteredPosts: Post[];
  filter: AnalyticsDateFilterState;
  periodLabel: string;
  isLoading: boolean;
};

export type AnalyticsPanelProps = {
  data: AnalyticsDataset;
  filteredPosts: Post[];
  filter: AnalyticsDateFilterState;
  periodLabel: string;
  isLoading: boolean;
};

export type AnalyticsDateFiltersProps = {
  quickPeriods: typeof ANALYTICS_QUICK_PERIODS;
  activeQuickPeriod: AnalyticsQuickPeriodId | null;
  isDateRangeActive: boolean;
  periodLabel: string;
  rangeButtonLabel: string;
  pickerRange: DateRange | undefined;
  isPickerOpen: boolean;
  pickerError: string | null;
  onToggleQuickPeriod: (period: AnalyticsQuickPeriodId) => void;
  onClearFilters: () => void;
  onClearDateRange: () => void;
  onApplyDateRange: () => void;
  onPickerRangeChange: (range: DateRange | undefined) => void;
  onPickerOpenChange: (open: boolean) => void;
  onPickerKeyDown: (event: KeyboardEvent) => void;
};

export type AnalyticsDateRangePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  range: DateRange | undefined;
  rangeLabel: string;
  isActive: boolean;
  onRangeChange: (range: DateRange | undefined) => void;
  onApply: () => void;
  onClear: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  error: string | null;
};

export type PostsTopClientsTableProps = {
  clients: PostsTopClient[];
  isLoading?: boolean;
};

export type ChartCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
  children: ReactNode;
};

export type CategoryDonutChartProps = {
  title: string;
  description?: string;
  data: CategoryDatum[];
  centerLabel?: string;
};

export type HorizontalBarChartProps = {
  title: string;
  description?: string;
  data: LabeledValue[];
  color?: string;
  emptyMessage?: string;
};

export type MonthlyTrendChartProps = {
  title: string;
  description?: string;
  data: MonthlyTrendDatum[];
};

export type AnalyticsBreakdownTableProps = {
  title: string;
  rows: EntityPostBreakdown[];
  isLoading?: boolean;
  emptyMessage?: string;
  nameHeader?: string;
};
