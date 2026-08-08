import { format } from "date-fns";
import { Link, useParams } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import { DayPostsTable } from "@/features/posts-management/components/DayPostsTable";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import {
  buildAddPostsPath,
  buildPostsManagementPath,
  parsePostsDayDateParam,
} from "@/features/posts-management/constants/routes";
import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { usePostsDayQuery } from "@/features/posts-management/hooks/usePostsDayQuery";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function PostsDayBackButton({ date }: { date: Date | null }) {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={buildPostsManagementPath(date ?? undefined)}>
        <ArrowLeft className="mr-2 size-4" />
        Back to posts
      </Link>
    </Button>
  );
}

export function PostsDayPage() {
  const { date: dateParam } = useParams();
  const day = parsePostsDayDateParam(dateParam);
  const { can } = usePermissions();
  const { data: posts, isLoading, error, setError, reload } =
    usePostsDayQuery(day);
  const { openEditDialogFromPost, dialog } = usePostDialog({
    slots: [],
    reload,
    setError,
  });

  if (!day) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<PostsDayBackButton date={null} />} />
        <ErrorBanner message="That date is invalid. Pick a day from the posts calendar." />
      </section>
    );
  }

  if (isLoading) {
    return <DetailPageLoading backButton={<PostsDayBackButton date={day} />} />;
  }

  const dayLabel = format(day, "EEEE, MMMM d, yyyy");

  return (
    <PageContent>
      <PageHeader
        heading={dayLabel}
        description={`Review and manage every post scheduled for ${format(day, "MMMM d")}.`}
        backButton={<PostsDayBackButton date={day} />}
        actions={
          can("posts.create") ? (
            <Button asChild className="rounded-full shadow-sm">
              <Link to={buildAddPostsPath({ date: day, returnToDay: true })}>
                <Plus className="mr-2 size-4" />
                Add Post
              </Link>
            </Button>
          ) : null
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <DayPostsTable
        posts={posts}
        isLoading={isLoading}
        onEditPost={openEditDialogFromPost}
      />

      <PostDialog {...dialog} />
    </PageContent>
  );
}
