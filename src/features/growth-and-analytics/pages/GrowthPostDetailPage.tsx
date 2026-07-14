import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { GrowthPostProfileCard } from "../components/GrowthPostProfileCard";
import { useGrowthPaths } from "../hooks/useGrowthPaths";
import { useGrowthPostDetailQuery } from "../hooks/useGrowthPostDetailQuery";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function GrowthPostDetailBackButton() {
  const { contentPerformancePath } = useGrowthPaths();

  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={contentPerformancePath}>
        <ArrowLeft className="mr-2 size-4" />
        Back to content performance
      </Link>
    </Button>
  );
}

function GrowthPostPager({
  previousPostId,
  nextPostId,
}: {
  previousPostId: string | null;
  nextPostId: string | null;
}) {
  const { buildPostDetailPath } = useGrowthPaths();

  return (
    <div className="flex items-center gap-2">
      {previousPostId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link to={buildPostDetailPath(previousPostId)}>
            <ArrowLeft className="mr-2 size-4" />
            Prev post
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full" disabled>
          <ArrowLeft className="mr-2 size-4" />
          Prev post
        </Button>
      )}
      {nextPostId ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link to={buildPostDetailPath(nextPostId)}>
            Next post
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="rounded-full" disabled>
          Next post
          <ArrowRight className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}

export function GrowthPostDetailPage() {
  const { postId = "" } = useParams();
  const { view, isLoading, error } = useGrowthPostDetailQuery(postId);

  if (isLoading) {
    return <DetailPageLoading backButton={<GrowthPostDetailBackButton />} />;
  }

  if (!view) {
    return (
      <section className="space-y-4">
        <PageHeader
          actions={
            <div className="flex w-full items-center justify-between gap-4">
              <GrowthPostDetailBackButton />
              <GrowthPostPager previousPostId={null} nextPostId={null} />
            </div>
          }
        />
        <ErrorBanner message={error ?? "Post not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        actions={
          <div className="flex w-full items-center justify-between gap-4">
            <GrowthPostDetailBackButton />
            <GrowthPostPager
              previousPostId={view.previousPostId}
              nextPostId={view.nextPostId}
            />
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <GrowthPostProfileCard view={view} />
    </PageContent>
  );
}
