import type {
  AdMetricRow,
  AdsetMetricRow,
  CampaignMetricRow,
  DailyMetricRow,
  GrowthDateRange,
  InteractionTotals,
  PostRow,
} from "../types/types";

function isDateInRange(date: string, range: GrowthDateRange): boolean {
  if (!range.from && !range.to) {
    return true;
  }

  if (range.from && date < range.from) {
    return false;
  }

  if (range.to && date > range.to) {
    return false;
  }

  return true;
}

export function filterMetricsByRange(
  rows: DailyMetricRow[],
  range: GrowthDateRange,
): DailyMetricRow[] {
  return rows.filter((row) => isDateInRange(row.date, range));
}

export function filterPostsByRange(
  posts: PostRow[],
  range: GrowthDateRange,
): PostRow[] {
  return posts.filter((post) =>
    isDateInRange(post.postedAt.slice(0, 10), range),
  );
}

export function filterCampaignMetricsByRange(
  rows: CampaignMetricRow[],
  range: GrowthDateRange,
): CampaignMetricRow[] {
  return rows.filter((row) => isDateInRange(row.date, range));
}

export function filterAdsetMetricsByRange(
  rows: AdsetMetricRow[],
  range: GrowthDateRange,
): AdsetMetricRow[] {
  return rows.filter((row) => isDateInRange(row.date, range));
}

export function filterAdMetricsByRange(
  rows: AdMetricRow[],
  range: GrowthDateRange,
): AdMetricRow[] {
  return rows.filter((row) => isDateInRange(row.date, range));
}

export function sumInteractionTotals(rows: DailyMetricRow[]): InteractionTotals {
  return rows.reduce<InteractionTotals>(
    (totals, row) => ({
      likes: totals.likes + row.likes,
      comments: totals.comments + row.comments,
      saves: totals.saves + row.saves,
      shares: totals.shares + row.shares,
      reposts: totals.reposts + row.reposts,
      views: totals.views + row.impressions,
    }),
    { likes: 0, comments: 0, saves: 0, shares: 0, reposts: 0, views: 0 },
  );
}
