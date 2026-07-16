import { Link, useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { MonthSelector } from "@/shared/ui/MonthSelector";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import { PostsManagementStatusLegend } from "@/features/posts-management/components/PostsManagementStatusLegend";
import { PostsManagementWeeksTable } from "@/features/posts-management/components/PostsManagementWeeksTable";
import { buildAddPostsPath } from "@/features/posts-management/constants/routes";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import { usePostsCalendarSelection } from "@/features/posts-management/hooks/usePostsCalendarSelection";
import { usePostsManagement } from "@/features/posts-management/hooks/usePostsManagement";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageContent } from "@/shared/components/PageContent";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function PostsManagementPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { selectedDate, calendarWeeks, year, month, selectDate } =
    usePostsCalendarSelection();

  const { isLoading, error, getSlot, openEditDialog, dialog } =
    usePostsManagement(year, month);

  const goToAddPost = (slotYear: number, slotMonth: number, date: number) => {
    const target = new Date(slotYear, slotMonth - 1, date);
    selectDate(target);
    navigate(buildAddPostsPath(target));
  };

  return (
    <PageContent>
      <PageHeader
        heading="Posts Management"
        description="Manage daily client posts by time and status. Click any day to add a post or tap one to update it."
        actions={
          can("posts.create") ? (
            <Button asChild className="gap-2 rounded-full px-5 shadow-sm">
              <Link to={buildAddPostsPath(new Date())}>
                <Plus className="size-4" />
                Add Post
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <PostsManagementStatusLegend />
        <MonthSelector
          year={year}
          month={month}
          onSelect={selectDate}
          className="w-full sm:w-auto"
        />
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-card">
          <LoadingSpinner />
        </div>
      ) : (
        <PostsManagementWeeksTable
          year={year}
          month={month}
          weeks={calendarWeeks}
          selectedDate={selectedDate}
          getSlot={getSlot}
          onAdd={goToAddPost}
          onEdit={openEditDialog}
          statusColors={statusColors}
          statusText={statusText}
        />
      )}

      <PostDialog {...dialog} />
    </PageContent>
  );
}
