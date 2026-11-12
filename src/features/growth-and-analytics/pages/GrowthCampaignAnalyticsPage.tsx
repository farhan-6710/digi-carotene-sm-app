import { GrowthSpendChart } from "../components/charts/GrowthSpendChart";
import { GrowthAdAccountSelect } from "../components/accounts/GrowthAdAccountSelect";
import { GrowthAdsAnalyticsComingSoon } from "../components/accounts/GrowthAdsAnalyticsComingSoon";
import { GrowthNoAccountsEmpty } from "../components/accounts/GrowthNoAccountsEmpty";
import { GrowthRefetchModal } from "../components/shared/GrowthRefetchModal";
import { GrowthStaleDataBanner } from "../components/shared/GrowthStaleDataBanner";
import { CampaignTable } from "../components/tables/CampaignTable";
import { useAccountRefetch } from "../hooks/shared/useAccountRefetch";
import { useGrowthCampaigns } from "../hooks/campaigns/useGrowthCampaigns";
import { useGrowthSelectedAdAccount } from "../hooks/shared/useGrowthSelectedAdAccount";
import { isSyncStale } from "../utils/shared/isSyncStale";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { Button } from "@/shared/ui/button";

export function GrowthCampaignAnalyticsPage() {
  const {
    statCards,
    spendTrend,
    spendTrendTitle,
    campaignRows,
    adAccountId,
    adsPlatform,
    analyticsReady,
    isLoading,
    error,
    dateFilterProps,
    generateReport,
    isGeneratingReport,
    hasAccounts,
  } = useGrowthCampaigns();
  const { activeAccount } = useGrowthSelectedAdAccount();
  const { refetchAd, modalProps } = useAccountRefetch();
  const showNoAccounts = !hasAccounts && !isLoading;

  return (
    <PageContent>
      <PageHeader
        heading="Campaign Analytics"
        description="Track paid performance across Meta and Google Ads."
        actions={
          hasAccounts ? (
            <div className="flex w-full flex-col items-stretch gap-2 sm:items-end">
              <GrowthAdAccountSelect />
              {analyticsReady ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <DateFiltersTwo {...dateFilterProps} />
                  {activeAccount ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      disabled={modalProps.open}
                      onClick={() => void refetchAd(activeAccount)}
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

      {analyticsReady && activeAccount ? (
        <GrowthStaleDataBanner
          lastSyncedAt={activeAccount.lastSyncedAt}
          isStale={isSyncStale(activeAccount.lastSyncedAt)}
          onRefetch={() => void refetchAd(activeAccount)}
          refetchDisabled={modalProps.open}
        />
      ) : null}

      <GrowthRefetchModal {...modalProps} />

      {error ? <ErrorBanner message={error} /> : null}

      {showNoAccounts ? (
        <GrowthNoAccountsEmpty accountKind="ads" />
      ) : !analyticsReady ? (
        <GrowthAdsAnalyticsComingSoon platform={adsPlatform} />
      ) : (
        <>
          <StatsCards cards={statCards} isLoading={isLoading} />

          <GrowthSpendChart
            title={spendTrendTitle}
            description="Ad spend and conversions across the selected period."
            data={spendTrend.points}
            granularity={spendTrend.granularity}
          />

          <CampaignTable
            rows={campaignRows}
            adAccountId={adAccountId}
            platform={adsPlatform}
          />
        </>
      )}
    </PageContent>
  );
}
