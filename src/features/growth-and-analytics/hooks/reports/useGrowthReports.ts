import { DUMMY_REPORTS } from "../../constants/reports/reportsData";

export function useGrowthReports() {
  return {
    reports: DUMMY_REPORTS,
    isLoading: false,
    error: null,
  };
}
