import { startOfDay, subDays } from "date-fns";

import {
  META_FOLLOWER_COUNT_DAYS,
  META_INSIGHTS_WINDOW_DAYS,
  META_SYNC_DAYS,
} from "@/features/growth-and-analytics/constants/metaConfig";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

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

/** Chunks a long sync window into Meta-safe insight ranges (max 30 days each). */
export function getMetaInsightSyncChunks(): MetaSyncRange[] {
  const toDate = getMetaInsightsUntilDate();
  const totalStart = subDays(toDate, META_SYNC_DAYS - 1);
  const chunks: MetaSyncRange[] = [];

  let chunkEnd = toDate;

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
  followerFallback: number,
): Array<{
  metric_date: string;
  followers: number;
  new_followers: number;
  reach: number;
  impressions: number;
  engagement: number;
}> {
  const dates = [...byDate.keys()].sort();
  let prevFollowers = followerFallback;
  const rows: Array<{
    metric_date: string;
    followers: number;
    new_followers: number;
    reach: number;
    impressions: number;
    engagement: number;
  }> = [];

  for (const date of dates) {
    const values = byDate.get(date) ?? {};
    const followers = Math.round(
      values.follower_count ?? values.followers ?? prevFollowers,
    );
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
    const newFollowers = Math.max(
      0,
      Math.round(values.page_fan_adds ?? followers - prevFollowers),
    );

    rows.push({
      metric_date: date,
      followers,
      new_followers: newFollowers,
      reach,
      impressions,
      engagement,
    });
    prevFollowers = followers;
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
