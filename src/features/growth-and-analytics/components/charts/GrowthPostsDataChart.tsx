import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";
import { ComboBox } from "@/shared/ui/ComboBox";

import { GrowthChartCard } from "./GrowthChartCard";
import type { GrowthPostsDataChartProps } from "../../types/components";
import {
  DASHBOARD_POSTS_DATA_METRICS,
  type DashboardPostsDataMetric,
} from "../../constants/dashboard/dashboardPostsData";
import { buildPostsDataTrend } from "../../utils/dashboard/dashboardPostsData";
import { formatCompact } from "../../utils/shared/formatters";

const metricOptions = DASHBOARD_POSTS_DATA_METRICS.map((metric) => ({
  value: metric.id,
  label: metric.label,
}));

export function GrowthPostsDataChart({
  title,
  description,
  rows,
}: GrowthPostsDataChartProps) {
  const [metric, setMetric] = useState<DashboardPostsDataMetric>("reach");

  const data = useMemo(() => buildPostsDataTrend(rows, metric), [rows, metric]);

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      value: {
        label:
          metricOptions.find((option) => option.value === metric)?.label ??
          "Value",
        color: "var(--chart-1)",
      },
    }),
    [metric],
  );

  const selectedLabel =
    metricOptions.find((option) => option.value === metric)?.label ?? "Metric";

  return (
    <GrowthChartCard
      title={title}
      description={description}
      isEmpty={data.length === 0}
      action={
        <div className="w-[160px]">
          <ComboBox
            value={metric}
            onChange={(value) => setMetric(value as DashboardPostsDataMetric)}
            options={metricOptions}
            listTitle="Metric"
            mode="value"
          />
        </div>
      }
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
        <AreaChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="growthPostsDataMetric" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-muted-foreground font-medium"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => formatCompact(Number(value))}
            className="text-muted-foreground font-medium"
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatCompact(Number(value))}
                labelFormatter={(label) => `${selectedLabel} · ${label}`}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill="url(#growthPostsDataMetric)"
          />
        </AreaChart>
      </ChartContainer>
    </GrowthChartCard>
  );
}
