import { Link } from "react-router";

import { cn } from "@/shared/lib/utils";

import {
  campaignStructureTabLabel,
  type CampaignDetailTabId,
} from "../../constants/learning/campaignDetailTabs";
import { useGrowthPaths } from "../../hooks/shared/useGrowthPaths";
import { useGrowthSelectedAdAccount } from "../../hooks/shared/useGrowthSelectedAdAccount";

type CampaignDetailTabsProps = {
  campaignId: string;
  adAccountId: string;
  active: CampaignDetailTabId;
};

export function CampaignDetailTabs({
  campaignId,
  adAccountId,
  active,
}: CampaignDetailTabsProps) {
  const {
    buildCampaignDetailPath,
    buildCampaignLearningPath,
    buildCampaignChangesPath,
    buildCampaignAlertsPath,
    buildCampaignStructurePath,
    buildCampaignSettingsPath,
  } = useGrowthPaths();
  const { activeAccount } = useGrowthSelectedAdAccount();
  const platform = activeAccount?.platform ?? "meta_ads";
  const structureLabel = campaignStructureTabLabel(platform);

  const tabs = [
    {
      id: "overview" as const,
      label: "Overview",
      to: buildCampaignDetailPath(campaignId, adAccountId),
    },
    {
      id: "learning" as const,
      label: "Learning",
      to: buildCampaignLearningPath(campaignId, adAccountId),
    },
    {
      id: "changes" as const,
      label: "Changes",
      to: buildCampaignChangesPath(campaignId, adAccountId),
    },
    {
      id: "alerts" as const,
      label: "Alerts",
      to: buildCampaignAlertsPath(campaignId, adAccountId),
    },
    {
      id: "structure" as const,
      label: structureLabel,
      to: buildCampaignStructurePath(campaignId, adAccountId),
    },
    {
      id: "settings" as const,
      label: "Settings",
      to: buildCampaignSettingsPath(campaignId, adAccountId),
    },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={tab.to}
          className={cn(
            "shrink-0 px-4 py-2 text-sm font-medium transition-colors",
            active === tab.id
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
