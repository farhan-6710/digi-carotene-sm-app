import { useMemo } from "react";
import { format, getDaysInMonth } from "date-fns";
import { useSearchParams } from "react-router";

import { PostsDaysListTableRow } from "@/features/posts-management/components/PostsDaysListTableRow";
import { postsDaysListDirectoryConfig } from "@/features/posts-management/constants/postsDaysListDirectory";
import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import { buildPostsDayPath } from "@/features/posts-management/constants/routes";
import type {
  PostsDaysListStatusMixItem,
  PostsDaysListTableProps,
} from "@/features/posts-management/types/components";
import { getDayLabel } from "@/features/posts-management/utils/calendarUtils";
import { isPostsListDayInRange } from "@/features/posts-management/utils/postsListDateRangeUtils";
import type { StatusKey } from "@/features/posts-management/types/types";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

function buildStatusMix(statuses: StatusKey[]): PostsDaysListStatusMixItem[] {
  if (statuses.length === 0) return [];

  const counts = new Map<StatusKey, number>();
  for (const status of statuses) {
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }

  return statusOptions
    .filter((status) => (counts.get(status) ?? 0) > 0)
    .map((status) => ({
      status,
      count: counts.get(status) ?? 0,
    }));
}

export function PostsDaysListTable({
  year,
  month,
  isLoading,
  listDateRange,
  getSlot,
}: PostsDaysListTableProps) {
  const [searchParams] = useSearchParams();
  const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));

  const days = useMemo(() => {
    const allDays = Array.from({ length: daysInMonth }, (_, index) => {
      const date = index + 1;
      const dayDate = new Date(year, month - 1, date);
      const slot = getSlot(year, month, date);
      const postCount = slot?.clients.length ?? 0;
      const statuses = (slot?.clients ?? []).map((client) => client.status);

      return {
        date,
        dateLabel: format(dayDate, "MMM d"),
        dayLabel: getDayLabel(year, month, date),
        postCount,
        statusMix: buildStatusMix(statuses),
        href: buildPostsDayPath(dayDate, searchParams),
      };
    });

    if (!listDateRange?.from) return allDays;

    return allDays.filter((day) =>
      isPostsListDayInRange(year, month, day.date, listDateRange),
    );
  }, [daysInMonth, getSlot, listDateRange, month, searchParams, year]);

  return (
    <DirectoryTable
      title={postsDaysListDirectoryConfig.title}
      description={postsDaysListDirectoryConfig.description}
      gridClass={postsDaysListDirectoryConfig.gridClass}
      columns={postsDaysListDirectoryConfig.columns}
      emptyMessage={
        listDateRange?.from
          ? "No days in this date range."
          : postsDaysListDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={days.length === 0}
    >
      {days.map((day) => (
        <PostsDaysListTableRow
          key={day.date}
          dateLabel={day.dateLabel}
          dayLabel={day.dayLabel}
          postCount={day.postCount}
          statusMix={day.statusMix}
          href={day.href}
        />
      ))}
    </DirectoryTable>
  );
}
