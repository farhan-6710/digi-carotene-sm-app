import { GrowthBarChart } from "../components/charts/GrowthBarChart";
import { GrowthDonutChart } from "../components/charts/GrowthDonutChart";
import { GrowthOrganicAccountSelect } from "../components/GrowthOrganicAccountSelect";
import { GrowthPlatformComingSoon } from "../components/GrowthPlatformComingSoon";
import { ContentPostsTable } from "../components/tables/ContentPostsTable";
import { getOrganicDashboardMode } from "../constants/growthPlatformConfig";
import { useGrowthContentPerformance } from "../hooks/useGrowthContentPerformance";
import { useGrowthSelectedAccount } from "../hooks/useGrowthSelectedAccount";
import { DateFilters } from "@/shared/components/DateFilters";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { Button } from "@/shared/ui/button";

export function GrowthContentPerformancePage() {
  const {
    statCards,
    typeSplit,
    engagementByType,
    postRows,
    isLoading,
    error,
    dateFilterProps,
    generateReport,
    isGeneratingReport,
    hasAccounts,
  } = useGrowthContentPerformance();
  const { activeAccount } = useGrowthSelectedAccount();
  const dashboardMode = getOrganicDashboardMode(activeAccount?.platform);
  const showComingSoon = hasAccounts && dashboardMode === "coming_soon";
  const showLiveContent = hasAccounts && dashboardMode === "live";

  return (
    <PageContent>
      <PageHeader
        heading="Content Performance"
        description="Break down how individual posts perform across formats and engagement."
        actions={
          <div className="flex w-full flex-col items-stretch gap-2 sm:items-end">
            <GrowthOrganicAccountSelect />
            {showLiveContent || !hasAccounts ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <DateFilters {...dateFilterProps} />
                <Button
                  onClick={() => void generateReport()}
                  disabled={!showLiveContent || isGeneratingReport}
                  className="rounded-full"
                >
                  {isGeneratingReport ? "Saving..." : "Generate Report"}
                </Button>
              </div>
            ) : null}
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      {showComingSoon && activeAccount ? (
        <GrowthPlatformComingSoon
          platform={activeAccount.platform}
          surface="content"
        />
      ) : (
        <>
          <StatsCards cards={statCards} isLoading={isLoading} />

          {showLiveContent ? (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <GrowthDonutChart
                  title="Posts by Content Type"
                  description="Distribution of published formats."
                  data={typeSplit}
                  centerLabel="Posts"
                />
                <GrowthBarChart
                  title="Avg Engagement by Format"
                  description="Engagement rate (%) by content type."
                  data={engagementByType}
                  color="var(--accent)"
                />
              </div>

              <ContentPostsTable rows={postRows} />
            </>
          ) : null}
        </>
      )}
    </PageContent>
  );
}
