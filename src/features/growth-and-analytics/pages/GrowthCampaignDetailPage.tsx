import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { GrowthCampaignProfileCard } from "../components/GrowthCampaignProfileCard";
import type { DemographicBreakdown } from "../types/types";
import {
  buildGrowthCampaignDetailPath,
  GROWTH_CAMPAIGN_ANALYTICS_PATH,
} from "../constants/routes";
import { GROWTH_AD_ACCOUNT_PARAM } from "../constants/growthUrlParams";
import { useGrowthCampaignDetailQuery } from "../hooks/useGrowthCampaignDetailQuery";
import { useGrowthCampaignDemographicBreakdown } from "../hooks/useGrowthCampaignDemographicBreakdown";
import { useGrowthSelectedAdAccount } from "../hooks/useGrowthSelectedAdAccount";
import { DateFilters } from "@/shared/components/DateFilters";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function GrowthCampaignDetailBackButton({ adAccountId }: { adAccountId: string }) {
  const backPath = adAccountId
    ? `${GROWTH_CAMPAIGN_ANALYTICS_PATH}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`
    : GROWTH_CAMPAIGN_ANALYTICS_PATH;

  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={backPath}>
        <ArrowLeft className="mr-2 size-4" />
        Back to campaign analytics
      </Link>
    </Button>
  );
}

function GrowthCampaignPager({
  previousCampaignId,
  nextCampaignId,
  adAccountId,
}: {
  previousCampaignId: string | null;
  nextCampaignId: string | null;
  adAccountId: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {previousCampaignId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link
            to={buildGrowthCampaignDetailPath(previousCampaignId, adAccountId)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Prev campaign
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full" disabled>
          <ArrowLeft className="mr-2 size-4" />
          Prev campaign
        </Button>
      )}
      {nextCampaignId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link to={buildGrowthCampaignDetailPath(nextCampaignId, adAccountId)}>
            Next campaign
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full" disabled>
          Next campaign
          <ArrowRight className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}

export function GrowthCampaignDetailPage() {
  const { campaignId = "" } = useParams();
  const { accountId } = useGrowthSelectedAdAccount();
  const [breakdowns, setBreakdowns] = useState<DemographicBreakdown[]>([]);
  const { view, isLoading, error, dateFilterProps, periodLabel, range } =
    useGrowthCampaignDetailQuery(campaignId);
  const {
    view: demographicView,
    isLoading: isDemographicLoading,
    error: demographicError,
  } = useGrowthCampaignDemographicBreakdown(campaignId, range, breakdowns);

  if (isLoading) {
    return (
      <DetailPageLoading
        backButton={<GrowthCampaignDetailBackButton adAccountId={accountId} />}
      />
    );
  }

  if (!view) {
    return (
      <section className="space-y-4">
        <PageHeader
          actions={
            <div className="flex w-full items-center justify-between gap-4">
              <GrowthCampaignDetailBackButton adAccountId={accountId} />
              <GrowthCampaignPager
                previousCampaignId={null}
                nextCampaignId={null}
                adAccountId={accountId}
              />
            </div>
          }
        />
        <ErrorBanner message={error ?? "Campaign not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        actions={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <GrowthCampaignDetailBackButton adAccountId={accountId} />
              <GrowthCampaignPager
                previousCampaignId={view.previousCampaignId}
                nextCampaignId={view.nextCampaignId}
                adAccountId={accountId}
              />
            </div>
            <DateFilters {...dateFilterProps} />
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}
      {demographicError ? <ErrorBanner message={demographicError} /> : null}

      <GrowthCampaignProfileCard
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
