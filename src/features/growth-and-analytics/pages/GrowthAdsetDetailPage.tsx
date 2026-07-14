import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { GrowthAdsetProfileCard } from "../components/GrowthAdsetProfileCard";
import { useGrowthAdEntityBreakdown } from "../hooks/useGrowthCampaignDemographicBreakdown";
import { useGrowthAdsetDetailQuery } from "../hooks/useGrowthAdsetDetailQuery";
import { useGrowthPaths } from "../hooks/useGrowthPaths";
import { useGrowthSelectedAdAccount } from "../hooks/useGrowthSelectedAdAccount";
import type { DemographicBreakdown } from "../types/types";
import { DateFilters } from "@/shared/components/DateFilters";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function GrowthAdsetDetailBackButton({
  campaignId,
  adAccountId,
}: {
  campaignId: string;
  adAccountId: string;
}) {
  const { buildCampaignDetailPath } = useGrowthPaths();

  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={buildCampaignDetailPath(campaignId, adAccountId)}>
        <ArrowLeft className="mr-2 size-4" />
        Back to campaign
      </Link>
    </Button>
  );
}

function GrowthAdsetPager({
  campaignId,
  previousAdsetId,
  nextAdsetId,
  adAccountId,
}: {
  campaignId: string;
  previousAdsetId: string | null;
  nextAdsetId: string | null;
  adAccountId: string;
}) {
  const { buildAdsetDetailPath } = useGrowthPaths();

  return (
    <div className="flex items-center gap-2">
      {previousAdsetId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link
            to={buildAdsetDetailPath(campaignId, previousAdsetId, adAccountId)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Prev ad set
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full" disabled>
          <ArrowLeft className="mr-2 size-4" />
          Prev ad set
        </Button>
      )}
      {nextAdsetId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link to={buildAdsetDetailPath(campaignId, nextAdsetId, adAccountId)}>
            Next ad set
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full" disabled>
          Next ad set
          <ArrowRight className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}

export function GrowthAdsetDetailPage() {
  const { campaignId = "", adsetId = "" } = useParams();
  const { accountId } = useGrowthSelectedAdAccount();
  const [breakdowns, setBreakdowns] = useState<DemographicBreakdown[]>([]);
  const { view, isLoading, error, dateFilterProps, periodLabel, range } =
    useGrowthAdsetDetailQuery(campaignId, adsetId);
  const breakdownScope = useMemo(
    () => ({ level: "adset" as const, id: adsetId }),
    [adsetId],
  );
  const {
    view: demographicView,
    isLoading: isDemographicLoading,
    error: demographicError,
  } = useGrowthAdEntityBreakdown(breakdownScope, range, breakdowns);

  if (isLoading) {
    return (
      <DetailPageLoading
        backButton={
          <GrowthAdsetDetailBackButton campaignId={campaignId} adAccountId={accountId} />
        }
      />
    );
  }

  if (!view) {
    return (
      <section className="space-y-4">
        <PageHeader
          actions={
            <div className="flex w-full items-center justify-between gap-4">
              <GrowthAdsetDetailBackButton campaignId={campaignId} adAccountId={accountId} />
              <GrowthAdsetPager
                campaignId={campaignId}
                previousAdsetId={null}
                nextAdsetId={null}
                adAccountId={accountId}
              />
            </div>
          }
        />
        <ErrorBanner message={error ?? "Ad set not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        actions={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <GrowthAdsetDetailBackButton campaignId={campaignId} adAccountId={accountId} />
              <GrowthAdsetPager
                campaignId={campaignId}
                previousAdsetId={view.previousAdsetId}
                nextAdsetId={view.nextAdsetId}
                adAccountId={accountId}
              />
            </div>
            <DateFilters {...dateFilterProps} />
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}
      {demographicError ? <ErrorBanner message={demographicError} /> : null}

      <GrowthAdsetProfileCard
        view={view}
        adAccountId={accountId}
        periodLabel={periodLabel}
        breakdowns={breakdowns}
        onBreakdownsChange={setBreakdowns}
        demographicView={demographicView}
        isDemographicLoading={isDemographicLoading}
      />
    </PageContent>
  );
}
