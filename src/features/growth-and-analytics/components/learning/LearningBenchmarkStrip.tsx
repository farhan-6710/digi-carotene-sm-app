import { Button } from "@/shared/ui/button";

import type { CampaignLearningView } from "../../types/types";
import { LEARNING_MIN_HISTORY_DAYS } from "../../constants/learning/campaignLearning";
import { kpiLabel } from "../../utils/learning/defaultCampaignKpis";

type LearningBenchmarkStripProps = {
  view: CampaignLearningView;
  canApprove: boolean;
  onEdit: () => void;
  onHistory: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDismissNewBest: () => void;
};

function benchmarkSummary(view: CampaignLearningView): string {
  const b = view.benchmark;
  if (!b) return "No benchmark yet";
  if (b.mode === "auto") {
    const method =
      b.method === "top3"
        ? "top 3 windows"
        : b.method === "best"
          ? "best window"
          : "80th percentile";
    return `Auto · ${method}`;
  }
  if (b.mode === "client_target") return "Client target";
  return "Manual target";
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
  const collecting = learningMode.state === "collecting";

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Benchmark</h3>
          <p className="text-sm text-muted-foreground">
            {collecting
              ? `Collecting history · ${learningMode.daysOfData} / ${LEARNING_MIN_HISTORY_DAYS} days`
              : `${benchmarkSummary(view)} · Primary ${kpiLabel(kpiConfig.primaryKpi)}`}
          </p>
          {benchmark?.needsReview ? (
            <p className="text-sm text-destructive">Needs review before trusting gaps.</p>
          ) : null}
          {pendingBenchmark ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              A new benchmark is waiting for approval.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" className="rounded-full" onClick={onEdit}>
            {benchmark ? "Edit benchmark" : "Set benchmark"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={onHistory}
          >
            History
          </Button>
        </div>
      </div>

      {collecting ? (
        <p className="text-sm text-muted-foreground">
          Learning needs more daily metrics before auto-benchmarks. You can still set a
          manual target now.
        </p>
      ) : null}

      {learningMode.newBest ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
          <p className="text-sm text-foreground">
            New best — this campaign beat its benchmark for 7 days.
          </p>
          <div className="flex gap-2">
            <Button type="button" size="sm" className="rounded-full" onClick={onEdit}>
              Review
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={onDismissNewBest}
            >
              Dismiss
            </Button>
          </div>
        </div>
      ) : null}

      {pendingBenchmark && canApprove ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" className="rounded-full" onClick={onApprove}>
            Approve pending
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={onReject}
          >
            Reject
          </Button>
        </div>
      ) : null}
    </div>
  );
}
