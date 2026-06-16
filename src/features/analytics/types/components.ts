import type { AnalyticsTabId } from "@/features/analytics/constants/analyticsTabs";
import type { PostsTopClient } from "@/features/analytics/types/types";

export type AnalyticsTabNavProps = {
  activeTab: AnalyticsTabId;
  onTabChange: (tab: AnalyticsTabId) => void;
};

export type AnalyticsTabPanelProps = {
  activeTab: AnalyticsTabId;
};

export type PostsTopClientsTableProps = {
  clients: PostsTopClient[];
  isLoading?: boolean;
};
