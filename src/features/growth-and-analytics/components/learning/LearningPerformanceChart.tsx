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

import type {
  BenchmarkValues,
  CampaignBenchmark,
  CampaignKpiKey,
} from "../../types/types";
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
  /** Used when no benchmark is saved. */
  fallbackValues?: BenchmarkValues | null;
  currencyCode?: string;
};

const chartConfig: ChartConfig = {
  value: { label: "Actual", color: "var(--chart-1)" },
  benchmark: { label: "Benchmark", color: "var(--muted-foreground)" },
};

const RATIO_KEYS = new Set<CampaignKpiKey>([
  "ctr",
  "conversion_rate",
  "search_impression_share",
]);

function shortDate(iso: string): string {
  const parts = iso.slice(0, 10).split("-");
  if (parts.length !== 3) return iso;
  return `${parts[1]}/${parts[2]}`;
}

/** Axis / tooltip labels. Ratios stay as percent so small CTRs do not round to 0. */
function formatChartValue(key: CampaignKpiKey, value: number): string {
  if (RATIO_KEYS.has(key)) {
    return `${(value * 100).toFixed(2)}%`;
  }
  if (key === "frequency" || key === "results_per_day" || key === "roas") {
    return value.toFixed(2);
  }
  if (Math.abs(value) > 0 && Math.abs(value) < 10) {
    return value.toFixed(2);
  }
  return formatCompact(value);
}

export function LearningPerformanceChart({
  points,
  chartKpi,
  benchmark,
  fallbackValues = null,
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
  const values = benchmark?.values ?? fallbackValues;
  const usingDefault = !benchmark && fallbackValues !== null;
  const freqRange =
    chartKpi === "frequency" ? readFrequencyRange(values) : null;
  const benchmarkValue =
    chartKpi === "frequency"
      ? frequencyRangeMid(freqRange)
      : (values?.[chartKpi] ?? null);
  const windows =
    benchmark?.mode === "auto" ? (benchmark.bestWindows ?? []) : [];
  const showDots = plottedCount > 0 && plottedCount <= 14;
  const yNumbers = data
    .map((row) => row.value)
    .filter((value): value is number => value !== null && Number.isFinite(value));
  if (benchmarkValue !== null) yNumbers.push(benchmarkValue);
  if (freqRange) yNumbers.push(freqRange.min, freqRange.max);
  const yDomain = (() => {
    if (yNumbers.length === 0) return undefined;
    const min = Math.min(...yNumbers);
    const max = Math.max(...yNumbers);
    const pad = (max - min) * 0.1 || Math.abs(max) * 0.1 || 1;
    return [Math.max(0, min - pad), max + pad] as [number, number];
  })();

  const description =
    usingDefault
      ? "Dashed line is the default benchmark from the full history. Day filters do not move it."
      : chartKpi === "frequency" && freqRange && freqRange.min !== freqRange.max
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
            width={52}
            domain={yDomain}
            tickFormatter={(value) => formatChartValue(chartKpi, Number(value))}
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
                formatter={(value) =>
                  formatChartValue(chartKpi, Number(value))
                }
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
                value:
                  usingDefault
                    ? "Default"
                    : freqRange && freqRange.min !== freqRange.max
                      ? "Ideal mid"
                      : "Benchmark",
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
