import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Plus } from "lucide-react";

import { MonthSelector } from "@/shared/ui/MonthSelector";
import { PostsCalendarViewToggle } from "@/features/posts-management/components/PostsCalendarViewToggle";
import { PostsDaysListTable } from "@/features/posts-management/components/PostsDaysListTable";
import { PostsManagementFiltersBar } from "@/features/posts-management/components/PostsManagementFiltersBar";
import { PostsManagementStatusLegend } from "@/features/posts-management/components/PostsManagementStatusLegend";
import { PostsManagementWeeksTable } from "@/features/posts-management/components/PostsManagementWeeksTable";
import {
  buildAddPostsPath,
  buildPostDetailPath,
  buildPostsDayPath,
} from "@/features/posts-management/constants/routes";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import { usePostsCalendarSelection } from "@/features/posts-management/hooks/usePostsCalendarSelection";
import { usePostsFilterParams } from "@/features/posts-management/hooks/usePostsFilterParams";
import { usePostsListDateRange } from "@/features/posts-management/hooks/usePostsListDateRange";
import { usePostsManagement } from "@/features/posts-management/hooks/usePostsManagement";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageContent } from "@/shared/components/PageContent";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function PostsManagementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { can } = usePermissions();
  const [listView, setListView] = useState(false);
  const {
    selectedClientIds,
    selectedProjectIds,
    statusFilter,
    setSelectedClientIds,
    setSelectedProjectIds,
    setStatusFilter,
  } = usePostsFilterParams();
  const listDateRange = usePostsListDateRange();
  const { selectedDate, calendarWeeks, year, month, selectDate } =
    usePostsCalendarSelection();

  const { isLoading, error, projects, getSlot } = usePostsManagement(
    year,
    month,
    selectedClientIds,
    selectedProjectIds,
    statusFilter,
  );

  const goToDay = (slotYear: number, slotMonth: number, date: number) => {
    const target = new Date(slotYear, slotMonth - 1, date);
    selectDate(target);
    navigate(buildPostsDayPath(target, searchParams));
  };

  const goToPost = (postId: string) => {
    navigate(buildPostDetailPath(postId));
  };

  return (
    <PageContent>
      <PageHeader
        heading="Postings Calendar"
        description="Browse the content calendar by month. Open any day to review its posts, or open a post for full details."
        actions={
          can("posts.create") ? (
            <Button asChild className="gap-2 rounded-full px-5 shadow-sm">
              <Link to={buildAddPostsPath({ date: new Date() })}>
                <Plus className="size-4" />
                Add Post
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <PostsManagementStatusLegend />
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <PostsCalendarViewToggle
              listView={listView}
              onListViewChange={setListView}
            />
            <MonthSelector
              year={year}
              month={month}
              onSelect={selectDate}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <PostsManagementFiltersBar
          projects={projects}
          selectedClientIds={selectedClientIds}
          selectedProjectIds={selectedProjectIds}
          statusFilter={statusFilter}
          onClientChange={setSelectedClientIds}
          onProjectChange={setSelectedProjectIds}
          onStatusChange={setStatusFilter}
          listView={listView}
          listDateRange={listDateRange}
        />
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-card">
          <LoadingSpinner />
        </div>
      ) : listView ? (
        <PostsDaysListTable
          year={year}
          month={month}
          isLoading={isLoading}
          listDateRange={listDateRange.appliedRange}
          getSlot={getSlot}
        />
      ) : (
        <PostsManagementWeeksTable
          year={year}
          month={month}
          weeks={calendarWeeks}
          selectedDate={selectedDate}
          getSlot={getSlot}
          onOpenDay={goToDay}
          onOpenPost={goToPost}
          statusColors={statusColors}
          statusText={statusText}
        />
      )}
    </PageContent>
  );
}
