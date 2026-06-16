import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router";

import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import type { StatusKey } from "@/features/posts-management/types/types";

import { getDefaultReportStatusFilters } from "../constants/reports";
import type {
  ClientReportSummary,
  ReportDateRange,
  ReportPostRow,
  ReportStatCard,
} from "../types/types";
import {
  fetchPostsForDateRange,
  formatReportDateRangeLabel,
  toReportDateString,
} from "../utils/reportsRepository";
import {
  buildReportRangeSearchParams,
  buildReportStatusSearchParams,
  parseReportDateParam,
  parseReportDateRangeFromSearchParams,
  parseReportStatusesFromSearchParams,
  REPORT_FROM_PARAM,
  REPORT_TO_PARAM,
} from "../utils/reportsUrlParams";
import {
  buildClientReportSummaries,
  buildReportStatsFromSummaries,
  flattenReportRows,
} from "../utils/reportsUtils";

export function useReportsManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasRestoredFromUrl = useRef(false);

  const [appliedRange, setAppliedRange] = useState<ReportDateRange>(() => {
    const range = parseReportDateRangeFromSearchParams(searchParams);
    if (!range?.from) {
      return { from: undefined, to: undefined };
    }

    return {
      from: range.from,
      to: range.to ?? range.from,
    };
  });
  const [pickerRange, setPickerRange] = useState<DateRange | undefined>(() =>
    parseReportDateRangeFromSearchParams(searchParams),
  );
  const [activeStatuses, setActiveStatuses] = useState<StatusKey[]>(
    () =>
      parseReportStatusesFromSearchParams(searchParams) ??
      getDefaultReportStatusFilters(),
  );
  const [summaries, setSummaries] = useState<ClientReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const syncRangeToUrl = useCallback(
    (range: DateRange | undefined) => {
      setSearchParams(
        (current) => buildReportRangeSearchParams(range, current),
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const syncStatusesToUrl = useCallback(
    (statuses: StatusKey[]) => {
      setSearchParams(
        (current) => buildReportStatusSearchParams(statuses, current),
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadReport = useCallback(
    async (from: Date, to: Date, statuses: StatusKey[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const posts = await fetchPostsForDateRange(
          toReportDateString(from),
          toReportDateString(to),
          statuses,
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

  useEffect(() => {
    if (hasRestoredFromUrl.current) {
      return;
    }

    hasRestoredFromUrl.current = true;

    const fromParam = searchParams.get(REPORT_FROM_PARAM);
    if (!fromParam) {
      return;
    }

    const from = parseReportDateParam(fromParam);
    if (!from) {
      return;
    }

    const to =
      parseReportDateParam(searchParams.get(REPORT_TO_PARAM)) ?? from;
    const range = parseReportDateRangeFromSearchParams(searchParams);
    const statuses =
      parseReportStatusesFromSearchParams(searchParams) ??
      getDefaultReportStatusFilters();

    if (range) {
       // eslint-disable-next-line
      setPickerRange(range);
      setAppliedRange({
        from: range.from,
        to: range.to ?? from,
      });
    }

    setActiveStatuses(statuses);
    void loadReport(from, to, statuses);
  }, [loadReport, searchParams]);

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

  const stats = useMemo<ReportStatCard[]>(() => {
    const totals = buildReportStatsFromSummaries(summaries);

    if (!hasGenerated) {
      return [
        {
          label: "Clients in range",
          value: "—",
          delta: "Select a date range",
          deltaLabel: "to view totals",
          trend: "positive",
        },
        {
          label: "Total posts",
          value: "—",
          delta: "—",
          deltaLabel: "in selected range",
          trend: "positive",
        },
        {
          label: "Posted",
          value: "—",
          delta: "—",
          deltaLabel: "completed posts",
          trend: "positive",
        },
        {
          label: "Scheduled",
          value: "—",
          delta: "—",
          deltaLabel: "upcoming posts",
          trend: "positive",
        },
      ];
    }

    return [
      {
        label: "Clients in range",
        value: String(totals.clients),
        delta: periodLabel,
        deltaLabel: "selected period",
        trend: "positive",
      },
      {
        label: "Total posts",
        value: String(totals.totalPosts),
        delta: `${totals.posted} posted`,
        deltaLabel: "in this report",
        trend: "positive",
      },
      {
        label: "Posted",
        value: String(totals.posted),
        delta: `${totals.notPosted} not posted`,
        deltaLabel: "remaining",
        trend: totals.posted >= totals.notPosted ? "positive" : "negative",
      },
      {
        label: "Scheduled",
        value: String(totals.scheduled),
        delta: `${totals.totalPosts} total`,
        deltaLabel: "posts tracked",
        trend: "positive",
      },
    ];
  }, [hasGenerated, periodLabel, summaries]);

  const toggleStatusFilter = useCallback(
    (status: StatusKey) => {
      let nextStatuses: StatusKey[];

      if (activeStatuses.includes(status)) {
        const next = activeStatuses.filter((entry) => entry !== status);
        if (next.length === 0) {
          return;
        }
        nextStatuses = next;
      } else {
        nextStatuses = [...activeStatuses, status];
      }

      setActiveStatuses(nextStatuses);
      syncStatusesToUrl(nextStatuses);

      if (appliedRange.from) {
        const to = appliedRange.to ?? appliedRange.from;
        void loadReport(appliedRange.from, to, nextStatuses);
      }
    },
    [activeStatuses, appliedRange.from, appliedRange.to, loadReport, syncStatusesToUrl],
  );

  const applyDateRange = useCallback(async () => {
    if (!pickerRange?.from) {
      setError("Select a start date for the report.");
      return;
    }

    const from = pickerRange.from;
    const to = pickerRange.to ?? pickerRange.from;

    if (to < from) {
      setError("End date must be on or after the start date.");
      return;
    }

    syncRangeToUrl({ from, to });
    syncStatusesToUrl(activeStatuses);
    setIsPickerOpen(false);
    await loadReport(from, to, activeStatuses);
  }, [
    activeStatuses,
    pickerRange,
    loadReport,
    syncRangeToUrl,
    syncStatusesToUrl,
  ]);

  const handlePickerRangeChange = useCallback((range: DateRange | undefined) => {
    setPickerRange(range);
    setError(null);
  }, []);

  const handlePickerOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setPickerRange(
          appliedRange.from
            ? { from: appliedRange.from, to: appliedRange.to ?? appliedRange.from }
            : undefined,
        );
        setError(null);
      }

      setIsPickerOpen(open);
    },
    [appliedRange.from, appliedRange.to],
  );

  const handlePickerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void applyDateRange();
      }
    },
    [applyDateRange],
  );

  return {
    statusFilterOptions: statusOptions,
    activeStatuses,
    pickerRange,
    appliedRangeLabel,
    appliedRange,
    periodLabel,
    rows,
    summaries,
    stats,
    isLoading,
    error,
    hasGenerated,
    isPickerOpen,
    handlePickerOpenChange,
    toggleStatusFilter,
    handlePickerRangeChange,
    handlePickerKeyDown,
    applyDateRange,
  };
}
