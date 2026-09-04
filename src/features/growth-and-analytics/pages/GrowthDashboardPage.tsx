import { GrowthDonutChart } from "../components/charts/GrowthDonutChart";
import { GrowthPostsDataChart } from "../components/charts/GrowthPostsDataChart";
import { GrowthOrganicAccountSelect } from "../components/GrowthOrganicAccountSelect";
import { GrowthPlatformComingSoon } from "../components/GrowthPlatformComingSoon";
import { getOrganicDashboardMode } from "../constants/growthPlatformConfig";
import { useGrowthDashboard } from "../hooks/useGrowthDashboard";
import { useGrowthSelectedAccount } from "../hooks/useGrowthSelectedAccount";
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
  const { activeAccount } = useGrowthSelectedAccount();
  const dashboardMode = getOrganicDashboardMode(activeAccount?.platform);
  const showComingSoon = hasAccounts && dashboardMode === "coming_soon";
  const showLiveDashboard = hasAccounts && dashboardMode === "live";

  return (
    <PageContent>
      <PageHeader
        heading="Dashboard Overview"
        description="Audience growth, reach, and interactions for the selected account."
        actions={
          <div className="flex w-full flex-col items-stretch gap-2 sm:items-end">
            <GrowthOrganicAccountSelect />
            {showLiveDashboard || !hasAccounts ? (
              <DateFilters {...dateFilterProps} />
            ) : null}
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      {showComingSoon && activeAccount ? (
        <GrowthPlatformComingSoon
          platform={activeAccount.platform}
          surface="dashboard"
        />
      ) : (
        <>
          <StatsCards cards={statCards} isLoading={isLoading} />

          {showLiveDashboard ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <PageContent className="space-y-6 lg:col-span-2">
                <GrowthPostsDataChart
                  title="Posts Data"
                  description="Month-by-month totals for the selected metric across all published posts."
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
        </>
      )}
    </PageContent>
  );
}
