import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/features/analytics/components/ChartCard";
import type { HorizontalBarChartProps } from "@/features/analytics/types/components";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

const chartConfig: ChartConfig = {
  value: { label: "Posts", color: "var(--primary)" },
};

export function HorizontalBarChart({
  title,
  description,
  data,
  color = "var(--primary)",
  emptyMessage,
}: HorizontalBarChartProps) {
  const chartHeight = Math.max(data.length * 44, 160);

  return (
    <ChartCard
      title={title}
      description={description}
      isEmpty={data.length === 0}
      emptyMessage={emptyMessage}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto w-full"
        style={{ height: chartHeight }}
      >
        <BarChart
          accessibilityLayer
          data={data}
          layout="vertical"
          margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={false}
            width={120}
            className="text-muted-foreground font-medium"
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            content={<ChartTooltipContent />}
          />
          <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} barSize={22} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
