import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

import { GrowthChartCard } from "./GrowthChartCard";
import type { GrowthDonutChartProps } from "../../types/components";
import { formatCompact } from "../../utils/shared/formatters";

export function GrowthDonutChart({
  title,
  description,
  data,
  centerLabel = "Total",
}: GrowthDonutChartProps) {
  const total = useMemo(
    () => data.reduce((sum, entry) => sum + entry.value, 0),
    [data],
  );

  const config = useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        data.map((entry) => [entry.key, { label: entry.label, color: entry.color }]),
      ),
    [data],
  );

  return (
    <GrowthChartCard
      title={title}
      description={description}
      isEmpty={total === 0}
      action={<LegendDots data={data} />}
    >
      <ChartContainer config={config} className="mx-auto aspect-square max-h-[240px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={62}
            outerRadius={92}
            strokeWidth={4}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} stroke="var(--card)" />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) {
                  return null;
                }
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-semibold"
                    >
                      {formatCompact(total)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      {centerLabel}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </GrowthChartCard>
  );
}

function LegendDots({ data }: { data: GrowthDonutChartProps["data"] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {data.map((entry) => (
        <div key={entry.key} className="flex items-center gap-2 text-xs">
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.label}</span>
          <span className="font-mono font-medium text-foreground">
            {formatCompact(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
