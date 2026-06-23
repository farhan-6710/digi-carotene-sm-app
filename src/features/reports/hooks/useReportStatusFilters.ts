import { useCallback, useState } from "react";
import { useSearchParams } from "react-router";

import type { ReportDateRange } from "@/features/reports/types/types";
import {
  buildReportStatusSearchParams,
  parseReportStatusFilterFromSearchParams,
} from "@/features/reports/utils/reportsUrlParams";
import {
  getDefaultPostStatusFilterState,
  togglePostStatusFilter,
  type PostStatusFilterState,
  type PostStatusFilterTarget,
} from "@/shared/utils/postStatusFilterUtils";

type UseReportStatusFiltersOptions = {
  appliedRange: ReportDateRange;
  loadReport: (
    from: Date,
    to: Date,
    statusFilter: PostStatusFilterState,
  ) => Promise<void>;
};

export function useReportStatusFilters({
  appliedRange,
  loadReport,
}: UseReportStatusFiltersOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<PostStatusFilterState>(
    () => parseReportStatusFilterFromSearchParams(searchParams),
  );

  const syncStatusesToUrl = useCallback(
    (filter: PostStatusFilterState) => {
      setSearchParams(
        (current) => buildReportStatusSearchParams(filter, current),
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const toggleStatusFilter = useCallback(
    (target: PostStatusFilterTarget) => {
      const nextFilter = togglePostStatusFilter(statusFilter, target);

      setStatusFilter(nextFilter);
      syncStatusesToUrl(nextFilter);

      if (appliedRange.from) {
        const to = appliedRange.to ?? appliedRange.from;
        void loadReport(appliedRange.from, to, nextFilter);
      }
    },
    [
      appliedRange.from,
      appliedRange.to,
      loadReport,
      statusFilter,
      syncStatusesToUrl,
    ],
  );

  return {
    statusFilter,
    showAll: statusFilter.showAll,
    activeStatuses: statusFilter.statuses,
    setStatusFilter,
    toggleStatusFilter,
    syncStatusesToUrl,
    searchParams,
    setSearchParams,
  };
}

export { getDefaultPostStatusFilterState };
