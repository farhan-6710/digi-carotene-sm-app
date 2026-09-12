import { GrowthSpendChart } from "../components/charts/GrowthSpendChart";
import { GrowthAdAccountSelect } from "../components/GrowthAdAccountSelect";
import { GrowthAdsAnalyticsComingSoon } from "../components/GrowthAdsAnalyticsComingSoon";
import { GrowthNoAccountsEmpty } from "../components/GrowthNoAccountsEmpty";
import { CampaignTable } from "../components/tables/CampaignTable";
import { useGrowthCampaigns } from "../hooks/useGrowthCampaigns";
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
  const showNoAccounts = !hasAccounts && !isLoading;

  return (
    <PageContent>
      <PageHeader
        heading="Campaign Analytics"
        description="Track paid performance — Meta Ads live today; Google Ads reporting next."
        actions={
          hasAccounts ? (
            <div className="flex w-full flex-col items-stretch gap-2 sm:items-end">
              <GrowthAdAccountSelect />
              {analyticsReady ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <DateFiltersTwo {...dateFilterProps} />
                  <Button
                    onClick={() => void generateReport()}
                    disabled={isGeneratingReport}
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

          <CampaignTable rows={campaignRows} adAccountId={adAccountId} />
        </>
      )}
    </PageContent>
  );
}
