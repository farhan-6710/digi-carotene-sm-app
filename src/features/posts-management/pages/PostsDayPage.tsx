import { format } from "date-fns";
import { Link, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { useMemo } from "react";

import { ClientProjectFilters } from "@/features/posts-management/components/ClientProjectFilters";
import { DayPostsTable } from "@/features/posts-management/components/DayPostsTable";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import {
  buildAddPostsPath,
  buildPostsManagementPath,
  parsePostsDayDateParam,
} from "@/features/posts-management/constants/routes";
import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { usePostsDayQuery } from "@/features/posts-management/hooks/usePostsDayQuery";
import { usePostsFilterParams } from "@/features/posts-management/hooks/usePostsFilterParams";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function PostsDayBackButton({
  date,
  searchParams,
}: {
  date: Date | null;
  searchParams?: URLSearchParams;
}) {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={buildPostsManagementPath(date ?? undefined, searchParams)}>
        <ArrowLeft className="mr-2 size-4" />
        Back to posts
      </Link>
    </Button>
  );
}

export function PostsDayPage() {
  const { date: dateParam } = useParams();
  const [searchParams] = useSearchParams();
  const day = parsePostsDayDateParam(dateParam);
  const { can } = usePermissions();
  const {
    selectedClientIds,
    selectedProjectIds,
    setSelectedClientIds,
    setSelectedProjectIds,
  } = usePostsFilterParams();

  const {
    posts,
    projects,
    isLoading,
    error,
    setError,
    reload,
  } = usePostsDayQuery(day);

  const projectClientMap = useMemo(
    () => new Map(projects.map((p) => [p.id, p.client_id])),
    [projects],
  );

  const filteredPosts = useMemo(() => {
    if (selectedClientIds.length === 0 && selectedProjectIds.length === 0) {
      return posts;
    }

    return posts.filter((post) => {
      if (
        selectedProjectIds.length > 0 &&
        !selectedProjectIds.includes(post.project_id)
      ) {
        return false;
      }

      if (selectedClientIds.length > 0) {
        const clientId = projectClientMap.get(post.project_id);
        return clientId ? selectedClientIds.includes(clientId) : false;
      }

      return true;
    });
  }, [posts, selectedClientIds, selectedProjectIds, projectClientMap]);

  const { openEditDialogFromPost, dialog } = usePostDialog({
    slots: [],
    reload,
    setError,
  });

  if (!day) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<PostsDayBackButton date={null} searchParams={searchParams} />} />
        <ErrorBanner message="That date is invalid. Pick a day from the posts calendar." />
      </section>
    );
  }

  if (isLoading) {
    return <DetailPageLoading backButton={<PostsDayBackButton date={day} searchParams={searchParams} />} />;
  }

  const dayLabel = format(day, "EEEE, MMMM d, yyyy");

  return (
    <PageContent>
      <PageHeader
        heading={dayLabel}
        description={`Review and manage every post scheduled for ${format(day, "MMMM d")}.`}
        backButton={<PostsDayBackButton date={day} searchParams={searchParams} />}
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

      <ClientProjectFilters
        projects={projects}
        selectedClientIds={selectedClientIds}
        selectedProjectIds={selectedProjectIds}
        onClientChange={setSelectedClientIds}
        onProjectChange={setSelectedProjectIds}
      />

      {error ? <ErrorBanner message={error} /> : null}

      <DayPostsTable
        posts={filteredPosts}
        isLoading={isLoading}
        onEditPost={openEditDialogFromPost}
      />

      <PostDialog {...dialog} />
    </PageContent>
  );
}
