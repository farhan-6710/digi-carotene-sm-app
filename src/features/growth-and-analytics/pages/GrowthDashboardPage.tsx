import { GrowthDonutChart } from "../components/charts/GrowthDonutChart";
import { GrowthPostsDataChart } from "../components/charts/GrowthPostsDataChart";
import { GrowthNoAccountsEmpty } from "../components/accounts/GrowthNoAccountsEmpty";
import { GrowthOrganicAccountSelect } from "../components/accounts/GrowthOrganicAccountSelect";
import { GrowthPlatformComingSoon } from "../components/accounts/GrowthPlatformComingSoon";
import { GrowthRefetchModal } from "../components/shared/GrowthRefetchModal";
import { GrowthStaleDataBanner } from "../components/shared/GrowthStaleDataBanner";
import { getOrganicDashboardMode } from "../constants/shared/growthPlatformConfig";
import { useAccountRefetch } from "../hooks/shared/useAccountRefetch";
import { useGrowthDashboard } from "../hooks/dashboard/useGrowthDashboard";
import { useGrowthSelectedAccount } from "../hooks/shared/useGrowthSelectedAccount";
import { isSyncStale } from "../utils/shared/isSyncStale";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { Button } from "@/shared/ui/button";

export function GrowthDashboardPage() {
  const {
    statCards,
    postsDataRows,
    contentTypeSplit,
    isFacebook,
    isLoading,
    error,
    dateFilterProps,
    hasAccounts,
  } = useGrowthDashboard();
  const { activeAccount } = useGrowthSelectedAccount();
  const { refetchOrganic, modalProps } = useAccountRefetch();
  const dashboardMode = getOrganicDashboardMode(activeAccount?.platform);
  const showNoAccounts = !hasAccounts && !isLoading;
  const showComingSoon = hasAccounts && dashboardMode === "coming_soon";
  const showLiveDashboard = hasAccounts && dashboardMode === "live";
  const canRefetch =
    showLiveDashboard && activeAccount?.platform === "instagram";

  return (
    <PageContent>
      <PageHeader
        heading="Dashboard"
        description={
          isFacebook
            ? "Page followers, media views, and engagements for the selected Facebook Page."
            : "Audience growth, reach, and interactions for the selected account."
        }
        actions={
          hasAccounts ? (
            <div className="flex w-full flex-col items-stretch gap-2 sm:items-end">
              <GrowthOrganicAccountSelect />
              {showLiveDashboard ? (
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
          surface="dashboard"
        />
      ) : (
        <>
          <StatsCards cards={statCards} isLoading={isLoading} />

          {showLiveDashboard ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <PageContent className="space-y-6 lg:col-span-2">
                <GrowthPostsDataChart
                  title={isFacebook ? "Page Activity" : "Posts Data"}
                  description={
                    isFacebook
                      ? "Daily page media views, engagements, and new follows in the selected range."
                      : "Month-by-month totals for the selected metric across all published posts."
                  }
                  rows={postsDataRows}
                />
              </PageContent>

              <PageContent className="space-y-6 lg:col-span-1">
                <GrowthDonutChart
                  title={isFacebook ? "Published Posts" : "Posts by Content Type"}
                  description={
                    isFacebook
                      ? "Posts published in the selected range."
                      : "Posts published in the selected range."
                  }
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
