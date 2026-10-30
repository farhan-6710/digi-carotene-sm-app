import { format } from "date-fns";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import { PostContentDetails } from "@/features/posts-management/components/PostContentDetails";
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
import { navigateBackOrFallback } from "@/shared/utils/navigateBackOrFallback";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";
import { Button } from "@/shared/ui/button";

function PostDetailBackButton({
  fallbackTo,
  label,
}: {
  fallbackTo: string;
  label: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-full"
      onClick={() => navigateBackOrFallback(navigate, location, fallbackTo)}
    >
      <ArrowLeft className="mr-2 size-4" />
      {label}
    </Button>
  );
}

export function PostDetailPage() {
  const { postId = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { can } = usePermissions();
  const { post, contentView, isLoading, error, setError, reload } =
    usePostDetailQuery(postId);

  const scheduleDate = post
    ? parseUrlDateParam(post.to_be_posted_date)
    : null;
  const fallbackTo = scheduleDate
    ? buildPostsDayPath(scheduleDate)
    : POSTS_MANAGEMENT_PATH;
  const backLabel = scheduleDate ? "Back" : "Back to calendar";

  const { openEditDialogFromPost, dialog } = usePostDialog({
    slots: [],
    reload: async () => {
      await reload();
    },
    setError,
  });

  const backButton = (
    <PostDetailBackButton fallbackTo={fallbackTo} label={backLabel} />
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
              fallbackTo={POSTS_MANAGEMENT_PATH}
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

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <PostDetailSummary post={post} />
        {contentView ? <PostContentDetails content={contentView} /> : null}
      </div>

      <PostDialog
        {...dialog}
        onDelete={
          dialog.onDelete
            ? () => {
                void (async () => {
                  await dialog.onDelete?.();
                  navigateBackOrFallback(navigate, location, fallbackTo);
                })();
              }
            : undefined
        }
      />
    </PageContent>
  );
}
