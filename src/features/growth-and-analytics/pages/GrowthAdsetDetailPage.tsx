import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { GrowthAdsetProfileCard } from "../components/GrowthAdsetProfileCard";
import {
  buildGrowthAdsetDetailPath,
  buildGrowthCampaignDetailPath,
} from "../constants/routes";
import { useGrowthAdsetDetailQuery } from "../hooks/useGrowthAdsetDetailQuery";
import { useGrowthSelectedAdAccount } from "../hooks/useGrowthSelectedAdAccount";
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
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={buildGrowthCampaignDetailPath(campaignId, adAccountId)}>
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
  return (
    <div className="flex items-center gap-2">
      {previousAdsetId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link
            to={buildGrowthAdsetDetailPath(campaignId, previousAdsetId, adAccountId)}
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
          <Link to={buildGrowthAdsetDetailPath(campaignId, nextAdsetId, adAccountId)}>
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
  const { view, isLoading, error } = useGrowthAdsetDetailQuery(campaignId, adsetId);

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
          <div className="flex w-full items-center justify-between gap-4">
            <GrowthAdsetDetailBackButton campaignId={campaignId} adAccountId={accountId} />
            <GrowthAdsetPager
              campaignId={campaignId}
              previousAdsetId={view.previousAdsetId}
              nextAdsetId={view.nextAdsetId}
              adAccountId={accountId}
            />
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <GrowthAdsetProfileCard view={view} adAccountId={accountId} />
    </PageContent>
  );
}
