import type { DateRange } from "react-day-picker";

import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import type { StatusKey } from "@/features/posts-management/types/types";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";

import { toReportDateString } from "./reportsRepository";

export const REPORT_FROM_PARAM = "from";
export const REPORT_TO_PARAM = "to";
export const REPORT_STATUS_PARAM = "status";

export function parseReportDateParam(value: string | null): Date | undefined {
  return parseUrlDateParam(value);
}

export function parseReportDateRangeFromSearchParams(
  searchParams: URLSearchParams,
): DateRange | undefined {
  const from = parseReportDateParam(searchParams.get(REPORT_FROM_PARAM));
  if (!from) {
    return undefined;
  }

  const to = parseReportDateParam(searchParams.get(REPORT_TO_PARAM));

  return {
    from,
    to: to ?? undefined,
  };
}

export function parseReportStatusesFromSearchParams(
  searchParams: URLSearchParams,
): StatusKey[] | undefined {
  const value = searchParams.get(REPORT_STATUS_PARAM);
  if (!value) {
    return undefined;
  }

  const parsed = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry): entry is StatusKey =>
      statusOptions.includes(entry as StatusKey),
    );

  return parsed.length > 0 ? parsed : undefined;
}

export function serializeReportStatuses(statuses: StatusKey[]): string {
  return statuses.join(",");
}

export function getReportSearchParams(
  searchParams: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams();
  const from = searchParams.get(REPORT_FROM_PARAM);
  const to = searchParams.get(REPORT_TO_PARAM);
  const status = searchParams.get(REPORT_STATUS_PARAM);

  if (from) {
    params.set(REPORT_FROM_PARAM, from);
  }

  if (to) {
    params.set(REPORT_TO_PARAM, to);
  }

  if (status) {
    params.set(REPORT_STATUS_PARAM, status);
  }

  return params;
}

export function buildReportRangeSearchParams(
  range: DateRange | undefined,
  existing?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(existing);

  if (range?.from) {
    params.set(REPORT_FROM_PARAM, toReportDateString(range.from));

    if (range.to) {
      params.set(REPORT_TO_PARAM, toReportDateString(range.to));
    } else {
      params.delete(REPORT_TO_PARAM);
    }
  } else {
    params.delete(REPORT_FROM_PARAM);
    params.delete(REPORT_TO_PARAM);
  }

  return params;
}

export function buildReportStatusSearchParams(
  statuses: StatusKey[],
  existing?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(existing);
  params.set(REPORT_STATUS_PARAM, serializeReportStatuses(statuses));

  return params;
}

export function buildReportsListPath(searchParams: URLSearchParams): string {
  const params = getReportSearchParams(searchParams);
  const query = params.toString();

  return query ? `/admin/reports?${query}` : "/admin/reports";
}

export function buildClientReportPath(
  clientId: string,
  searchParams: URLSearchParams,
): string {
  const params = getReportSearchParams(searchParams);
  const query = params.toString();

  return query
    ? `/admin/reports/${clientId}?${query}`
    : `/admin/reports/${clientId}`;
}
