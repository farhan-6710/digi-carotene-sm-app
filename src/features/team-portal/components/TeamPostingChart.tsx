import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { teamPublishingComparisonData } from "@/shared/fixtures/teamSamples";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/shared/ui/chart";

const chartConfig = {
  currentMonth: {
    label: "Current Month",
    color: "var(--primary)",
  },
  previousMonth: {
    label: "Previous Month",
    color: "var(--accent)",
  },
} satisfies ChartConfig;

export function TeamPostingChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Publishing Performance
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Comparison of posts published day-by-day between this month and last month.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
          <TrendingUp className="size-3.5" />
          <span>+18.5% growth</span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
          <LineChart
            accessibilityLayer
            data={teamPublishingComparisonData}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-muted-foreground font-medium"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-muted-foreground font-medium"
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
                r: 4,
                fill: "var(--color-currentMonth)",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
                strokeWidth: 0,
              }}
            />
            <Line
              dataKey="previousMonth"
              type="monotone"
              stroke="var(--color-previousMonth)"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "var(--color-previousMonth)",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
                strokeWidth: 0,
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
