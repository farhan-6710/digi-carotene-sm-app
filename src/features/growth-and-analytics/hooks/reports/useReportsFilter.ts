import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  REPORT_TYPE_PARAM,
  parseReportType,
} from "../utils/reportsFilter";
import type { ReportType } from "../types/types";

export function useReportsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeType = useMemo(
    () => parseReportType(searchParams.get(REPORT_TYPE_PARAM)),
    [searchParams],
  );

  const setActiveType = useCallback(
    (type: ReportType | "all") => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set(REPORT_TYPE_PARAM, type);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { activeType, setActiveType };
}
