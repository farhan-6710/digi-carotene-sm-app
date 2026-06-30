import { Eye, Heart, TrendingUp, Users } from "lucide-react";

import type { StatCardItem } from "@/shared/types/statsCards";

import type {
  CategoryDatum,
  DailyMetricRow,
  GrowthPlatform,
  OrganicAccount,
  TrendPoint,
} from "../types/types";
import { formatCompact, formatPercent, monthLabel } from "./formatters";

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
): StatCardItem[] {
  const totalFollowers = account?.followers ?? 0;
  const totalReach = rows.reduce((sum, row) => sum + row.reach, 0);
  const totalEngagement = rows.reduce((sum, row) => sum + row.engagement, 0);
  const netNew = rows.reduce((sum, row) => sum + row.newFollowers, 0);
  const engagementRate = totalReach ? (totalEngagement / totalReach) * 100 : 0;
  const accountLabel = account?.accountName ?? "Selected account";

  return [
    {
      id: "followers",
      label: "Total Followers",
      value: formatCompact(totalFollowers),
      description: accountLabel,
      icon: Users,
    },
    {
      id: "engagement",
      label: "Avg Engagement Rate",
      value: formatPercent(engagementRate),
      description: "Engagement ÷ reach in range",
      icon: Heart,
    },
    {
      id: "reach",
      label: "Total Reach",
      value: formatCompact(totalReach),
      description: "In selected range",
      icon: Eye,
    },
    {
      id: "growth",
      label: "Net New Followers",
      value: formatCompact(netNew),
      description: "In selected range",
      icon: TrendingUp,
    },
  ];
}

export function buildTrend(rows: DailyMetricRow[]): TrendPoint[] {
  const byDate = new Map<
    string,
    { followers: number; reach: number; engagement: number }
  >();

  for (const row of rows) {
    const current = byDate.get(row.date) ?? {
      followers: 0,
      reach: 0,
      engagement: 0,
    };
    current.followers += row.followers;
    current.reach += row.reach;
    current.engagement += row.engagement;
    byDate.set(row.date, current);
  }

  const byMonth = new Map<
    string,
    { label: string; followers: number; reach: number; engagement: number }
  >();

  for (const date of [...byDate.keys()].sort()) {
    const totals = byDate.get(date)!;
    const key = date.slice(0, 7);
    const current = byMonth.get(key) ?? {
      label: monthLabel(date),
      followers: 0,
      reach: 0,
      engagement: 0,
    };
    current.followers = totals.followers;
    current.reach += totals.reach;
    current.engagement += totals.engagement;
    byMonth.set(key, current);
  }

  return [...byMonth.values()].map((month) => ({
    label: month.label,
    followers: month.followers,
    reach: month.reach,
    engagement: month.reach
      ? Number(((month.engagement / month.reach) * 100).toFixed(1))
      : 0,
  }));
}

export function buildPlatformSplit(account?: OrganicAccount): CategoryDatum[] {
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
