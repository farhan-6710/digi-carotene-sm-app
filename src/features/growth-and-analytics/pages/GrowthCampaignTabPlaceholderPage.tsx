import { Link, useLocation, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

import { CampaignDetailTabs } from "../components/learning/CampaignDetailTabs";
import { CampaignTabComingSoon } from "../components/learning/CampaignTabComingSoon";
import {
  campaignPlaceholderCopy,
  resolveCampaignPlaceholderTab,
} from "../constants/learning/campaignDetailTabs";
import { GROWTH_AD_ACCOUNT_PARAM } from "../constants/shared/growthUrlParams";
import { useGrowthPaths } from "../hooks/shared/useGrowthPaths";
import { useGrowthSelectedAdAccount } from "../hooks/shared/useGrowthSelectedAdAccount";

export function GrowthCampaignTabPlaceholderPage() {
  const { campaignId = "" } = useParams();
  const { pathname } = useLocation();
  const { accountId } = useGrowthSelectedAdAccount();
  const { campaignAnalyticsPath } = useGrowthPaths();
  const tab = resolveCampaignPlaceholderTab(pathname);

  const backPath = accountId
    ? `${campaignAnalyticsPath}?${GROWTH_AD_ACCOUNT_PARAM}=${accountId}`
    : campaignAnalyticsPath;

  if (!tab) {
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
        <ErrorBanner message="Unknown campaign tab." />
      </section>
    );
  }

  const copy = campaignPlaceholderCopy(tab);

  return (
    <PageContent>
      <PageHeader
        heading={copy.title.replace(" coming soon", "")}
        description="Placeholder until this campaign tab is built."
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
        active={tab}
      />

      <CampaignTabComingSoon tab={tab} />
    </PageContent>
  );
}
