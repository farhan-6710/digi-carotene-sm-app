import { AnalyticsTabNav } from "@/features/analytics/components/AnalyticsTabNav";
import { AnalyticsTabPanel } from "@/features/analytics/components/AnalyticsTabPanel";
import { useAnalyticsTab } from "@/features/analytics/hooks/useAnalyticsTab";
import { PageHeader } from "@/shared/components/PageHeader";

export function AnalyticsPage() {
  const { activeTab, setActiveTab } = useAnalyticsTab();

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Analytics"
        description="Explore posts, clients, team members, and agency-wide performance in one place."
      />

      <AnalyticsTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <AnalyticsTabPanel activeTab={activeTab} />
    </section>
  );
}
