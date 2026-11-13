import { useMemo, useState } from "react";

import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { Switch } from "@/shared/ui/switch";
import { cn } from "@/shared/lib/utils";

import {
  BENCHMARK_DEFAULT_LOOKBACK_DAYS,
  BENCHMARK_DEFAULT_METHOD,
  BENCHMARK_DEFAULT_MIN_RESULTS,
  BENCHMARK_DEFAULT_WINDOW_DAYS,
  BENCHMARK_LOOKBACK_DAYS,
  BENCHMARK_WINDOW_DAYS,
} from "../../constants/learning/campaignLearning";
import type {
  BenchmarkMethod,
  BenchmarkMode,
  BenchmarkValues,
  CampaignKpiKey,
  CampaignLearningView,
  CampaignMetricRow,
  SaveBenchmarkInput,
} from "../../types/types";
import { computeAutoBenchmark } from "../../utils/learning/autoBenchmark";
import { kpiLabel } from "../../utils/learning/defaultCampaignKpis";
import {
  computeFrequencyRangeGap,
  formatGapPercent,
  frequencyRangeMid,
  readFrequencyRange,
} from "../../utils/learning/gapStatus";
import { kpisFromMetricRows, readKpiValue } from "../../utils/learning/kpiFromMetrics";

type SetBenchmarkDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view: CampaignLearningView;
  dailyRows: CampaignMetricRow[];
  onSave: (
    input: Omit<
      SaveBenchmarkInput,
      | "adAccountId"
      | "campaignId"
      | "platform"
      | "currency"
      | "requireApproval"
      | "createdBy"
    >,
  ) => Promise<void>;
};

const MODE_OPTIONS: Array<{ value: BenchmarkMode; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" },
  { value: "client_target", label: "Client target" },
];

