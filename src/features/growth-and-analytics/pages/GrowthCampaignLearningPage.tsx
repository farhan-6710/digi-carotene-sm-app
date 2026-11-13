import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { BenchmarkHistorySheet } from "../components/learning/BenchmarkHistorySheet";
import { CampaignDetailTabs } from "../components/learning/CampaignDetailTabs";
import { LearningBenchmarkStrip } from "../components/learning/LearningBenchmarkStrip";
import { LearningKpiCards } from "../components/learning/LearningKpiCards";
import { LearningPerformanceChart } from "../components/learning/LearningPerformanceChart";
import { LearningStaleDataBanner } from "../components/learning/LearningStaleDataBanner";
import { SetBenchmarkDrawer } from "../components/learning/SetBenchmarkDrawer";
import { GrowthRefetchModal } from "../components/shared/GrowthRefetchModal";
import { GROWTH_AD_ACCOUNT_PARAM } from "../constants/shared/growthUrlParams";
import { useAccountRefetch } from "../hooks/shared/useAccountRefetch";
import { useCampaignLearning } from "../hooks/learning/useCampaignLearning";
import { useGrowthPaths } from "../hooks/shared/useGrowthPaths";
import { useGrowthSelectedAdAccount } from "../hooks/shared/useGrowthSelectedAdAccount";

const RANGE_OPTIONS = [
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days" },
  { days: 30, label: "30 days" },
] as const;

export function GrowthCampaignLearningPage() {
  const { campaignId = "" } = useParams();
  const { accountId, activeAccount } = useGrowthSelectedAdAccount();
  const { campaignAnalyticsPath } = useGrowthPaths();
  const { refetchAd, modalProps } = useAccountRefetch();
  const learning = useCampaignLearning(campaignId);

  const backPath = accountId
    ? `${campaignAnalyticsPath}?${GROWTH_AD_ACCOUNT_PARAM}=${accountId}`
    : campaignAnalyticsPath;

  if (learning.isLoading) {
    return (
      <DetailPageLoading
        backButton={
          <Button asChild variant="outline" className="rounded-full">
            <Link to={backPath}>
              <ArrowLeft className="mr-2 size-4" />
              Back to campaigns
            </Link>
          </Button>
        }
      />
    );
  }

  if (!learning.view) {
    return (
      <section className="space-y-4">
        <PageHeader
          actions={
            <Button asChild variant="outline" className="rounded-full">
              <Link to={backPath}>
                <ArrowLeft className="mr-2 size-4" />
                Back to campaigns
              </Link>
            </Button>
          }
        />
        <ErrorBanner message={learning.error ?? "Campaign not found."} />
      </section>
    );
  }

  const view = learning.view;

  return (
    <PageContent>
      <PageHeader
        heading={view.campaignName}
        description={`${view.clientName} · ${view.platform === "google_ads" ? "Google Ads" : "Meta"} · ${view.status}`}
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link to={backPath}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Link>
          </Button>
        }
      />

      <CampaignDetailTabs
        campaignId={campaignId}
        adAccountId={accountId}
        active="learning"
      />

      <LearningStaleDataBanner
        lastSyncedAt={view.lastSyncedAt}
        isStale={view.isStale}
        onRefetch={
          activeAccount ? () => void refetchAd(activeAccount) : undefined
        }
        refetchDisabled={modalProps.open}
      />

      <GrowthRefetchModal {...modalProps} />

      {learning.error ? <ErrorBanner message={learning.error} /> : null}

      <LearningBenchmarkStrip
        view={view}
        canApprove={learning.canApprove}
        onEdit={() => learning.setDrawerOpen(true)}
        onHistory={() => learning.setHistoryOpen(true)}
        onApprove={learning.approvePending}
        onReject={learning.rejectPending}
        onDismissNewBest={learning.dismissNewBest}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Select a KPI card to change the chart. Range applies to both cards and chart.
        </p>
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <Button
              key={opt.days}
              type="button"
              size="sm"
              variant="outline"
              className={cn(
                "rounded-full",
                learning.rangeDays === opt.days &&
                  "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              )}
              onClick={() => learning.setRangeDays(opt.days)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <LearningKpiCards
        kpis={view.kpis}
        currencyCode={view.currencyCode}
        selectedKey={learning.chartKpi}
        onSelect={learning.setChartKpi}
      />

      <LearningPerformanceChart
        points={view.chartPoints}
        chartKpi={learning.chartKpi}
        benchmark={view.benchmark}
        fallbackValues={view.benchmarkIsDefault ? view.displayBenchmarkValues : null}
        currencyCode={view.currencyCode}
      />

      <SetBenchmarkDrawer
        open={learning.drawerOpen}
        onOpenChange={learning.setDrawerOpen}
        view={view}
        dailyRows={learning.dailyRows}
        onSave={learning.saveBenchmark}
      />

      <BenchmarkHistorySheet
        open={learning.historyOpen}
        onOpenChange={learning.setHistoryOpen}
        adAccountId={accountId}
        entityId={campaignId}
        scope="campaign"
      />
    </PageContent>
  );
}
