import { Button } from "@/shared/ui/button";

import type { CampaignLearningView } from "../../types/types";
import { LEARNING_MIN_HISTORY_DAYS } from "../../constants/campaignLearning";
import { kpiLabel } from "../../utils/defaultCampaignKpis";

type LearningBenchmarkStripProps = {
  view: CampaignLearningView;
  canApprove: boolean;
  onEdit: () => void;
  onHistory: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDismissNewBest: () => void;
};

function modeLabel(view: CampaignLearningView): string {
  const b = view.benchmark;
  if (!b) return "No benchmark";
  if (b.mode === "auto") {
    const method =
      b.method === "top3"
        ? "Top-3 windows"
        : b.method === "best"
          ? "Best window"
          : "80th percentile";
    return `Auto · ${method}`;
  }
  if (b.mode === "client_target") return "Client target";
  return "Manual";
}

export function LearningBenchmarkStrip({
  view,
  canApprove,
  onEdit,
  onHistory,
  onApprove,
  onReject,
  onDismissNewBest,
}: LearningBenchmarkStripProps) {
  const { learningMode, benchmark, pendingBenchmark, kpiConfig } = view;
  const windows =
    benchmark?.bestWindows
      .map((w) => `${w.start.slice(5)}–${w.end.slice(5)}`)
      .join(", ") ?? null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide">
          Benchmark · {modeLabel(view)}
        </span>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide">
          Learning mode: {learningMode.state}
        </span>
        {pendingBenchmark ? (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            Pending approval
          </span>
        ) : null}
        {benchmark?.needsReview ? (
          <span className="rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive">
            Needs review
          </span>
        ) : null}
      </div>

      {learningMode.state === "collecting" ? (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Learning mode needs more history before it can set a benchmark.</p>
          <p>
            Days of data {learningMode.daysOfData} / {LEARNING_MIN_HISTORY_DAYS}
          </p>
          <Button type="button" size="sm" onClick={onEdit}>
            Set manual benchmark
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {windows ? `Best periods: ${windows}` : "Manual / client target"}
          {" · "}
          Primary KPI: {kpiLabel(kpiConfig.primaryKpi)}
        </p>
      )}

      {learningMode.newBest ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm">
          <span className="font-medium text-emerald-700 dark:text-emerald-300">
            New best — campaign beat its benchmark for 7 days.
          </span>
          <Button type="button" size="sm" variant="outline" onClick={onEdit}>
            Review update
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onDismissNewBest}>
            Dismiss
          </Button>
        </div>
      ) : null}

      {pendingBenchmark && canApprove ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={onApprove}>
            Approve
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onReject}>
            Reject
          </Button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onEdit}>
          Edit benchmark
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onHistory}>
          History
        </Button>
      </div>
    </div>
  );
}
