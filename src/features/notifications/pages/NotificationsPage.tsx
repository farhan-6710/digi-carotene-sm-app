import { PostApprovalsSection } from "@/features/post-approvals/components/PostApprovalsSection";
import { useTeamReviewerAccess } from "@/features/post-approvals/providers/teamReviewerAccessContext";
import { PageShell } from "@/shared/components/PageShell";

export function NotificationsPage() {
  const { canReview } = useTeamReviewerAccess();

  return (
    <PageShell
      heading="Notifications"
      description="Requests and alerts that need a response from your team."
    >
      {canReview ? (
        <PostApprovalsSection />
      ) : (
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">You're all caught up</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Nothing needs your attention right now.
          </p>
        </div>
      )}
    </PageShell>
  );
}
