import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { usePublishingComparisonChart } from "@/features/team-portal/hooks/usePublishingComparisonChart";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { MonthSelector } from "@/shared/ui/MonthSelector";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/shared/ui/chart";

function formatGrowthLabel(
  growthPercent: number | null,
  compareLabel: string,
): string | null {
  if (growthPercent === null) {
    return null;
  }

  const rounded = Math.round(growthPercent * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}% vs ${compareLabel}`;
}

export function TeamPostingChart() {
  const {
    primary,
    compare,
    setPrimary,
    setCompare,
    chart,
    isLoading,
    error,
  } = usePublishingComparisonChart();

  const primaryLabel = chart?.currentMonthLabel ?? "Primary month";
  const compareLabel = chart?.previousMonthLabel ?? "Compare month";
  const growthLabel = formatGrowthLabel(
    chart?.growthPercent ?? null,
    compareLabel,
  );
  const isUp = (chart?.growthPercent ?? 0) >= 0;

  const chartConfig = {
    currentMonth: {
      label: primaryLabel,
      color: "var(--primary)",
    },
    previousMonth: {
      label: compareLabel,
      color: "var(--accent)",
    },
  } satisfies ChartConfig;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">
            Posts Publishing Comparison
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Posted posts by schedule day — pick any two months to compare.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MonthSelector
            year={primary.year}
            month={primary.month}
            onSelect={(date) =>
              setPrimary({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
              })
            }
          />
          <span className="text-xs text-muted-foreground">vs</span>
          <MonthSelector
            year={compare.year}
            month={compare.month}
            onSelect={(date) =>
              setCompare({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
              })
            }
          />
          {growthLabel ? (
            <div
              className={
                isUp
                  ? "flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
              }
            >
              {isUp ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              <span>{growthLabel}</span>
            </div>
          ) : null}
        </div>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <div className="h-[300px] w-full">
        {isLoading || !chart ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <LineChart
              accessibilityLayer
              data={chart.points}
              margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-border/50"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="font-medium text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="font-medium text-muted-foreground"
              />
              <ChartTooltip
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                content={<ChartTooltipContent />}
              />
              <Line
                dataKey="currentMonth"
                type="monotone"
                stroke="var(--color-currentMonth)"
                strokeWidth={3}
                dot={{
                  r: 3,
                  fill: "var(--color-currentMonth)",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 0,
                }}
              />
              <Line
                dataKey="previousMonth"
                type="monotone"
                stroke="var(--color-previousMonth)"
                strokeWidth={3}
                dot={{
                  r: 3,
                  fill: "var(--color-previousMonth)",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 0,
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
