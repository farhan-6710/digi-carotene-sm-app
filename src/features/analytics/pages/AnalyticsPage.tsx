import { AnalyticsTabNav } from "@/features/analytics/components/AnalyticsTabNav";
import { AnalyticsTabPanel } from "@/features/analytics/components/AnalyticsTabPanel";
import { useAnalyticsData } from "@/features/analytics/hooks/useAnalyticsData";
import { useAnalyticsTab } from "@/features/analytics/hooks/useAnalyticsTab";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";

export function AnalyticsPage() {
  const { activeTab, setActiveTab } = useAnalyticsTab();
  const { data, isLoading, error } = useAnalyticsData();

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Analytics"
        description="Explore posts, clients, team members, and agency-wide publishing performance."
      />

      {error ? <ErrorBanner message={error} /> : null}

      <AnalyticsTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <AnalyticsTabPanel activeTab={activeTab} data={data} isLoading={isLoading} />
    </section>
  );
}
