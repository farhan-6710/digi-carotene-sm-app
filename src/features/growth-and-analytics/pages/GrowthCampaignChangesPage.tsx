import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

import { CampaignChangesFilters } from "../components/learning/CampaignChangesFilters";
import { CampaignChangesTable } from "../components/learning/CampaignChangesTable";
import { CampaignDetailTabs } from "../components/learning/CampaignDetailTabs";
import { ExplainChangeDrawer } from "../components/learning/ExplainChangeDrawer";
import { LogPlannedChangeDrawer } from "../components/learning/LogPlannedChangeDrawer";
import { GROWTH_AD_ACCOUNT_PARAM } from "../constants/shared/growthUrlParams";
import { useCampaignChangesUi } from "../hooks/learning/useCampaignChangesUi";
import { useGrowthPaths } from "../hooks/shared/useGrowthPaths";
import { useGrowthSelectedAdAccount } from "../hooks/shared/useGrowthSelectedAdAccount";

export function GrowthCampaignChangesPage() {
  const { campaignId = "" } = useParams();
  const { accountId } = useGrowthSelectedAdAccount();
  const { campaignAnalyticsPath, buildCampaignDetailPath } = useGrowthPaths();
  const changes = useCampaignChangesUi();

  const backPath = accountId
    ? `${campaignAnalyticsPath}?${GROWTH_AD_ACCOUNT_PARAM}=${accountId}`
    : campaignAnalyticsPath;
  const campaignName = `Campaign ${campaignId.slice(0, 8) || "—"}`;

  return (
    <PageContent>
      <PageHeader
        heading="Changes"
        description="Every platform edit for this campaign — reason, verification, and impact. UI preview."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to={buildCampaignDetailPath(campaignId, accountId)}>
                Overview
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to={backPath}>
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Link>
            </Button>
          </div>
        }
      />

      <CampaignDetailTabs
        campaignId={campaignId}
        adAccountId={accountId}
        active="changes"
      />

      <CampaignChangesFilters
        range={changes.range}
        category={changes.category}
        status={changes.status}
        madeBy={changes.madeBy}
        onRangeChange={changes.setRange}
        onCategoryChange={changes.setCategory}
        onStatusChange={changes.setStatus}
        onMadeByChange={changes.setMadeBy}
        onLogPlanned={() => changes.setLogOpen(true)}
      />

      <CampaignChangesTable
        rows={changes.rows}
        onExplain={changes.openExplain}
      />

      <ExplainChangeDrawer
        open={changes.explainOpen}
        onOpenChange={changes.setExplainOpen}
        row={changes.activeRow}
        campaignName={campaignName}
      />

      <LogPlannedChangeDrawer
        open={changes.logOpen}
        onOpenChange={changes.setLogOpen}
        campaignName={campaignName}
      />
    </PageContent>
  );
}
