import { GrowthBarChart } from "../components/charts/GrowthBarChart";
import { GrowthDonutChart } from "../components/charts/GrowthDonutChart";
import { ContentPostsTable } from "../components/tables/ContentPostsTable";
import { useGrowthContentPerformance } from "../hooks/useGrowthContentPerformance";
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

  return (
    <PageContent>
      <PageHeader
        heading="Content Performance"
        description="Break down how individual posts perform across formats and engagement."
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
