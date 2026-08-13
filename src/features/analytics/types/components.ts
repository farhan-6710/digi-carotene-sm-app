import type { ReactNode } from "react";

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
import type { DateFiltersProps } from "@/shared/types/components";

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

export type PostsTopClientsTableProps = {
  clients: PostsTopClient[];
  isLoading?: boolean;
  dateFilterProps?: DateFiltersProps;
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
