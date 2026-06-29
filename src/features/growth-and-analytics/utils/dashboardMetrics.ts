import { Eye, Heart, TrendingUp, Users } from "lucide-react";

import type { StatCardItem } from "@/shared/types/statsCards";

import type {
  CategoryDatum,
  DailyMetricRow,
  GrowthPlatform,
  TopAccountRow,
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

// Rows arrive date-ascending, so the last write per account is the latest day.
function latestPerAccount(rows: DailyMetricRow[]): DailyMetricRow[] {
  const byAccount = new Map<string, DailyMetricRow>();
  for (const row of rows) {
    byAccount.set(row.accountId, row);
  }
  return [...byAccount.values()];
}

export function buildDashboardStatCards(rows: DailyMetricRow[]): StatCardItem[] {
  const latest = latestPerAccount(rows);
  const totalFollowers = latest.reduce((sum, row) => sum + row.followers, 0);
  const totalReach = rows.reduce((sum, row) => sum + row.reach, 0);
  const totalEngagement = rows.reduce((sum, row) => sum + row.engagement, 0);
  const netNew = rows.reduce((sum, row) => sum + row.newFollowers, 0);
  const engagementRate = totalReach ? (totalEngagement / totalReach) * 100 : 0;

  return [
    {
      id: "followers",
      label: "Total Followers",
      value: formatCompact(totalFollowers),
      description: `Across ${latest.length} connected accounts`,
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

export function buildPlatformSplit(rows: DailyMetricRow[]): CategoryDatum[] {
  const byPlatform = new Map<GrowthPlatform, number>();
  for (const row of latestPerAccount(rows)) {
    byPlatform.set(row.platform, (byPlatform.get(row.platform) ?? 0) + row.followers);
  }

  return [...byPlatform.entries()].map(([platform, value]) => ({
    key: platform,
    label: PLATFORM_LABEL[platform],
    value,
    color: PLATFORM_COLOR[platform],
  }));
}

export function buildTopAccounts(rows: DailyMetricRow[]): TopAccountRow[] {
  const totals = new Map<string, { reach: number; engagement: number }>();
  for (const row of rows) {
    const current = totals.get(row.accountId) ?? { reach: 0, engagement: 0 };
    current.reach += row.reach;
    current.engagement += row.engagement;
    totals.set(row.accountId, current);
  }

  return latestPerAccount(rows)
    .map((row) => {
      const agg = totals.get(row.accountId) ?? { reach: 0, engagement: 0 };
      return {
        id: row.accountId,
        name: row.accountName,
        platform: row.platform,
        followers: row.followers,
        engagementRate: agg.reach
          ? Number(((agg.engagement / agg.reach) * 100).toFixed(1))
          : 0,
        reach: agg.reach,
      };
    })
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 5);
}