const selectClassName =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function SetBenchmarkForm({
  view,
  dailyRows,
  onSave,
  onClose,
}: {
  view: CampaignLearningView;
  dailyRows: CampaignMetricRow[];
  onSave: SetBenchmarkDrawerProps["onSave"];
  onClose: () => void;
}) {
  const [mode, setMode] = useState<BenchmarkMode>(
    view.benchmark?.mode ?? "auto",
  );
  const [method, setMethod] = useState<BenchmarkMethod>(
    view.benchmark?.method ?? BENCHMARK_DEFAULT_METHOD,
  );
  const [windowDays, setWindowDays] = useState(
    view.benchmark?.windowDays ?? BENCHMARK_DEFAULT_WINDOW_DAYS,
  );
  const [lookbackDays, setLookbackDays] = useState(
    view.benchmark?.lookbackDays ?? BENCHMARK_DEFAULT_LOOKBACK_DAYS,
  );
  const [minResults, setMinResults] = useState(
    view.benchmark?.minResults ?? BENCHMARK_DEFAULT_MIN_RESULTS,
  );
  const [manualValues, setManualValues] = useState<BenchmarkValues>(
    view.benchmark?.values ?? {},
  );
  const [reason, setReason] = useState(view.benchmark?.reason ?? "");
  const [agreedWith, setAgreedWith] = useState(
    view.benchmark?.agreedWith ?? "",
  );
  const [agreedOn, setAgreedOn] = useState(view.benchmark?.agreedOn ?? "");
  const [autoAdvance, setAutoAdvance] = useState(
    view.benchmark?.autoAdvance ?? false,
  );
  const [suggestUpdates, setSuggestUpdates] = useState(
    view.benchmark?.suggestUpdates ?? true,
  );
  const [saving, setSaving] = useState(false);

  const preview = useMemo(
    () =>
      computeAutoBenchmark(dailyRows, {
        windowDays,
        lookbackDays,
        minResults,
        method,
        primaryKpi: view.kpiConfig.primaryKpi,
        primaryDirection: view.kpiConfig.primaryDirection,
        lastGoalChangeAt: view.kpiConfig.lastGoalChangeAt,
      }),
    [
      dailyRows,
      windowDays,
      lookbackDays,
      minResults,
      method,
      view.kpiConfig,
    ],
  );

  const current7d = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const from = new Date(`${today}T00:00:00Z`);
    from.setUTCDate(from.getUTCDate() - 6);
    const fromStr = from.toISOString().slice(0, 10);
    const rows = dailyRows.filter((r) => r.date.slice(0, 10) >= fromStr);
    return kpisFromMetricRows(rows);
  }, [dailyRows]);

  const previewValues = mode === "auto" ? preview.values : manualValues;
  const kpiKeys: CampaignKpiKey[] = [
    view.kpiConfig.primaryKpi,
    ...view.kpiConfig.secondaryKpis.filter(
      (k) => k !== view.kpiConfig.primaryKpi,
    ),
  ];

  const frequencyOk =
    view.kpiConfig.primaryKpi !== "frequency" &&
    !view.kpiConfig.secondaryKpis.includes("frequency")
      ? true
      : mode === "auto"
        ? true
        : (() => {
            const min = manualValues.frequency_min;
            const max = manualValues.frequency_max;
            return (
              typeof min === "number" &&
              typeof max === "number" &&
              min > 0 &&
              max >= min
            );
          })();

  const primaryOk =
    mode === "auto"
      ? true
      : view.kpiConfig.primaryKpi === "frequency"
        ? frequencyOk
        : (manualValues[view.kpiConfig.primaryKpi] ?? 0) > 0;

  const canSave =
    !saving &&
    !(mode === "manual" && !reason.trim()) &&
    !(mode === "auto" && preview.status === "insufficient_data") &&
    primaryOk &&
    (mode === "auto" || frequencyOk);

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({
        mode,
        method: mode === "auto" ? method : null,
        windowDays: mode === "auto" ? windowDays : null,
        lookbackDays: mode === "auto" ? lookbackDays : null,
        minResults: mode === "auto" ? minResults : null,
        values: previewValues,
        bestWindows: mode === "auto" ? preview.windows : [],
        eligibleWindows: mode === "auto" ? preview.eligible : 0,
        excluded: mode === "auto" ? preview.excluded : {},
        reason: reason.trim() || null,
        agreedWith: mode === "client_target" ? agreedWith.trim() || null : null,
        agreedOn: mode === "client_target" ? agreedOn || null : null,
        autoAdvance: mode === "auto" ? autoAdvance : false,
        suggestUpdates,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {MODE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              size="sm"
              variant="outline"
              className={cn(
                "rounded-full",
                mode === opt.value &&
                  "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              )}
              onClick={() => setMode(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {mode === "auto" ? (
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Auto settings
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Built from this campaign’s own best periods.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Method" htmlFor="bench-method">
                <select
                  id="bench-method"
                  className={selectClassName}
                  value={method}
                  onChange={(e) => setMethod(e.target.value as BenchmarkMethod)}
                >
                  <option value="top3">Average of top 3</option>
                  <option value="best">Single best window</option>
                  <option value="p80">80th percentile</option>
                </select>
              </Field>
              <Field label="Window length" htmlFor="bench-window">
                <select
                  id="bench-window"
                  className={selectClassName}
                  value={windowDays}
                  onChange={(e) => setWindowDays(Number(e.target.value))}
                >
                  {BENCHMARK_WINDOW_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Look back" htmlFor="bench-lookback">
                <select
                  id="bench-lookback"
                  className={selectClassName}
                  value={lookbackDays}
                  onChange={(e) => setLookbackDays(Number(e.target.value))}
                >
                  {BENCHMARK_LOOKBACK_DAYS.map((d) => (
                    <option key={d} value={d}>
                      Last {d} days
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Min results / window" htmlFor="bench-min">
                <Input
                  id="bench-min"
                  type="number"
                  min={1}
                  value={minResults}
                  onChange={(e) => setMinResults(Number(e.target.value) || 1)}
                />
              </Field>
            </div>
            {preview.status === "insufficient_data" ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-800 dark:text-amber-200">
                Not enough history for auto yet.{" "}
                <button
                  type="button"
                  className="font-medium underline underline-offset-2"
                  onClick={() => setMode("manual")}
                >
                  Switch to Manual
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {mode === "auto" ? "Preview" : "Target values"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Current is the last 7 days. Frequency uses a min–max ideal band;
              other KPIs use a single target. Gap rules match the Learning cards.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5 font-medium">KPI</th>
                  <th className="px-3 py-2.5 font-medium">Target</th>
                  <th className="px-3 py-2.5 font-medium">Current 7d</th>
                  <th className="px-3 py-2.5 font-medium">Gap</th>
                </tr>
              </thead>
              <tbody>
                {kpiKeys.map((key) => {
                  const current = readKpiValue(current7d, key);
                  const freqRange =
                    key === "frequency"
                      ? readFrequencyRange(previewValues)
                      : null;
                  const target =
                    key === "frequency"
                      ? frequencyRangeMid(freqRange)
                      : readKpiValue(previewValues, key);
                  const card = view.kpis.find((k) => k.key === key);
                  const direction = card?.direction ?? "higher";
                  let gap: number | null = null;
                  if (key === "frequency" && current !== null && freqRange) {
                    gap = computeFrequencyRangeGap(
                      current,
                      freqRange.min,
                      freqRange.max,
                    );
                  } else if (target !== null && current !== null && target !== 0) {
                    gap =
                      direction === "lower"
                        ? (target - current) / target
                        : (current - target) / target;
                  }
                  return (
                    <tr key={key} className="border-t border-border">
                      <td className="px-3 py-2.5">
                        <span className="font-medium text-foreground">
                          {kpiLabel(key)}
                        </span>
                        {key === view.kpiConfig.primaryKpi ? (
                          <span className="ml-1 text-xs text-muted-foreground">
                            Primary
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5">
                        {key === "frequency" ? (
                          mode === "auto" ? (
                            <span className="tabular-nums text-foreground">
                              {freqRange
                                ? freqRange.min === freqRange.max
                                  ? freqRange.min.toFixed(2)
                                  : `${freqRange.min.toFixed(2)}–${freqRange.max.toFixed(2)}`
                                : "—"}
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <Input
                                type="number"
                                step="any"
                                min={0}
                                className="h-8 w-[4.5rem]"
                                placeholder="Min"
                                aria-label="Frequency min"
                                value={manualValues.frequency_min ?? ""}
                                onChange={(e) =>
                                  setManualValues((prev) => {
                                    const min =
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value);
                                    const max = prev.frequency_max;
                                    const mid =
                                      min != null && max != null
                                        ? (min + max) / 2
                                        : min;
                                    return {
                                      ...prev,
                                      frequency_min: min,
                                      frequency: mid,
                                    };
                                  })
                                }
                              />
                              <span className="text-xs text-muted-foreground">–</span>
                              <Input
                                type="number"
                                step="any"
                                min={0}
                                className="h-8 w-[4.5rem]"
                                placeholder="Max"
                                aria-label="Frequency max"
                                value={manualValues.frequency_max ?? ""}
                                onChange={(e) =>
                                  setManualValues((prev) => {
                                    const max =
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value);
                                    const min = prev.frequency_min;
                                    const mid =
                                      min != null && max != null
                                        ? (min + max) / 2
                                        : max;
                                    return {
                                      ...prev,
                                      frequency_max: max,
                                      frequency: mid,
                                    };
                                  })
                                }
                              />
                            </div>
                          )
                        ) : mode === "auto" ? (
                          <span className="tabular-nums text-foreground">
                            {target?.toFixed(2) ?? "—"}
                          </span>
                        ) : (
                          <Input
                            type="number"
                            step="any"
                            className="h-8"
                            value={manualValues[key] ?? ""}
                            onChange={(e) =>
                              setManualValues((prev) => ({
                                ...prev,
                                [key]:
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                              }))
                            }
                          />
                        )}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                        {current?.toFixed(2) ?? "—"}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                        {formatGapPercent(gap)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {mode === "auto" && preview.windows.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              Best windows:{" "}
              {preview.windows.map((w) => `${w.start}–${w.end}`).join(", ")}
              {preview.eligible > 0
                ? ` · ${preview.eligible} eligible windows`
                : null}
            </p>
          ) : null}
        </section>

        {mode === "client_target" ? (
          <section className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
            <Field label="Agreed with" htmlFor="agreed-with">
              <Input
                id="agreed-with"
                value={agreedWith}
                onChange={(e) => setAgreedWith(e.target.value)}
                placeholder="Client contact name"
              />
            </Field>
            <Field label="Agreed on" htmlFor="agreed-on">
              <Input
                id="agreed-on"
                type="date"
                value={agreedOn}
                onChange={(e) => setAgreedOn(e.target.value)}
              />
            </Field>
          </section>
        ) : null}

        <Field
          label={mode === "manual" ? "Reason / note *" : "Reason / note"}
          htmlFor="bench-reason"
          hint={
            mode === "manual"
              ? "Required for manual benchmarks."
              : "Optional context for the team."
          }
        >
          <Input
            id="bench-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Best month before the Diwali offer ended"
          />
        </Field>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <label className="flex items-start gap-3 text-sm">
            <Checkbox
              checked={suggestUpdates}
              onCheckedChange={(checked) =>
                setSuggestUpdates(checked === true)
              }
              className="mt-0.5"
            />
            <span>
              <span className="font-medium text-foreground">
                Suggest an update
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                When the campaign beats this benchmark for 7 days.
              </span>
            </span>
          </label>
          {mode === "auto" ? (
            <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Auto-advance
                </p>
                <p className="text-xs text-muted-foreground">
                  Apply new best without asking.
                </p>
              </div>
              <Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} />
            </div>
          ) : null}
        </section>
      </div>

      <SheetFooter className="border-t border-border sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="rounded-full"
          onClick={handleSave}
          disabled={!canSave}
        >
          {saving ? "Saving…" : "Save benchmark"}
        </Button>
      </SheetFooter>
    </>
  );
}

export function SetBenchmarkDrawer({
  open,
  onOpenChange,
  view,
  dailyRows,
  onSave,
}: SetBenchmarkDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
      >
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle>Set benchmark</SheetTitle>
          <SheetDescription>
            {view.campaignName} · Primary {kpiLabel(view.kpiConfig.primaryKpi)}
          </SheetDescription>
        </SheetHeader>
        {open ? (
          <SetBenchmarkForm
            key={view.benchmark?.id ?? "new"}
            view={view}
            dailyRows={dailyRows}
            onSave={onSave}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
