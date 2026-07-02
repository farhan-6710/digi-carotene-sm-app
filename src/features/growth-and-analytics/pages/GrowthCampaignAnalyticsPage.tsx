import { GrowthSpendChart } from "../components/charts/GrowthSpendChart";
import { CampaignTable } from "../components/tables/CampaignTable";
import { useGrowthCampaigns } from "../hooks/useGrowthCampaigns";
import { DateFilters } from "@/shared/components/DateFilters";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { Button } from "@/shared/ui/button";

export function GrowthCampaignAnalyticsPage() {
  const {
    statCards,
    spendTrend,
    campaignRows,
    isLoading,
    error,
    dateFilterProps,
    generateReport,
    isGeneratingReport,
    hasAccounts,
  } = useGrowthCampaigns();

  return (
    <PageContent>
      <PageHeader
        heading="Campaign Analytics"
        description="Track paid performance — spend, impressions, clicks, and conversions from Meta."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <DateFilters {...dateFilterProps} />
            <Button
              onClick={() => void generateReport()}
              disabled={!hasAccounts || isGeneratingReport}
              className="rounded-full"
            >
              {isGeneratingReport ? "Saving..." : "Generate Report"}
            </Button>
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <StatsCards cards={statCards} isLoading={isLoading} />

      <GrowthSpendChart
        title="Weekly Spend vs Conversions"
        description="Ad spend and conversions across the selected period."
        data={spendTrend}
      />

      <CampaignTable rows={campaignRows} />
    </PageContent>
  );
}
