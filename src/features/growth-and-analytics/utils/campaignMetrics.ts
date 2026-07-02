import { MousePointerClick, Target, TrendingUp, Wallet } from "lucide-react";

import type { StatCardItem } from "@/shared/types/statsCards";

import { addDays, differenceInCalendarDays } from "date-fns";

import { SPEND_TREND_DAILY_MAX_DAYS } from "../constants/spendTrend";
import type { CampaignMetricRow, CampaignRow, SpendPoint, SpendTrend } from "../types/types";
import { dayLabel, formatCompact, formatCurrency, formatNumber, monthLabel } from "./formatters";
import { parseUrlDateParam, serializeUrlDate } from "@/shared/utils/urlDateParams";

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

export function buildSpendTrend(rows: CampaignMetricRow[]): SpendTrend {
  const byDate = new Map<string, { spend: number; conversions: number }>();

  for (const row of rows) {
    const current = byDate.get(row.date) ?? { spend: 0, conversions: 0 };
    current.spend += row.spend;
    current.conversions += row.conversions;
    byDate.set(row.date, current);
  }

  const sortedDates = [...byDate.keys()].sort();
  if (sortedDates.length === 0) {
    return { points: [], granularity: "day" };
  }

  const fromDate = parseUrlDateParam(sortedDates[0]!)!;
  const toDate = parseUrlDateParam(sortedDates[sortedDates.length - 1]!)!;
  const spanDays = differenceInCalendarDays(toDate, fromDate) + 1;
  const useDaily = spanDays <= SPEND_TREND_DAILY_MAX_DAYS;

  if (useDaily) {
    const points: SpendPoint[] = [];
    let current = fromDate;

    while (current <= toDate) {
      const date = serializeUrlDate(current);
      const totals = byDate.get(date) ?? { spend: 0, conversions: 0 };
      points.push({
        date,
        label: dayLabel(date),
        spend: totals.spend,
        conversions: totals.conversions,
      });
      current = addDays(current, 1);
    }

    return { points, granularity: "day" };
  }

  const byMonth = new Map<
    string,
    { label: string; spend: number; conversions: number }
  >();

  for (const date of sortedDates) {
    const monthKey = date.slice(0, 7);
    const totals = byDate.get(date)!;
    const current = byMonth.get(monthKey) ?? {
      label: monthLabel(date),
      spend: 0,
      conversions: 0,
    };
    current.spend += totals.spend;
    current.conversions += totals.conversions;
    byMonth.set(monthKey, current);
  }

  const points = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, totals]) => ({
      date: `${monthKey}-01`,
      label: totals.label,
      spend: totals.spend,
      conversions: totals.conversions,
    }));

  return { points, granularity: "month" };
}

export function spendTrendChartTitle(granularity: SpendTrend["granularity"]): string {
  return granularity === "day"
    ? "Daily Spend vs Conversions"
    : "Monthly Spend vs Conversions";
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
