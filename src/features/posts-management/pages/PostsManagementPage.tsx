import { Plus } from "lucide-react";
import { Loader2 } from "lucide-react";

import { MonthSelector } from "@/shared/ui/MonthSelector";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import { PostsManagementStatusLegend } from "@/features/posts-management/components/PostsManagementStatusLegend";
import { PostsManagementWeeksTable } from "@/features/posts-management/components/PostsManagementWeeksTable";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import { usePostsCalendarSelection } from "@/features/posts-management/hooks/usePostsCalendarSelection";
import { usePostsManagement } from "@/features/posts-management/hooks/usePostsManagement";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function PostsManagementPage() {
  const { selectedDate, calendarWeeks, year, month, selectDate } =
    usePostsCalendarSelection();

  const { isLoading, error, getSlot, openAddDialog, openEditDialog, dialog } =
    usePostsManagement(year, month);

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Posts Management"
        description="Manage daily client posts by time and status. Click any day to add a post or tap one to update it."
        actions={
          <Button
            className="gap-2 rounded-full px-5 shadow-sm"
            onClick={() => {
              const today = new Date();
              openAddDialog(
                today.getFullYear(),
                today.getMonth() + 1,
                today.getDate(),
              );
            }}
          >
            <Plus className="size-4" />
            Add Post
          </Button>
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

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <PostsManagementWeeksTable
          year={year}
          month={month}
          weeks={calendarWeeks}
          selectedDate={selectedDate}
          getSlot={getSlot}
          onAdd={(slotYear, slotMonth, date) => {
            selectDate(new Date(slotYear, slotMonth - 1, date));
            openAddDialog(slotYear, slotMonth, date);
          }}
          onEdit={openEditDialog}
          statusColors={statusColors}
          statusText={statusText}
        />
      )}

      <PostDialog {...dialog} />
    </section>
  );
}
