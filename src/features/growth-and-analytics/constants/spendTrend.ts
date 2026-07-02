/** Daily points when the selected span is at most this many days; otherwise monthly. */
export const SPEND_TREND_DAILY_MAX_DAYS = 45;

export function getSpendTrendMaxAxisTicks(chartWidth: number): number {
  if (chartWidth < 400) return 5;
  if (chartWidth < 640) return 7;
  if (chartWidth < 1024) return 9;
  return 12;
}
