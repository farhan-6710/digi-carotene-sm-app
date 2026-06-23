import { useCallback, useMemo, useState } from "react";

import type {
  ClientReportSummary,
  ReportDateRange,
  ReportPostRow,
  ReportStatCard,
} from "@/features/reports/types/types";
import {
  fetchPostsForDateRange,
  formatReportDateRangeLabel,
  toReportDateString,
} from "@/features/reports/utils/reportsRepository";
import {
  buildClientReportSummaries,
  buildReportStatCards,
  flattenReportRows,
} from "@/features/reports/utils/reportsUtils";
import {
  resolveStatusesForFetch,
  type PostStatusFilterState,
} from "@/shared/utils/postStatusFilterUtils";

export function useReportsQuery() {
  const [appliedRange, setAppliedRange] = useState<ReportDateRange>({
    from: undefined,
    to: undefined,
  });
  const [summaries, setSummaries] = useState<ClientReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const loadReport = useCallback(
    async (from: Date, to: Date, statusFilter: PostStatusFilterState) => {
      setIsLoading(true);
      setError(null);

      try {
        const posts = await fetchPostsForDateRange(
          toReportDateString(from),
          toReportDateString(to),
          resolveStatusesForFetch(statusFilter),
        );

        setSummaries(buildClientReportSummaries(posts));
        setAppliedRange({ from, to });
        setHasGenerated(true);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Failed to generate the report.";
        setError(message);
        setSummaries([]);
        setHasGenerated(false);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const rows = useMemo<ReportPostRow[]>(
    () => flattenReportRows(summaries),
    [summaries],
  );

  const periodLabel = useMemo(
    () => formatReportDateRangeLabel(appliedRange.from, appliedRange.to),
    [appliedRange.from, appliedRange.to],
  );

  const appliedRangeLabel = useMemo(
    () => formatReportDateRangeLabel(appliedRange.from, appliedRange.to),
    [appliedRange.from, appliedRange.to],
  );

  const stats = useMemo<ReportStatCard[]>(
    () => buildReportStatCards(summaries, hasGenerated, periodLabel),
    [hasGenerated, periodLabel, summaries],
  );

  return {
    appliedRange,
    setAppliedRange,
    summaries,
    isLoading,
    error,
    setError,
    hasGenerated,
    loadReport,
    rows,
    stats,
    periodLabel,
    appliedRangeLabel,
  };
}
