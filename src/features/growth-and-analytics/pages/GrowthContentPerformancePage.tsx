import { GrowthAccountComboBox } from "../components/GrowthAccountComboBox";
import { GrowthBarChart } from "../components/charts/GrowthBarChart";
import { GrowthDonutChart } from "../components/charts/GrowthDonutChart";
import { ContentPostsTable } from "../components/tables/ContentPostsTable";
import { useGrowthContentPerformance } from "../hooks/useGrowthContentPerformance";
import { generateGrowthReport } from "../utils/generateReport";
import { DateFilters } from "@/shared/components/DateFilters";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { Button } from "@/shared/ui/button";

export function GrowthContentPerformancePage() {
  const {
    accountOptions,
    accountId,
    setAccountId,
    statCards,
    typeSplit,
    engagementByType,
    postRows,
    isLoading,
    dateFilterProps,
    periodLabel,
  } = useGrowthContentPerformance();

  return (
    <PageContent>
      <PageHeader
        heading="Content Performance"
        description="Break down how individual posts perform across formats and engagement."
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
        label="Account"
        value={accountId}
        options={accountOptions}
        onChange={setAccountId}
        placeholder="Select account"
      />

      <StatsCards cards={statCards} isLoading={isLoading} />

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
    </PageContent>
  );
}
