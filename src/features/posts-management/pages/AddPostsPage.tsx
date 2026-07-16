import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { AddPostsDayList } from "@/features/posts-management/components/AddPostsDayList";
import { PostDialogFormFields } from "@/features/posts-management/components/PostDialogFormFields";
import { useAddPostsPage } from "@/features/posts-management/hooks/useAddPostsPage";
import { formatPostScheduleLabel } from "@/features/posts-management/utils/postScheduleUtils";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function AddPostsPage() {
  const {
    drafts,
    activeDayId,
    activeDraft,
    statusOptions,
    isSaving,
    error,
    removeDayId,
    setRemoveDayId,
    selectDay,
    addDay,
    confirmRemoveDay,
    patchActiveValues,
    saveAll,
    canSave,
    backPath,
  } = useAddPostsPage();

  const removeDraft = drafts.find((draft) => draft.id === removeDayId);
  const removeLabel = removeDraft?.values.toBePostedOn
    ? formatPostScheduleLabel(
        removeDraft.values.toBePostedOn.year,
        removeDraft.values.toBePostedOn.month,
        removeDraft.values.toBePostedOn.day,
        removeDraft.values.toBePostedOn.time || "—",
      )
    : "this post";

  return (
    <PageContent>
      <PageHeader
        heading="Add posts"
        description="Create and schedule multiple posts in one go."
        backButton={
          <Button asChild variant="outline" className="rounded-full">
            <Link to={backPath}>
              <ArrowLeft className="mr-2 size-4" />
              Back to posts
            </Link>
          </Button>
        }
        actions={
          <Button
            className="rounded-full"
            onClick={() => void saveAll()}
            disabled={!canSave || isSaving}
          >
            {isSaving
              ? "Creating..."
              : drafts.length > 1
                ? `Create ${drafts.length} posts`
                : "Create post"}
          </Button>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="grid min-h-[28rem] gap-6 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <AddPostsDayList
            drafts={drafts}
            activeDayId={activeDayId}
            disabled={isSaving}
            onSelectDay={selectDay}
            onAddDay={addDay}
            onRequestRemoveDay={setRemoveDayId}
          />
        </aside>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-xs sm:p-6">
          {activeDraft ? (
            <PostDialogFormFields
              values={activeDraft.values}
              statusOptions={statusOptions}
              disabled={isSaving}
              preloadOptions
              patchValues={patchActiveValues}
            />
          ) : null}
        </section>
      </div>

      <ConfirmationModal
        open={removeDayId != null}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveDayId(null);
          }
        }}
        title="Remove this post?"
        description={`Remove ${removeLabel} from this batch? Unsaved details for that post will be lost.`}
        confirmLabel="Remove"
        confirmVariant="destructive"
        onConfirm={async () => {
          confirmRemoveDay();
        }}
      />
    </PageContent>
  );
}
