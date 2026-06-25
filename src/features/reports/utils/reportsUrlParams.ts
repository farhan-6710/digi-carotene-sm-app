import type { DateRange } from "react-day-picker";

import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import type { StatusKey } from "@/features/posts-management/types/types";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";
import type { PostStatusFilterState } from "@/shared/utils/postStatusFilterUtils";

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

export function parseReportStatusFilterFromSearchParams(
  searchParams: URLSearchParams,
): PostStatusFilterState {
  const value = searchParams.get(REPORT_STATUS_PARAM);
  if (!value) {
    return { showAll: true, statuses: [] };
  }

  const parsed = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry): entry is StatusKey =>
      statusOptions.includes(entry as StatusKey),
    );

  if (parsed.length === 0) {
    return { showAll: true, statuses: [] };
  }

  return { showAll: false, statuses: parsed };
}

/** @deprecated Use parseReportStatusFilterFromSearchParams */
export function parseReportStatusesFromSearchParams(
  searchParams: URLSearchParams,
): StatusKey[] | undefined {
  const filter = parseReportStatusFilterFromSearchParams(searchParams);
  if (filter.showAll) {
    return undefined;
  }

  return filter.statuses;
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
  filter: PostStatusFilterState,
  existing?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(existing);

  if (filter.showAll) {
    params.delete(REPORT_STATUS_PARAM);
  } else {
    params.set(REPORT_STATUS_PARAM, serializeReportStatuses(filter.statuses));
  }

  return params;
}

export function buildReportsListPath(searchParams: URLSearchParams): string {
  const params = getReportSearchParams(searchParams);
  const query = params.toString();

  return query ? `/team-portal/reports?${query}` : "/team-portal/reports";
}

export function buildClientReportPath(
  clientId: string,
  searchParams: URLSearchParams,
): string {
  const params = getReportSearchParams(searchParams);
  const query = params.toString();

  return query
    ? `/team-portal/reports/${clientId}?${query}`
    : `/team-portal/reports/${clientId}`;
}
