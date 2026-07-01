import { Eye, MessageCircle, TrendingUp, Users } from "lucide-react";

import type { StatCardItem } from "@/shared/types/statsCards";

import type {
  CategoryDatum,
  DailyMetricRow,
  GrowthPlatform,
  InteractionTotals,
  OrganicAccount,
} from "../types/types";
import { formatCompact } from "./formatters";

const PLATFORM_LABEL: Record<GrowthPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
};

const PLATFORM_COLOR: Record<GrowthPlatform, string> = {
  instagram: "var(--chart-1)",
  facebook: "var(--chart-3)",
};

export function buildDashboardStatCards(
  rows: DailyMetricRow[],
  account?: OrganicAccount,
  interactionTotals?: InteractionTotals,
  followersGained?: number,
): StatCardItem[] {
  const totalFollowers = account?.followers ?? 0;
  const totalReach = rows.reduce((sum, row) => sum + row.reach, 0);
  const totalLikes = interactionTotals?.likes ?? 0;
  const totalComments = interactionTotals?.comments ?? 0;
  const totalSaves = interactionTotals?.saves ?? 0;
  const totalShares = interactionTotals?.shares ?? 0;
  const totalReposts = interactionTotals?.reposts ?? 0;
  const totalViews = interactionTotals?.views ?? 0;
  const totalEngagement =
    totalLikes + totalComments + totalSaves + totalShares + totalReposts;
  const netNew =
    followersGained ??
    rows.reduce((sum, row) => sum + row.newFollowers, 0);

  const interactionDescription = [
    `${formatCompact(totalLikes)} likes`,
    `${formatCompact(totalComments)} comments`,
    `${formatCompact(totalSaves)} saves`,
    `${formatCompact(totalShares)} shares`,
    `${formatCompact(totalReposts)} reposts`,
    `${formatCompact(totalViews)} views`,
  ].join(" · ");

  const interactionTooltip = [
    `Likes: ${formatCompact(totalLikes)}`,
    `Comments: ${formatCompact(totalComments)}`,
    `Saves: ${formatCompact(totalSaves)}`,
    `Shares: ${formatCompact(totalShares)}`,
    `Reposts: ${formatCompact(totalReposts)}`,
    `Views: ${formatCompact(totalViews)}`,
    `Total interactions: ${formatCompact(totalEngagement)}`,
  ].join("\n");

  return [
    {
      id: "followers",
      label: "Current Followers",
      value: formatCompact(totalFollowers),
      description: "As of today",
      icon: Users,
    },
    {
      id: "engagement",
      label: "Posts Interactions",
      value: formatCompact(totalEngagement),
      description: interactionDescription,
      descriptionTooltip: interactionTooltip,
      icon: MessageCircle,
    },
    {
      id: "reach",
      label: "Posts Reach",
      value: formatCompact(totalReach),
      description: "In selected range",
      icon: Eye,
    },
    {
      id: "growth",
      label: "Followers Gained",
      value: formatCompact(netNew),
      description:
        netNew > 0 ? "In selected range" : "No follower gain in selected range",
      icon: TrendingUp,
    },
  ];
}

export function buildPlatformSplit(
  _rows: DailyMetricRow[],
  account?: OrganicAccount,
): CategoryDatum[] {
  if (!account) return [];

  return [
    {
      key: account.platform,
      label: PLATFORM_LABEL[account.platform],
      value: account.followers,
      color: PLATFORM_COLOR[account.platform],
    },
  ];
}
