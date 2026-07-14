import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { GrowthAdProfileCard } from "../components/GrowthAdProfileCard";
import { useGrowthAdEntityBreakdown } from "../hooks/useGrowthCampaignDemographicBreakdown";
import { useGrowthAdDetailQuery } from "../hooks/useGrowthAdDetailQuery";
import { useGrowthPaths } from "../hooks/useGrowthPaths";
import { useGrowthSelectedAdAccount } from "../hooks/useGrowthSelectedAdAccount";
import type { DemographicBreakdown } from "../types/types";
import { DateFilters } from "@/shared/components/DateFilters";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function GrowthAdDetailBackButton({
  campaignId,
  adsetId,
  adAccountId,
}: {
  campaignId: string;
  adsetId: string;
  adAccountId: string;
}) {
  const { buildAdsetDetailPath } = useGrowthPaths();

  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={buildAdsetDetailPath(campaignId, adsetId, adAccountId)}>
        <ArrowLeft className="mr-2 size-4" />
        Back to ad set
      </Link>
    </Button>
  );
}

function GrowthAdPager({
  campaignId,
  adsetId,
  previousAdId,
  nextAdId,
  adAccountId,
}: {
  campaignId: string;
  adsetId: string;
  previousAdId: string | null;
  nextAdId: string | null;
  adAccountId: string;
}) {
  const { buildAdDetailPath } = useGrowthPaths();

  return (
    <div className="flex items-center gap-2">
      {previousAdId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link
            to={buildAdDetailPath(campaignId, adsetId, previousAdId, adAccountId)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Prev ad
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full" disabled>
          <ArrowLeft className="mr-2 size-4" />
          Prev ad
        </Button>
      )}
      {nextAdId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link
            to={buildAdDetailPath(campaignId, adsetId, nextAdId, adAccountId)}
          >
            Next ad
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full" disabled>
          Next ad
          <ArrowRight className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}

export function GrowthAdDetailPage() {
  const { campaignId = "", adsetId = "", adId = "" } = useParams();
  const { accountId } = useGrowthSelectedAdAccount();
  const [breakdowns, setBreakdowns] = useState<DemographicBreakdown[]>([]);
  const { view, isLoading, error, dateFilterProps, periodLabel, range } =
    useGrowthAdDetailQuery(campaignId, adsetId, adId);
  const breakdownScope = useMemo(
    () => ({ level: "ad" as const, id: adId }),
    [adId],
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
          <GrowthAdDetailBackButton
            campaignId={campaignId}
            adsetId={adsetId}
            adAccountId={accountId}
          />
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
              <GrowthAdDetailBackButton
                campaignId={campaignId}
                adsetId={adsetId}
                adAccountId={accountId}
              />
              <GrowthAdPager
                campaignId={campaignId}
                adsetId={adsetId}
                previousAdId={null}
                nextAdId={null}
                adAccountId={accountId}
              />
            </div>
          }
        />
        <ErrorBanner message={error ?? "Ad not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        actions={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <GrowthAdDetailBackButton
                campaignId={campaignId}
                adsetId={adsetId}
                adAccountId={accountId}
              />
              <GrowthAdPager
                campaignId={campaignId}
                adsetId={adsetId}
                previousAdId={view.previousAdId}
                nextAdId={view.nextAdId}
                adAccountId={accountId}
              />
            </div>
            <DateFilters {...dateFilterProps} />
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}
      {demographicError ? <ErrorBanner message={demographicError} /> : null}

      <GrowthAdProfileCard
        view={view}
        periodLabel={periodLabel}
        breakdowns={breakdowns}
        onBreakdownsChange={setBreakdowns}
        demographicView={demographicView}
        isDemographicLoading={isDemographicLoading}
      />
    </PageContent>
  );
}
