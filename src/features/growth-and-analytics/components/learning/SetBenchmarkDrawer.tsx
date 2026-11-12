import { useMemo, useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

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

type FormProps = {
  view: CampaignLearningView;
  dailyRows: CampaignMetricRow[];
  onSave: SetBenchmarkDrawerProps["onSave"];
  onClose: () => void;
};

function SetBenchmarkForm({ view, dailyRows, onSave, onClose }: FormProps) {
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

  const previewValues = mode === "auto" ? preview.values : manualValues;
  const kpiKeys: CampaignKpiKey[] = [
    view.kpiConfig.primaryKpi,
    ...view.kpiConfig.secondaryKpis,
  ];

  const handleSave = async () => {
    if (mode === "manual" && !reason.trim()) return;
    if (mode === "auto" && preview.status === "insufficient_data") return;

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
    <div className="mt-4 space-y-5 px-1 pb-8">
      <p className="text-sm text-muted-foreground">
        {view.campaignName} · Primary: {kpiLabel(view.kpiConfig.primaryKpi)}
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["auto", "Auto — best performance"],
            ["manual", "Manual"],
            ["client_target", "Client target"],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={mode === value ? "default" : "outline"}
            onClick={() => setMode(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {mode === "auto" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="bench-method">Method</Label>
            <select
              id="bench-method"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={method}
              onChange={(e) => setMethod(e.target.value as BenchmarkMethod)}
            >
              <option value="top3">Average of top 3 windows</option>
              <option value="best">Single best window</option>
              <option value="p80">80th percentile</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bench-window">Window length</Label>
            <select
              id="bench-window"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={windowDays}
              onChange={(e) => setWindowDays(Number(e.target.value))}
            >
              {BENCHMARK_WINDOW_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d} days
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bench-lookback">Look back</Label>
            <select
              id="bench-lookback"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={lookbackDays}
              onChange={(e) => setLookbackDays(Number(e.target.value))}
            >
              {BENCHMARK_LOOKBACK_DAYS.map((d) => (
                <option key={d} value={d}>
                  Last {d} days
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bench-min">Min results / window</Label>
            <Input
              id="bench-min"
              type="number"
              min={1}
              value={minResults}
              onChange={(e) => setMinResults(Number(e.target.value) || 1)}
            />
          </div>
        </div>
      ) : null}

      {mode === "auto" && preview.status === "insufficient_data" ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
          Not enough history for an automatic benchmark yet. Switch to Manual or
          wait for more data.
        </p>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium">Preview</p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2">KPI</th>
                <th className="px-3 py-2">Benchmark</th>
              </tr>
            </thead>
            <tbody>
              {kpiKeys.map((key) => (
                <tr key={key} className="border-t border-border">
                  <td className="px-3 py-2">{kpiLabel(key)}</td>
                  <td className="px-3 py-2">
                    {mode === "auto" ? (
                      <span className="font-mono tabular-nums">
                        {previewValues[key]?.toFixed(2) ?? "—"}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mode === "auto" && preview.windows.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Best windows:{" "}
            {preview.windows.map((w) => `${w.start}–${w.end}`).join(", ")}
          </p>
        ) : null}
      </div>

      {mode === "client_target" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="agreed-with">Agreed with</Label>
            <Input
              id="agreed-with"
              value={agreedWith}
              onChange={(e) => setAgreedWith(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agreed-on">Agreed on</Label>
            <Input
              id="agreed-on"
              type="date"
              value={agreedOn}
              onChange={(e) => setAgreedOn(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="bench-reason">
          Reason / note{mode === "manual" ? " *" : ""}
        </Label>
        <Input
          id="bench-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Best month before the Diwali offer ended"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={suggestUpdates}
          onChange={(e) => setSuggestUpdates(e.target.checked)}
        />
        Suggest an update when the campaign beats this benchmark for 7 days
      </label>
      {mode === "auto" ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
          />
          Auto-advance without asking
        </label>
      ) : null}

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={
            saving ||
            (mode === "manual" && !reason.trim()) ||
            (mode === "auto" && preview.status === "insufficient_data") ||
            (mode !== "auto" &&
              (manualValues[view.kpiConfig.primaryKpi] ?? 0) <= 0)
          }
        >
          {saving ? "Saving…" : "Save benchmark"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
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
      <SheetContent className="w-full overflow-y-auto sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>Set benchmark</SheetTitle>
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
