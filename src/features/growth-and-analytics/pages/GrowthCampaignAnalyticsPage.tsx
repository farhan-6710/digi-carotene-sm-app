import { GrowthAccountComboBox } from "../components/GrowthAccountComboBox";
import { GrowthSpendChart } from "../components/charts/GrowthSpendChart";
import { CampaignTable } from "../components/tables/CampaignTable";
import { useGrowthCampaigns } from "../hooks/useGrowthCampaigns";
import { generateGrowthReport } from "../utils/generateReport";
import { DateFilters } from "@/shared/components/DateFilters";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { Button } from "@/shared/ui/button";

export function GrowthCampaignAnalyticsPage() {
  const {
    accountOptions,
    adAccountId,
    setAdAccountId,
    statCards,
    spendTrend,
    campaignRows,
    isLoading,
    dateFilterProps,
    periodLabel,
  } = useGrowthCampaigns();

  return (
    <PageContent>
      <PageHeader
        heading="Campaign Analytics"
        description="Track paid performance — spend, reach, clicks, and conversions."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <DateFilters {...dateFilterProps} />
            <Button
              onClick={() => generateGrowthReport(periodLabel)}
              className="rounded-full"
            >
              Generate Report
            </Button>
          </div>
        }
      />

      <GrowthAccountComboBox
        label="Ad Account"
        value={adAccountId}
        options={accountOptions}
        onChange={setAdAccountId}
        placeholder="Select ad account"
      />

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
