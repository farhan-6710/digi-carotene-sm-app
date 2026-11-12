type MetricBag = Record<string, unknown>;

export function googleAdsMetricGet(
  metrics: MetricBag,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    if (key in metrics && metrics[key] != null) return metrics[key];
  }
  return null;
}

export function googleAdsParseInt(value: unknown): number {
  if (typeof value === "number") return Math.round(value);
  if (typeof value === "string" && value !== "" && !Number.isNaN(Number(value))) {
    return Math.round(Number(value));
  }
  return 0;
}

export function googleAdsMicrosToCurrency(micros: unknown): number {
  return Math.round((Number(micros ?? 0) / 1_000_000) * 100) / 100;
}

export function googleAdsRowHasDelivery(metrics: MetricBag): boolean {
  const spend = googleAdsMicrosToCurrency(
    googleAdsMetricGet(metrics, "costMicros", "cost_micros") ?? 0,
  );
  const impressions = googleAdsParseInt(
    googleAdsMetricGet(metrics, "impressions") ?? 0,
  );
  const clicks = googleAdsParseInt(googleAdsMetricGet(metrics, "clicks") ?? 0);
  return spend > 0 || impressions > 0 || clicks > 0;
}

export function googleAdsCpm(metrics: MetricBag): number {
  const avgCpm = googleAdsMetricGet(metrics, "averageCpm", "average_cpm");
  if (avgCpm != null) return googleAdsMicrosToCurrency(avgCpm);

  const impressions = googleAdsParseInt(
    googleAdsMetricGet(metrics, "impressions") ?? 0,
  );
  const spend = googleAdsMicrosToCurrency(
    googleAdsMetricGet(metrics, "costMicros", "cost_micros") ?? 0,
  );
  if (impressions <= 0) return 0;
  return Math.round((spend / impressions) * 1000 * 100) / 100;
}

export function mapGoogleCampaignStatus(status?: string | null): "Active" | "Paused" | "Completed" {
  const normalized = (status ?? "").trim().toUpperCase();
  if (normalized === "ENABLED") return "Active";
  if (normalized === "PAUSED") return "Paused";
  return "Completed";
}

export function googleAdsDateFilter(fromDate: string, toDate: string): string {
  if (fromDate === toDate) return `segments.date = '${fromDate}'`;
  return `segments.date BETWEEN '${fromDate}' AND '${toDate}'`;
}
