import { reportTabs } from "../constants/reportsData";
import type { ReportRow, ReportType } from "../types/types";

export const REPORT_TYPE_PARAM = "type";

const validTypes = new Set<string>(reportTabs.map((tab) => tab.id));

export function parseReportType(value: string | null): ReportType | "all" {
  if (value && validTypes.has(value)) {
    return value as ReportType | "all";
  }
  return "all";
}

export function filterReportsByType(
  reports: ReportRow[],
  type: ReportType | "all",
): ReportRow[] {
  if (type === "all") {
    return reports;
  }
  return reports.filter((report) => report.type === type);
}
