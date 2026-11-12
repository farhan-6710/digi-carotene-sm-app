import { GrowthBarChart } from "../components/charts/GrowthBarChart";
import { GrowthDonutChart } from "../components/charts/GrowthDonutChart";
import { GrowthNoAccountsEmpty } from "../components/accounts/GrowthNoAccountsEmpty";
import { GrowthOrganicAccountSelect } from "../components/accounts/GrowthOrganicAccountSelect";
import { GrowthPlatformComingSoon } from "../components/accounts/GrowthPlatformComingSoon";
import { GrowthRefetchModal } from "../components/shared/GrowthRefetchModal";
import { GrowthStaleDataBanner } from "../components/shared/GrowthStaleDataBanner";
import { ContentPostsTable } from "../components/tables/ContentPostsTable";
import { getOrganicDashboardMode } from "../constants/shared/growthPlatformConfig";
import { useAccountRefetch } from "../hooks/shared/useAccountRefetch";
import { useGrowthContentPerformance } from "../hooks/content/useGrowthContentPerformance";
import { useGrowthSelectedAccount } from "../hooks/shared/useGrowthSelectedAccount";
import { isSyncStale } from "../utils/shared/isSyncStale";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
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
    isFacebook,
    isLoading,
    error,
    dateFilterProps,
    generateReport,
    isGeneratingReport,
    hasAccounts,
  } = useGrowthContentPerformance();
  const { activeAccount } = useGrowthSelectedAccount();
  const { refetchOrganic, modalProps } = useAccountRefetch();
  const dashboardMode = getOrganicDashboardMode(activeAccount?.platform);
  const showNoAccounts = !hasAccounts && !isLoading;
  const showComingSoon = hasAccounts && dashboardMode === "coming_soon";
  const showLiveContent = hasAccounts && dashboardMode === "live";
  const canRefetch = showLiveContent && activeAccount?.platform === "instagram";

  return (
    <PageContent>
      <PageHeader
        heading="Content Performance"
        description={
          isFacebook
            ? "See how Facebook Page posts perform across reactions, comments, and shares."
            : "Break down how individual posts perform across formats and engagement."
        }
        actions={
          hasAccounts ? (
            <div className="flex w-full flex-col items-stretch gap-2 sm:items-end">
              <GrowthOrganicAccountSelect />
              {showLiveContent ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <DateFiltersTwo {...dateFilterProps} />
                  {canRefetch && activeAccount ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      disabled={modalProps.open}
                      onClick={() => void refetchOrganic(activeAccount)}
                    >
                      Refetch data
                    </Button>
                  ) : null}
                  <Button
                    onClick={() => void generateReport()}
                    disabled={isGeneratingReport || modalProps.open}
                    className="rounded-full"
                  >
                    {isGeneratingReport ? "Saving..." : "Generate Report"}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null
        }
      />

      {canRefetch && activeAccount ? (
        <GrowthStaleDataBanner
          lastSyncedAt={activeAccount.lastSyncedAt}
          isStale={isSyncStale(activeAccount.lastSyncedAt)}
          onRefetch={() => void refetchOrganic(activeAccount)}
          refetchDisabled={modalProps.open}
        />
      ) : null}

      <GrowthRefetchModal
        {...modalProps}
        footnote="Follower history covers about the last 30 days (Meta limit)."
      />

      {error ? <ErrorBanner message={error} /> : null}

      {showNoAccounts ? (
        <GrowthNoAccountsEmpty accountKind="organic" />
      ) : showComingSoon && activeAccount ? (
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
                  title={isFacebook ? "Published Posts" : "Posts by Content Type"}
                  description={
                    isFacebook
                      ? "Posts published in the selected range."
                      : "Distribution of published formats."
                  }
                  data={typeSplit}
                  centerLabel="Posts"
                />
                <GrowthBarChart
                  title={
                    isFacebook
                      ? "Avg Interactions per Post"
                      : "Avg Engagement by Format"
                  }
                  description={
                    isFacebook
                      ? "Average reactions + comments + shares per post."
                      : "Engagement rate (%) by content type."
                  }
                  data={engagementByType}
                  color="var(--accent)"
                />
              </div>

              <ContentPostsTable
                rows={postRows}
                variant={isFacebook ? "facebook" : "instagram"}
              />
            </>
          ) : null}
        </>
      )}
    </PageContent>
  );
}
