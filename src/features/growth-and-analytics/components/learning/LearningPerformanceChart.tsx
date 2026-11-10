import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CampaignBenchmark, CampaignKpiKey } from "../../types/types";
import { kpiLabel } from "../../utils/defaultCampaignKpis";

type LearningPerformanceChartProps = {
  points: Array<{ date: string; value: number | null }>;
  chartKpi: CampaignKpiKey;
  benchmark: CampaignBenchmark | null;
};

export function LearningPerformanceChart({
  points,
  chartKpi,
  benchmark,
}: LearningPerformanceChartProps) {
  const data = points.map((p) => ({
    date: p.date,
    value: p.value,
  }));
  const benchmarkValue = benchmark?.values[chartKpi] ?? null;
  const windows = benchmark?.mode === "auto" ? (benchmark.bestWindows ?? []) : [];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">
          {kpiLabel(chartKpi)} vs benchmark
        </h3>
        <p className="text-xs text-muted-foreground">
          Shaded = best periods used for the benchmark
        </p>
      </div>
      <div className="h-64 w-full">
        {data.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No daily metrics yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                minTickGap={24}
              />
              <YAxis tick={{ fontSize: 11 }} width={48} />
              <Tooltip />
              {windows.map((w) => (
                <ReferenceArea
                  key={`${w.start}-${w.end}`}
                  x1={w.start}
                  x2={w.end}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.08}
                />
              ))}
              {benchmarkValue !== null ? (
                <ReferenceLine
                  y={benchmarkValue}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 4"
                  label={{
                    value: "Benchmark",
                    position: "insideTopRight",
                    fontSize: 11,
                  }}
                />
              ) : null}
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
