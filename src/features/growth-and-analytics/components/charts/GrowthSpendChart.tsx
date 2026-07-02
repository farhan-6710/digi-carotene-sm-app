import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

import { getSpendTrendMaxAxisTicks } from "../../constants/spendTrend";
import { GrowthChartCard } from "./GrowthChartCard";
import type { GrowthSpendChartProps } from "../../types/components";
import { pickChartAxisTicks } from "../../utils/chartAxisTicks";
import { formatCompact } from "../../utils/formatters";

const chartConfig: ChartConfig = {
  spend: { label: "Spend", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--accent)" },
};

function useChartContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => {
      setWidth(element.getBoundingClientRect().width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

export function GrowthSpendChart({
  title,
  description,
  data,
  granularity,
}: GrowthSpendChartProps) {
  const { ref, width } = useChartContainerWidth();

  const axisTicks = useMemo(() => {
    const labels = data.map((point) => point.label);
    const maxTicks = getSpendTrendMaxAxisTicks(width);
    return pickChartAxisTicks(labels, maxTicks);
  }, [data, width]);

  const tooltipLabel = granularity === "day" ? "Date" : "Month";

  return (
    <GrowthChartCard
      title={title}
      description={description}
      isEmpty={data.length === 0}
    >
      <div ref={ref} className="w-full">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <ComposedChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="growthSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-spend)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-spend)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis
              dataKey="label"
              ticks={axisTicks}
              interval={0}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              className="text-muted-foreground font-medium"
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCompact(Number(value))}
              className="text-muted-foreground font-medium"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              className="text-muted-foreground font-medium"
            />
            <ChartTooltip
              shared
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `${tooltipLabel} · ${label}`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="spend"
              stroke="var(--color-spend)"
              strokeWidth={2}
              fill="url(#growthSpend)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="conversions"
              stroke="var(--color-conversions)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    </GrowthChartCard>
  );
}
