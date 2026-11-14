type MetricLike = {
  spend: number;
  impressions: number;
  reach?: number;
  clicks: number;
  conversions: number;
  metricDate?: string;
  date?: string;
};

export function filterByDateRange<T extends { metricDate?: string; date?: string }>(
  rows: T[],
  from?: string,
  to?: string,
): T[] {
  return rows.filter((row) => {
    const day = row.metricDate ?? row.date ?? "";
    if (!day) return true;
    if (from && day < from) return false;
    if (to && day > to) return false;
    return true;
  });
}

export function aggregateMetricRows(rows: MetricLike[]) {
  const spend = rows.reduce((sum, row) => sum + Number(row.spend ?? 0), 0);
  const impressions = rows.reduce(
    (sum, row) => sum + Number(row.impressions ?? 0),
    0,
  );
  const reach = rows.reduce((sum, row) => sum + Number(row.reach ?? 0), 0);
  const clicks = rows.reduce((sum, row) => sum + Number(row.clicks ?? 0), 0);
  const conversions = rows.reduce(
    (sum, row) => sum + Number(row.conversions ?? 0),
    0,
  );
  const ctr =
    impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
  const cpc = clicks > 0 ? Number((spend / clicks).toFixed(2)) : 0;
  const cpa = conversions > 0 ? Number((spend / conversions).toFixed(2)) : 0;

  return {
    days: rows.length,
    spend: Number(spend.toFixed(2)),
    impressions,
    reach,
    clicks,
    conversions,
    ctr,
    cpc,
    cpa,
  };
}
