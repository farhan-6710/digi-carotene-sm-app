import { Link } from "react-router";

import { cn } from "@/shared/lib/utils";

import { useGrowthPaths } from "../../hooks/useGrowthPaths";

type CampaignDetailTabsProps = {
  campaignId: string;
  adAccountId: string;
  active: "overview" | "learning";
};

export function CampaignDetailTabs({
  campaignId,
  adAccountId,
  active,
}: CampaignDetailTabsProps) {
  const { buildCampaignDetailPath, buildCampaignLearningPath } = useGrowthPaths();

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
  ];

  return (
    <nav className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={tab.to}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
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
