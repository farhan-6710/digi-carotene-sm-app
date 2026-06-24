import { useMemo } from "react";

import { AnalyticsDateFilters } from "@/features/analytics/components/AnalyticsDateFilters";
import { AnalyticsTabNav } from "@/features/analytics/components/AnalyticsTabNav";
import { AnalyticsTabPanel } from "@/features/analytics/components/AnalyticsTabPanel";
import { useAnalyticsData } from "@/features/analytics/hooks/useAnalyticsData";
import { useAnalyticsFilters } from "@/features/analytics/hooks/useAnalyticsFilters";
import { useAnalyticsTab } from "@/features/analytics/hooks/useAnalyticsTab";
import { filterPostsByAnalyticsFilter } from "@/features/analytics/utils/analyticsFilterUtils";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";

export function AnalyticsPage() {
  const { activeTab, setActiveTab } = useAnalyticsTab();
  const { data, isLoading, error } = useAnalyticsData();
  const filters = useAnalyticsFilters();

  const filteredPosts = useMemo(
    () => filterPostsByAnalyticsFilter(data.posts, filters.filter),
    [data.posts, filters.filter],
  );

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Analytics"
        description="Explore posts, clients, team members, and agency-wide publishing performance."
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <AnalyticsTabNav activeTab={activeTab} onTabChange={setActiveTab} />
        <AnalyticsDateFilters
          quickPeriods={filters.quickPeriods}
          activeQuickPeriod={filters.activeQuickPeriod}
          isDateRangeActive={filters.isDateRangeActive}
          periodLabel={filters.periodLabel}
          rangeButtonLabel={filters.rangeButtonLabel}
          pickerRange={filters.pickerRange}
          isPickerOpen={filters.isPickerOpen}
          pickerError={filters.pickerError}
          onToggleQuickPeriod={filters.toggleQuickPeriod}
          onClearFilters={filters.clearFilters}
          onClearDateRange={filters.clearDateRange}
          onApplyDateRange={filters.applyDateRange}
          onPickerRangeChange={filters.handlePickerRangeChange}
          onPickerOpenChange={filters.handlePickerOpenChange}
          onPickerKeyDown={filters.handlePickerKeyDown}
        />
      </div>

      <AnalyticsTabPanel
        activeTab={activeTab}
        data={data}
        filteredPosts={filteredPosts}
        filter={filters.filter}
        periodLabel={filters.periodLabel}
        isLoading={isLoading}
      />
    </section>
  );
}
