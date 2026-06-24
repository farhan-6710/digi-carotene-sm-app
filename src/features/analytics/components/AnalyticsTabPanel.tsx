import type { AnalyticsTabId } from "@/features/analytics/constants/analyticsTabs";
import { AgencyAnalyticsPanel } from "@/features/analytics/components/AgencyAnalyticsPanel";
import { ClientsAnalyticsPanel } from "@/features/analytics/components/ClientsAnalyticsPanel";
import { EmployeesAnalyticsPanel } from "@/features/analytics/components/EmployeesAnalyticsPanel";
import { PostsAnalyticsPanel } from "@/features/analytics/components/PostsAnalyticsPanel";
import type {
  AnalyticsPanelProps,
  AnalyticsTabPanelProps,
} from "@/features/analytics/types/components";

function renderAnalyticsPanel(tab: AnalyticsTabId, panelProps: AnalyticsPanelProps) {
  switch (tab) {
    case "clients":
      return <ClientsAnalyticsPanel {...panelProps} />;
    case "employees":
      return <EmployeesAnalyticsPanel {...panelProps} />;
    case "agency":
      return <AgencyAnalyticsPanel {...panelProps} />;
    case "posts":
    default:
      return <PostsAnalyticsPanel {...panelProps} />;
  }
}

export function AnalyticsTabPanel({
  activeTab,
  data,
  filteredPosts,
  filter,
  periodLabel,
  isLoading,
}: AnalyticsTabPanelProps) {
  return renderAnalyticsPanel(activeTab, {
    data,
    filteredPosts,
    filter,
    periodLabel,
    isLoading,
  });
}
