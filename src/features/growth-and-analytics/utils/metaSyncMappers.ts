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

function parseInsightValue(
  value:
    | number
    | {
        value?: number;
      }
    | undefined,
): number {
  if (typeof value === "number") return value;
  if (typeof value?.value === "number") return value.value;
  return 0;
}

export function flattenInsightMetrics(
  metrics: Array<{
    name?: string;
    values?: Array<{
      value?: number | { value?: number };
      end_time?: string;
    }>;
  }>,
): Map<string, Record<string, number>> {
  const byDate = new Map<string, Record<string, number>>();

  for (const metric of metrics) {
    const name = metric.name ?? "";
    for (const point of metric.values ?? []) {
      const date = point.end_time?.slice(0, 10);
      if (!date) continue;
      const row = byDate.get(date) ?? {};
      row[name] = (row[name] ?? 0) + parseInsightValue(point.value);
      byDate.set(date, row);
    }
  }

  return byDate;
}

type InsightMetricBlock = {
  name?: string;
  values?: Array<{
    value?: number | { value?: number };
    end_time?: string;
  }>;
  total_value?: { value?: number | { value?: number } };
};

/** Merges one Meta insight chunk; range totals land on the chunk end date. */
export function mergeInsightChunkIntoByDate(
  byDate: Map<string, Record<string, number>>,
  metrics: InsightMetricBlock[],
  chunk: { from: string; to: string },
): void {
  for (const [date, values] of flattenInsightMetrics(metrics)) {
    if (date >= chunk.from && date <= chunk.to) {
      byDate.set(date, { ...(byDate.get(date) ?? {}), ...values });
    }
  }

  for (const metric of metrics) {
    const name = metric.name ?? "";
    if (!name || metric.values?.length) continue;

    const total = parseInsightValue(metric.total_value?.value);
    if (!total) continue;

    const row = byDate.get(chunk.to) ?? {};
    row[name] = (row[name] ?? 0) + total;
    byDate.set(chunk.to, row);
  }
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
  likes: number;
  comments: number;
  shares: number;
  reposts: number;
  saves: number;
  clicks: number;
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
    likes: number;
    comments: number;
    shares: number;
    reposts: number;
    saves: number;
    clicks: number;
  }> = [];

  const followerCountIsDailyDelta = options?.followerCountIsDailyDelta ?? false;

  for (const date of dates) {
    const values = byDate.get(date) ?? {};
    const reach = Math.round(values.reach ?? 0);
    const likes = Math.round(values.likes ?? 0);
    const comments = Math.round(values.comments ?? 0);
    const shares = Math.round(values.shares ?? 0);
    const reposts = Math.round(values.reposts ?? 0);
    const saves = Math.round(values.saves ?? 0);
    const clicks = Math.round(values.clicks ?? values.page_consumptions_clicks ?? 0);
    const interactionTotal =
      likes +
      comments +
      shares +
      reposts;
    const engagement = Math.round(
      interactionTotal ||
        values.total_interactions ||
        values.page_post_engagements ||
        values.post_engagements ||
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
      likes,
      comments,
      shares,
      reposts,
      saves,
      clicks,
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

/** Meta may return both `lead` and `onsite_conversion.lead_grouped` for the same event — count once per group. */
const CONVERSION_ACTION_GROUPS: string[][] = [
  ["onsite_conversion.lead_grouped", "lead"],
  ["offsite_conversion.fb_pixel_purchase", "purchase"],
  ["offsite_conversion.fb_pixel_lead", "offsite_conversion.lead"],
  [
    "onsite_conversion.messaging_conversation_started_7d",
    "messaging_conversation_started_7d",
    "onsite_conversion.messaging_conversation_started_1d",
  ],
  [
    "onsite_conversion.messaging_first_reply",
    "onsite_conversion.total_messaging_connection",
  ],
];

type InsightStatEntry = {
  action_type?: string;
  value?: string;
  indicator?: string;
  values?: Array<{ value?: string | number }>;
};

function parseInsightStatList(entries?: InsightStatEntry[]): number {
  if (!entries?.length) return 0;

  let total = 0;
  for (const entry of entries) {
    if (entry.value != null && entry.value !== "") {
      total += Math.round(Number(entry.value));
      continue;
    }
    const nested = entry.values?.[0]?.value;
    if (nested != null && nested !== "") {
      total += Math.round(Number(nested));
    }
  }
  return total;
}

export function parseConversions(
  actions?: Array<{ action_type?: string; value?: string }>,
): number {
  if (!actions?.length) return 0;

  const byType = new Map<string, number>();
  for (const action of actions) {
    if (!action.action_type) continue;
    byType.set(action.action_type, Math.round(Number(action.value ?? 0)));
  }

  let total = 0;
  for (const group of CONVERSION_ACTION_GROUPS) {
    for (const type of group) {
      const value = byType.get(type);
      if (value != null && value > 0) {
        total += value;
        break;
      }
    }
  }
  return total;
}

/** Prefer Meta `results` (Ads Manager “Results”); fall back to deduped `actions`. */
export function parseInsightConversions(insight: {
  results?: InsightStatEntry[];
  actions?: Array<{ action_type?: string; value?: string }>;
}): number {
  const fromResults = parseInsightStatList(insight.results);
  if (fromResults > 0) return fromResults;
  return parseConversions(insight.actions);
}

export function parseMetricInt(value: string | number | undefined): number {
  return Math.round(Number(value ?? 0));
}

export function parseMetricDecimal(value: string | number | undefined): number {
  return Number(Number(value ?? 0).toFixed(2));
}

export function parseSpend(value: string | number | undefined): number {
  return Math.round(Number(value ?? 0));
}

/** Meta can return attribution-only daily rows (0 delivery, non-zero results). Ads Manager omits these from daily breakdown. */
export function hasAdDeliveryMetrics(insight: {
  spend?: string | number;
  impressions?: string | number;
  clicks?: string | number;
}): boolean {
  return (
    parseSpend(insight.spend) > 0 ||
    parseMetricInt(insight.impressions) > 0 ||
    parseMetricInt(insight.clicks) > 0
  );
}
