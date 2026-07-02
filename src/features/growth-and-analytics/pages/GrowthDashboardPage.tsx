import { GrowthDonutChart } from "../components/charts/GrowthDonutChart";
import { GrowthPostsDataChart } from "../components/charts/GrowthPostsDataChart";
import { useGrowthDashboard } from "../hooks/useGrowthDashboard";
import { DateFilters } from "@/shared/components/DateFilters";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";

export function GrowthDashboardPage() {
  const {
    statCards,
    postsDataRows,
    contentTypeSplit,
    isLoading,
    error,
    dateFilterProps,
    hasAccounts,
  } = useGrowthDashboard();

  return (
    <PageContent>
      <PageHeader
        heading="Dashboard Overview"
        description="Audience growth, reach, and interactions for the selected account."
        actions={<DateFilters {...dateFilterProps} />}
      />

      {error ? <ErrorBanner message={error} /> : null}

      <StatsCards cards={statCards} isLoading={isLoading} />

      {hasAccounts ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <PageContent className="space-y-6 lg:col-span-2">
            <GrowthPostsDataChart
              title="Posts Data"
              description="Monthly totals from synced posts for the selected metric."
              rows={postsDataRows}
            />
          </PageContent>

          <PageContent className="space-y-6 lg:col-span-1">
            <GrowthDonutChart
              title="Posts by Content Type"
              description="Posts published in the selected range."
              data={contentTypeSplit}
              centerLabel="Posts"
            />
          </PageContent>
        </div>
      ) : null}
    </PageContent>
  );
}
