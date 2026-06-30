import { startOfDay, subDays } from "date-fns";

import {
  META_FOLLOWER_COUNT_DAYS,
  META_INSIGHTS_WINDOW_DAYS,
  META_SYNC_DAYS,
} from "@/features/growth-and-analytics/constants/metaConfig";
import type { GrowthDateRange } from "@/features/growth-and-analytics/types/types";
import { parseUrlDateParam, serializeUrlDate } from "@/shared/utils/urlDateParams";

export type MetaSyncRange = {
  from: string;
  to: string;
  sinceUnix: string;
  untilUnix: string;
};

/** Meta daily insights exclude the current calendar day. */
export function getMetaInsightsUntilDate(): Date {
  return startOfDay(subDays(new Date(), 1));
}

function toMetaSyncRange(fromDate: Date, toDate: Date): MetaSyncRange {
  const from = startOfDay(fromDate);
  const to = startOfDay(toDate);

  return {
    from: serializeUrlDate(from),
    to: serializeUrlDate(to),
    sinceUnix: String(Math.floor(from.getTime() / 1000)),
    untilUnix: String(Math.floor(to.getTime() / 1000)),
  };
}

export function getMetaSyncDateSpan(): { from: string; to: string } {
  const toDate = getMetaInsightsUntilDate();
  const fromDate = subDays(toDate, META_SYNC_DAYS - 1);

  return {
    from: serializeUrlDate(fromDate),
    to: serializeUrlDate(toDate),
  };
}

/** Window for Instagram follower_count (max 30 days, excluding today). */
export function getMetaFollowerCountSyncRange(): MetaSyncRange {
  const toDate = getMetaInsightsUntilDate();
  const fromDate = subDays(toDate, META_FOLLOWER_COUNT_DAYS - 1);

  return toMetaSyncRange(fromDate, toDate);
}

/** Chunks a date span into Meta-safe insight ranges (max 28 days each). */
export function getMetaInsightChunksForSpan(from: string, to: string): MetaSyncRange[] {
  const fromDate = parseUrlDateParam(from);
  const toDate = parseUrlDateParam(to);
  if (!fromDate || !toDate) return [];

  const totalStart = startOfDay(fromDate);
  const chunks: MetaSyncRange[] = [];
  let chunkEnd = startOfDay(toDate);

  while (chunkEnd >= totalStart) {
    let chunkStart = subDays(chunkEnd, META_INSIGHTS_WINDOW_DAYS - 1);
    if (chunkStart < totalStart) {
      chunkStart = totalStart;
    }

    chunks.push(toMetaSyncRange(chunkStart, chunkEnd));

    if (chunkStart.getTime() <= totalStart.getTime()) {
      break;
    }

    chunkEnd = subDays(chunkStart, 1);
  }

  return chunks.reverse();
}

/** Chunks a long sync window into Meta-safe insight ranges (max 30 days each). */
export function getMetaInsightSyncChunks(): MetaSyncRange[] {
  const span = getMetaSyncDateSpan();
  return getMetaInsightChunksForSpan(span.from, span.to);
}

/** Maps UI date filters to a Meta-queryable span (capped at 90 days, excludes today). */
export function resolveGrowthMetaSpan(range: GrowthDateRange): { from: string; to: string } {
  const metaUntil = getMetaInsightsUntilDate();
  const earliest = subDays(metaUntil, META_SYNC_DAYS - 1);

  if (!range.from || !range.to) {
    return {
      from: serializeUrlDate(earliest),
      to: serializeUrlDate(metaUntil),
    };
  }

  let toDate = parseUrlDateParam(range.to) ?? metaUntil;
  let fromDate = parseUrlDateParam(range.from) ?? earliest;

  if (toDate > metaUntil) toDate = metaUntil;
  if (fromDate > toDate) fromDate = toDate;
  if (fromDate < earliest) fromDate = earliest;

  return {
    from: serializeUrlDate(fromDate),
    to: serializeUrlDate(toDate),
  };
}

/** Intersection of a span with Instagram's follower_count window (last 30 days). */
export function getFollowerInsightRange(
  span: { from: string; to: string },
): MetaSyncRange | null {
  const followerWindow = getMetaFollowerCountSyncRange();
  const from = span.from > followerWindow.from ? span.from : followerWindow.from;
  const to = span.to < followerWindow.to ? span.to : followerWindow.to;
  if (from > to) return null;

  const fromDate = parseUrlDateParam(from);
  const toDate = parseUrlDateParam(to);
  if (!fromDate || !toDate) return null;

  return toMetaSyncRange(fromDate, toDate);
}

