import { useCallback } from "react";

import { fetchBenchmarkHistory } from "@/services/campaignLearningService";
import { useFetch } from "@/shared/hooks/useFetch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import type { CampaignBenchmark } from "../../types/types";

type BenchmarkHistorySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adAccountId: string;
  campaignId: string;
};

export function BenchmarkHistorySheet({
  open,
  onOpenChange,
  adAccountId,
  campaignId,
}: BenchmarkHistorySheetProps) {
  const load = useCallback(async (): Promise<CampaignBenchmark[]> => {
    if (!open || !adAccountId || !campaignId) return [];
    return fetchBenchmarkHistory(adAccountId, campaignId);
  }, [open, adAccountId, campaignId]);

  const { data: rows, isLoading } = useFetch(load, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[420px]">
        <SheetHeader>
          <SheetTitle>Benchmark history</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3 px-1 pb-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No benchmarks yet.</p>
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-border p-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase">
                    {row.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {row.mode}
                    {row.method ? ` · ${row.method}` : ""}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                  {new Date(row.createdAt).toLocaleString()}
                </p>
                {row.reason ? (
                  <p className="mt-2 text-muted-foreground">{row.reason}</p>
                ) : null}
                <pre className="mt-2 overflow-x-auto rounded bg-muted/40 p-2 font-mono text-[11px]">
                  {JSON.stringify(row.values, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
