import { GrowthAccountComboBox } from "../components/GrowthAccountComboBox";
import { GrowthDonutChart } from "../components/charts/GrowthDonutChart";
import { GrowthTrendChart } from "../components/charts/GrowthTrendChart";
import { useGrowthDashboard } from "../hooks/useGrowthDashboard";
import { DateFilters } from "@/shared/components/DateFilters";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";

export function GrowthDashboardPage() {
  const {
    accountOptions,
    accountId,
    setAccountId,
    statCards,
    trend,
    platformSplit,
    isLoading,
    error,
    dateFilterProps,
    hasAccounts,
  } = useGrowthDashboard();

  return (
    <PageContent>
      <PageHeader
        heading="Dashboard Overview"
        description="Audience growth, reach, and engagement for the selected account."
        actions={<DateFilters {...dateFilterProps} />}
      />

      {error ? <ErrorBanner message={error} /> : null}

      <GrowthAccountComboBox
        label="Account"
        value={accountId}
        options={accountOptions}
        onChange={setAccountId}
        placeholder="Select account"
      />

      <StatsCards cards={statCards} isLoading={isLoading} />

      {hasAccounts ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <PageContent className="space-y-6 lg:col-span-2">
            <GrowthTrendChart
              title="Audience Growth & Engagement"
              description="Monthly followers with engagement rate overlay."
              data={trend}
            />
          </PageContent>

          <PageContent className="space-y-6 lg:col-span-1">
            <GrowthDonutChart
              title="Followers by Platform"
              description="Current audience for this account."
              data={platformSplit}
              centerLabel="Followers"
            />
          </PageContent>
        </div>
      ) : null}
    </PageContent>
  );
}
