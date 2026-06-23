import { useEffect, useRef } from "react";

import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import { useReportDatePicker } from "@/features/reports/hooks/useReportDatePicker";
import { useReportStatusFilters } from "@/features/reports/hooks/useReportStatusFilters";
import { useReportsQuery } from "@/features/reports/hooks/useReportsQuery";
import {
  parseReportDateParam,
  parseReportDateRangeFromSearchParams,
  parseReportStatusFilterFromSearchParams,
  REPORT_FROM_PARAM,
  REPORT_TO_PARAM,
} from "@/features/reports/utils/reportsUrlParams";

export function useReportsManagement() {
  const hasRestoredFromUrl = useRef(false);
  const query = useReportsQuery();
  const filters = useReportStatusFilters({
    appliedRange: query.appliedRange,
    loadReport: query.loadReport,
  });
  const datePicker = useReportDatePicker({
    searchParams: filters.searchParams,
    setSearchParams: filters.setSearchParams,
    appliedRange: query.appliedRange,
    statusFilter: filters.statusFilter,
    loadReport: query.loadReport,
    syncStatusesToUrl: filters.syncStatusesToUrl,
    setError: query.setError,
  });

  useEffect(() => {
    if (hasRestoredFromUrl.current) {
      return;
    }

    hasRestoredFromUrl.current = true;

    const fromParam = filters.searchParams.get(REPORT_FROM_PARAM);
    if (!fromParam) {
      return;
    }

    const from = parseReportDateParam(fromParam);
    if (!from) {
      return;
    }

    const to =
      parseReportDateParam(filters.searchParams.get(REPORT_TO_PARAM)) ?? from;
    const range = parseReportDateRangeFromSearchParams(filters.searchParams);
    const statusFilter = parseReportStatusFilterFromSearchParams(
      filters.searchParams,
    );

    if (range) {
      datePicker.setPickerRange(range);
      query.setAppliedRange({
        from: range.from,
        to: range.to ?? from,
      });
    }

    filters.setStatusFilter(statusFilter);
    void query.loadReport(from, to, statusFilter);
  }, [
    filters.searchParams,
    query.loadReport,
    query.setAppliedRange,
    filters.setStatusFilter,
    datePicker.setPickerRange,
  ]);

  return {
    statusFilterOptions: statusOptions,
    showAll: filters.showAll,
    activeStatuses: filters.activeStatuses,
    pickerRange: datePicker.pickerRange,
    appliedRangeLabel: query.appliedRangeLabel,
    appliedRange: query.appliedRange,
    periodLabel: query.periodLabel,
    rows: query.rows,
    summaries: query.summaries,
    stats: query.stats,
    isLoading: query.isLoading,
    error: query.error,
    hasGenerated: query.hasGenerated,
    isPickerOpen: datePicker.isPickerOpen,
    handlePickerOpenChange: datePicker.handlePickerOpenChange,
    toggleStatusFilter: filters.toggleStatusFilter,
    handlePickerRangeChange: datePicker.handlePickerRangeChange,
    handlePickerKeyDown: datePicker.handlePickerKeyDown,
    applyDateRange: datePicker.applyDateRange,
  };
}