export function getMetaSyncRange(): MetaSyncRange {
  const span = getMetaSyncDateSpan();
  const toDate = getMetaInsightsUntilDate();
  const fromDate = subDays(toDate, META_SYNC_DAYS - 1);

  return {
    ...span,
    sinceUnix: String(Math.floor(startOfDay(fromDate).getTime() / 1000)),
    untilUnix: String(Math.floor(toDate.getTime() / 1000)),
  };
}

export type InsightPoint = { date: string; value: number };

export function flattenInsightMetrics(
  metrics: Array<{ name?: string; values?: Array<{ value?: number; end_time?: string }> }>,
): Map<string, Record<string, number>> {
  const byDate = new Map<string, Record<string, number>>();

  for (const metric of metrics) {
    const name = metric.name ?? "";
    for (const point of metric.values ?? []) {
      const date = point.end_time?.slice(0, 10);
      if (!date) continue;
      const row = byDate.get(date) ?? {};
      row[name] = (row[name] ?? 0) + (point.value ?? 0);
      byDate.set(date, row);
    }
  }

  return byDate;
}

export function buildDailyMetricRows(
  byDate: Map<string, Record<string, number>>,
  currentFollowerTotal: number,
  options?: { followerCountIsDailyDelta?: boolean },
): Array<{
  metric_date: string;
  followers: number;
  new_followers: number;
  reach: number;
  impressions: number;
  engagement: number;
}> {
  const dates = [...byDate.keys()].sort();
  let prevFollowers = currentFollowerTotal;
  const rows: Array<{
    metric_date: string;
    followers: number;
    new_followers: number;
    reach: number;
    impressions: number;
    engagement: number;
  }> = [];

  const followerCountIsDailyDelta = options?.followerCountIsDailyDelta ?? false;

  for (const date of dates) {
    const values = byDate.get(date) ?? {};
    const reach = Math.round(values.reach ?? 0);
    const engagement = Math.round(
      values.total_interactions ??
        values.page_post_engagements ??
        values.post_engagements ??
        0,
    );
    const impressions = Math.round(
      values.impressions ?? values.page_impressions ?? values.views ?? reach * 1.3,
    );

    let newFollowers: number;
    let followers: number;

    if (followerCountIsDailyDelta) {
      // Instagram follower_count with period=day is net new followers that day, not a total.
      newFollowers = Math.round(values.follower_count ?? 0);
      followers = 0;
    } else {
      followers = Math.round(
        values.follower_count ?? values.followers ?? prevFollowers,
      );
      newFollowers = Math.max(
        0,
        Math.round(values.page_fan_adds ?? followers - prevFollowers),
      );
      prevFollowers = followers;
    }

    rows.push({
      metric_date: date,
      followers,
      new_followers: newFollowers,
      reach,
      impressions,
      engagement,
    });
  }

  if (followerCountIsDailyDelta && rows.length > 0) {
    let runningTotal = currentFollowerTotal;
    for (const row of [...rows].sort((a, b) => b.metric_date.localeCompare(a.metric_date))) {
      row.followers = runningTotal;
      runningTotal -= row.new_followers;
    }
  }

  return rows;
}

export function mapIgMediaType(
  mediaType?: string,
  productType?: string,
): "Reel" | "Image" | "Carousel" | "Story" {
  if (productType === "REELS" || mediaType === "VIDEO") return "Reel";
  if (mediaType === "CAROUSEL_ALBUM") return "Carousel";
  if (mediaType === "STORY") return "Story";
  return "Image";
}

export function mapCampaignStatus(status?: string): "Active" | "Paused" | "Completed" {
  if (status === "ACTIVE") return "Active";
  if (status === "PAUSED") return "Paused";
  return "Completed";
}

export function parseConversions(
  actions?: Array<{ action_type?: string; value?: string }>,
): number {
  if (!actions) return 0;
  const types = new Set([
    "lead",
    "onsite_conversion.lead_grouped",
    "purchase",
    "offsite_conversion.fb_pixel_purchase",
  ]);
  return actions.reduce((sum, action) => {
    if (action.action_type && types.has(action.action_type)) {
      return sum + Math.round(Number(action.value ?? 0));
    }
    return sum;
  }, 0);
}

export function parseSpend(value: string | number | undefined): number {
  return Math.round(Number(value ?? 0));
}
