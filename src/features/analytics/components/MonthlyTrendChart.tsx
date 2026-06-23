import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/features/analytics/components/ChartCard";
import type { MonthlyTrendChartProps } from "@/features/analytics/types/components";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

const chartConfig: ChartConfig = {
  posted: { label: "Posted", color: "var(--status-posted)" },
  scheduled: { label: "Scheduled", color: "var(--status-scheduled)" },
  notPosted: { label: "Not posted", color: "var(--status-not-posted)" },
};

export function MonthlyTrendChart({
  title,
  description,
  data,
}: MonthlyTrendChartProps) {
  const isEmpty = data.every(
    (entry) => entry.posted + entry.scheduled + entry.notPosted === 0,
  );

  return (
    <ChartCard title={title} description={description} isEmpty={isEmpty}>
      <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
        <BarChart accessibilityLayer data={data} margin={{ left: -16, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-muted-foreground font-medium"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
            className="text-muted-foreground font-medium"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="posted" stackId="a" fill="var(--color-posted)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="scheduled" stackId="a" fill="var(--color-scheduled)" />
          <Bar dataKey="notPosted" stackId="a" fill="var(--color-notPosted)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
