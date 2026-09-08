import { format } from "date-fns";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

import { PostDetailSummary } from "@/features/posts-management/components/PostDetailSummary";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import {
  buildPostsDayPath,
  buildPostsManagementPath,
  POSTS_MANAGEMENT_PATH,
} from "@/features/posts-management/constants/routes";
import { usePostDetailQuery } from "@/features/posts-management/hooks/usePostDetailQuery";
import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";
import { Button } from "@/shared/ui/button";

function PostDetailBackButton({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={to}>
        <ArrowLeft className="mr-2 size-4" />
        {label}
      </Link>
    </Button>
  );
}

export function PostDetailPage() {
  const { postId = "" } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { post, isLoading, error, setError, reload } =
    usePostDetailQuery(postId);

  const scheduleDate = post
    ? parseUrlDateParam(post.to_be_posted_date)
    : null;
  const backTo = scheduleDate
    ? buildPostsDayPath(scheduleDate)
    : POSTS_MANAGEMENT_PATH;
  const backLabel = scheduleDate ? "Back to day" : "Back to calendar";

  const { openEditDialogFromPost, dialog } = usePostDialog({
    slots: [],
    reload: async () => {
      await reload();
    },
    setError,
  });

  const backButton = (
    <PostDetailBackButton to={backTo} label={backLabel} />
  );

  if (isLoading && !post) {
    return <DetailPageLoading backButton={backButton} />;
  }

  if (!post) {
    return (
      <section className="space-y-4">
        <PageHeader
          heading="Post"
          description="Post details and schedule."
          backButton={
            <PostDetailBackButton
              to={POSTS_MANAGEMENT_PATH}
              label="Back to calendar"
            />
          }
        />
        <ErrorBanner message={error ?? "Post not found."} />
      </section>
    );
  }

  const heading = post.post_title?.trim() || "Untitled post";
  const description = scheduleDate
    ? `Scheduled for ${format(scheduleDate, "MMMM d, yyyy")}.`
    : "Review schedule, platforms, and publish details for this post.";

  return (
    <PageContent>
      <PageHeader
        heading={heading}
        description={description}
        backButton={backButton}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link
                to={
                  scheduleDate
                    ? buildPostsManagementPath(scheduleDate)
                    : POSTS_MANAGEMENT_PATH
                }
              >
                Calendar
              </Link>
            </Button>
            {can("posts.update") ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => openEditDialogFromPost(post)}
              >
                <Pencil className="mr-2 size-4" />
                Edit
              </Button>
            ) : null}
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="mx-auto w-full max-w-3xl">
        <PostDetailSummary post={post} />
      </div>

      <PostDialog
        {...dialog}
        onDelete={
          dialog.onDelete
            ? () => {
                void (async () => {
                  await dialog.onDelete?.();
                  navigate(backTo, { replace: true });
                })();
              }
            : undefined
        }
      />
    </PageContent>
  );
}
