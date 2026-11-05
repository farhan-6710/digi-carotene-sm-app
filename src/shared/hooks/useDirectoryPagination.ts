import { useCallback, useEffect, useMemo, useState } from "react";

import { DIRECTORY_PAGE_SIZE } from "@/shared/constants/directoryPagination";

type UseDirectoryPaginationOptions = {
  total: number;
  /** When this changes (filters, reload), page resets to 1. */
  resetKey: string;
  pageSize?: number;
  enabled?: boolean;
};

/**
 * Client-side page slicing for DirectoryTable: data is already loaded;
 * only one page of rows renders at a time.
 */
export function useDirectoryPagination({
  total,
  resetKey,
  pageSize = DIRECTORY_PAGE_SIZE,
  enabled = true,
}: UseDirectoryPaginationOptions) {
  const [page, setPageState] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync page to new list identity
    setPageState(1);
  }, [resetKey, pageSize]);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(Math.max(total, 0) / pageSize)),
    [pageSize, total],
  );

  const pageSafe = enabled ? Math.min(Math.max(page, 1), pageCount) : 1;

  const setPage = useCallback(
    (next: number) => {
      setPageState(Math.min(Math.max(next, 1), pageCount));
    },
    [pageCount],
  );

  const start = enabled ? (pageSafe - 1) * pageSize : 0;
  const end = enabled ? start + pageSize : total;

  return {
    page: pageSafe,
    pageCount,
    pageSize,
    setPage,
    start,
    end,
    showPagination: enabled && total > pageSize,
  };
}
