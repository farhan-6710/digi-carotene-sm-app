import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

import type { CampaignBenchmark, CampaignKpiKey } from "../../types/types";
import { GrowthChartCard } from "../charts/GrowthChartCard";
import { kpiLabel } from "../../utils/learning/defaultCampaignKpis";
import {
  frequencyRangeMid,
  readFrequencyRange,
} from "../../utils/learning/gapStatus";
import { formatCompact } from "../../utils/shared/formatters";

type LearningPerformanceChartProps = {
  points: Array<{ date: string; value: number | null }>;
  chartKpi: CampaignKpiKey;
  benchmark: CampaignBenchmark | null;
  currencyCode?: string;
};

const chartConfig: ChartConfig = {
  value: { label: "Actual", color: "var(--chart-1)" },
  benchmark: { label: "Benchmark", color: "var(--muted-foreground)" },
};

function shortDate(iso: string): string {
  const parts = iso.slice(0, 10).split("-");
  if (parts.length !== 3) return iso;
  return `${parts[1]}/${parts[2]}`;
}

export function LearningPerformanceChart({
  points,
  chartKpi,
  benchmark,
}: LearningPerformanceChartProps) {
  const data = useMemo(
    () =>
      points.map((p) => ({
        date: p.date,
        label: shortDate(p.date),
        value: p.value,
      })),
    [points],
  );

  const plottedCount = data.filter((d) => d.value !== null).length;
  const freqRange =
    chartKpi === "frequency" ? readFrequencyRange(benchmark?.values) : null;
  const benchmarkValue =
    chartKpi === "frequency"
      ? frequencyRangeMid(freqRange)
      : (benchmark?.values[chartKpi] ?? null);
  const windows =
    benchmark?.mode === "auto" ? (benchmark.bestWindows ?? []) : [];
  const showDots = plottedCount > 0 && plottedCount <= 14;

  const description =
    chartKpi === "frequency" && freqRange && freqRange.min !== freqRange.max
      ? "Shaded horizontal band is the ideal frequency range."
      : benchmark?.mode === "auto" && windows.length > 0
        ? "Shaded ranges are the periods used for the auto benchmark."
        : "Daily values for the selected KPI in the range above.";

  return (
    <GrowthChartCard
      title={`${kpiLabel(chartKpi)} vs benchmark`}
      description={description}
      isEmpty={plottedCount === 0}
      emptyMessage={
        data.length === 0
          ? "No daily metrics in this range yet."
          : "No values for this KPI on these days (often means zero spend or results)."
      }
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
        <LineChart data={data} margin={{ left: -8, right: 12, top: 8, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            className="stroke-border/50"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
            className="text-muted-foreground font-medium"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={44}
            tickFormatter={(value) => formatCompact(Number(value))}
            className="text-muted-foreground font-medium"
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as
                    | { date?: string }
                    | undefined;
                  return row?.date ?? "";
                }}
              />
            }
          />
          {windows.map((w) => (
            <ReferenceArea
              key={`${w.start}-${w.end}`}
              x1={shortDate(w.start)}
              x2={shortDate(w.end)}
              fill="var(--chart-1)"
              fillOpacity={0.1}
            />
          ))}
          {freqRange && freqRange.min !== freqRange.max ? (
            <ReferenceArea
              y1={freqRange.min}
              y2={freqRange.max}
              fill="var(--chart-1)"
              fillOpacity={0.12}
            />
          ) : null}
          {benchmarkValue !== null ? (
            <ReferenceLine
              y={benchmarkValue}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: freqRange && freqRange.min !== freqRange.max ? "Ideal mid" : "Benchmark",
                position: "insideTopRight",
                fontSize: 11,
                fill: "var(--muted-foreground)",
              }}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="value"
            name="Actual"
            stroke="var(--color-value)"
            strokeWidth={2}
            connectNulls
            dot={showDots ? { r: 3, strokeWidth: 0, fill: "var(--color-value)" } : false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </GrowthChartCard>
  );
}
