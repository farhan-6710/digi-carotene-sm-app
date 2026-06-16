import type { AnalyticsTabId } from "@/features/analytics/constants/analyticsTabs";
import { AgencyAnalyticsPanel } from "@/features/analytics/components/AgencyAnalyticsPanel";
import { ClientsAnalyticsPanel } from "@/features/analytics/components/ClientsAnalyticsPanel";
import { EmployeesAnalyticsPanel } from "@/features/analytics/components/EmployeesAnalyticsPanel";
import { PostsAnalyticsPanel } from "@/features/analytics/components/PostsAnalyticsPanel";
import type { AnalyticsTabPanelProps } from "@/features/analytics/types/components";

function renderAnalyticsPanel(tab: AnalyticsTabId) {
  switch (tab) {
    case "posts":
      return <PostsAnalyticsPanel />;
    case "clients":
      return <ClientsAnalyticsPanel />;
    case "employees":
      return <EmployeesAnalyticsPanel />;
    case "agency":
      return <AgencyAnalyticsPanel />;
    default:
      return <PostsAnalyticsPanel />;
  }
}

export function AnalyticsTabPanel({ activeTab }: AnalyticsTabPanelProps) {
  return renderAnalyticsPanel(activeTab);
}
