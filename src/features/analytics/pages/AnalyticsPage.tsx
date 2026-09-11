import { useMemo } from "react";

import { AnalyticsTabNav } from "@/features/analytics/components/AnalyticsTabNav";
import { AnalyticsTabPanel } from "@/features/analytics/components/AnalyticsTabPanel";
import { useAnalyticsData } from "@/features/analytics/hooks/useAnalyticsData";
import { useAnalyticsTab } from "@/features/analytics/hooks/useAnalyticsTab";
import { filterPostsByDateRange } from "@/features/analytics/utils/analyticsFilterUtils";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
import { PageContent } from "@/shared/components/PageContent";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { useDateFiltersTwo } from "@/shared/hooks/useDateFiltersTwo";
import { resolveDateFiltersTwoRange } from "@/shared/utils/dateFiltersTwoUtils";

export function AnalyticsPage() {
  const { activeTab, setActiveTab } = useAnalyticsTab();
  const { data, isLoading, error } = useAnalyticsData();
  const { filter, periodLabel, dateFilterProps } = useDateFiltersTwo();

  const filteredPosts = useMemo(() => {
    const range = resolveDateFiltersTwoRange(filter);
    if (!range) {
      return data.posts;
    }
    return filterPostsByDateRange(data.posts, range);
  }, [data.posts, filter]);

  return (
    <PageContent>
      <PageHeader
        heading="Analytics"
        description="Explore posts, clients, team members, and agency-wide publishing performance."
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <AnalyticsTabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <DateFiltersTwo {...dateFilterProps} />
      </div>

      <AnalyticsTabPanel
        activeTab={activeTab}
        data={data}
        filteredPosts={filteredPosts}
        filter={filter}
        periodLabel={periodLabel}
        isLoading={isLoading}
      />
    </PageContent>
  );
}
