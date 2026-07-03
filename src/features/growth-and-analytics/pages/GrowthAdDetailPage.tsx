import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { GrowthAdProfileCard } from "../components/GrowthAdProfileCard";
import {
  buildGrowthAdDetailPath,
  buildGrowthAdsetDetailPath,
} from "../constants/routes";
import { useGrowthAdDetailQuery } from "../hooks/useGrowthAdDetailQuery";
import { useGrowthSelectedAdAccount } from "../hooks/useGrowthSelectedAdAccount";
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
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={buildGrowthAdsetDetailPath(campaignId, adsetId, adAccountId)}>
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
  return (
    <div className="flex items-center gap-2">
      {previousAdId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link
            to={buildGrowthAdDetailPath(campaignId, adsetId, previousAdId, adAccountId)}
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
            to={buildGrowthAdDetailPath(campaignId, adsetId, nextAdId, adAccountId)}
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
  const { view, isLoading, error } = useGrowthAdDetailQuery(campaignId, adsetId, adId);

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
          <div className="flex w-full items-center justify-between gap-4">
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
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <GrowthAdProfileCard view={view} />
    </PageContent>
  );
}
