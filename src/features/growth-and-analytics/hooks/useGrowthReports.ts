import { useCallback } from "react";

import { fetchReports } from "@/services/growthAnalyticsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { ReportRow } from "../types/types";

const NO_REPORTS: ReportRow[] = [];

export function useGrowthReports() {
  const load = useCallback(() => fetchReports(), []);
  const { data: reports, isLoading, error } = useFetch<ReportRow[]>(
    load,
    NO_REPORTS,
  );

  return { reports, isLoading, error };
}
