import { MousePointerClick, Target, TrendingUp, Wallet } from "lucide-react";

import type { StatCardItem } from "@/shared/types/statsCards";

import type { CampaignMetricRow, CampaignRow, SpendPoint } from "../types/types";
import { dayLabel, formatCompact, formatCurrency, formatNumber } from "./formatters";

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Monday-based week start for the given `yyyy-MM-dd` date.
function weekStartKey(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return localDateKey(date);
}

export function buildCampaignStatCards(
  rows: CampaignMetricRow[],
  currency: string,
): StatCardItem[] {
  const spend = rows.reduce((sum, row) => sum + row.spend, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const conversions = rows.reduce((sum, row) => sum + row.conversions, 0);
  const campaignCount = new Set(rows.map((row) => row.campaignId)).size;
  const description = `Across ${campaignCount} campaigns`;

  return [
    {
      id: "spend",
      label: "Total Spend",
      value: formatCurrency(spend, currency),
      description: "In selected range",
      icon: Wallet,
    },
    {
      id: "impressions",
      label: "Impressions",
      value: formatCompact(impressions),
      description,
      icon: Target,
    },
    {
      id: "clicks",
      label: "Clicks",
      value: formatCompact(clicks),
      description,
      icon: MousePointerClick,
    },
    {
      id: "conversions",
      label: "Conversions",
      value: formatNumber(conversions),
      description: "In selected range",
      icon: TrendingUp,
    },
  ];
}

export function buildSpendTrend(rows: CampaignMetricRow[]): SpendPoint[] {
  const byWeek = new Map<string, { spend: number; conversions: number }>();
  for (const row of rows) {
    const key = weekStartKey(row.date);
    const current = byWeek.get(key) ?? { spend: 0, conversions: 0 };
    current.spend += row.spend;
    current.conversions += row.conversions;
    byWeek.set(key, current);
  }

  return [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, totals]) => ({
      label: dayLabel(key),
      spend: totals.spend,
      conversions: totals.conversions,
    }));
}

export function buildCampaignRows(rows: CampaignMetricRow[]): CampaignRow[] {
  const byCampaign = new Map<
    string,
    {
      name: string;
      status: CampaignRow["status"];
      objective: string | null;
      spend: number;
      impressions: number;
      clicks: number;
      conversions: number;
    }
  >();

  for (const row of rows) {
    const current = byCampaign.get(row.campaignId) ?? {
      name: row.campaignName,
      status: row.status,
      objective: row.objective,
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
    };
    current.name = row.campaignName;
    current.status = row.status;
    if (row.objective) current.objective = row.objective;
    current.spend += row.spend;
    current.impressions += row.impressions;
    current.clicks += row.clicks;
    current.conversions += row.conversions;
    byCampaign.set(row.campaignId, current);
  }

  return [...byCampaign.entries()]
    .map(([campaignId, totals]) => ({
      id: campaignId,
      name: totals.name,
      status: totals.status,
      objective: totals.objective,
      spend: totals.spend,
      impressions: totals.impressions,
      clicks: totals.clicks,
      ctr: totals.impressions
        ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2))
        : 0,
      conversions: totals.conversions,
    }))
    .sort((a, b) => b.spend - a.spend);
}
