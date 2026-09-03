import { ArrowLeft, Pencil } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { buildClientTaskDetailPath } from "@/features/client-portal/constants/taskRoutes";
import { useClientSubtaskDetailQuery } from "@/features/client-portal/hooks/useClientSubtaskDetailQuery";
import { SubtaskDetailSummary } from "@/features/tasks-management/components/SubtaskDetailSummary";
import { SubtaskDialog } from "@/features/tasks-management/components/SubtaskDialog";
import { useSubtaskDialog } from "@/features/tasks-management/hooks/useSubtaskDialog";
import { useTaskSubtaskAssigneeScope } from "@/features/tasks-management/hooks/useTaskSubtaskAssigneeScope";
import { canEditSubtaskAccess } from "@/features/tasks-management/utils/taskAccessUtils";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function ClientSubtaskDetailPage() {
  const { taskId = "", subtaskId = "" } = useParams();
  const navigate = useNavigate();
  const { teamRole, teamMemberId, clientId } = useAuth();
  const { parentTask, subtask, isLoading, error, setError, reload } =
    useClientSubtaskDetailQuery(taskId, subtaskId);

  const parentPath = buildClientTaskDetailPath(taskId);

  const { openEditDialog, dialog } = useSubtaskDialog({
    parentTask,
    parentTaskId: taskId,
    reload,
    setError,
  });

  const { allowedMemberIds, allowedClientIds } =
    useTaskSubtaskAssigneeScope(parentTask);

  const canEdit =
    subtask && parentTask
      ? canEditSubtaskAccess({
          subtask,
          parentTask,
          teamRole,
          teamMemberId,
          clientId,
        })
      : false;

  const backButton = (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={parentPath}>
        <ArrowLeft className="mr-2 size-4" />
        Back to task
      </Link>
    </Button>
  );

  if (isLoading && !subtask) {
    return <DetailPageLoading backButton={backButton} />;
  }

  if (!subtask || !parentTask) {
    return (
      <section className="space-y-4">
        <PageHeader
          heading="Subtask"
          description="Subtask details."
          backButton={backButton}
        />
        <ErrorBanner message={error ?? "Subtask not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={subtask.title}
        description="Review this subtask and its requirements."
        backButton={backButton}
        actions={
          canEdit ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => openEditDialog(subtask)}
            >
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
          ) : null
        }
      />
      {error ? <ErrorBanner message={error} /> : null}
      <div className="mx-auto w-full max-w-2xl">
        <SubtaskDetailSummary
          subtask={subtask}
          parentTaskTitle={parentTask.title}
        />
      </div>
      {canEdit ? (
        <SubtaskDialog
          {...dialog}
          allowedMemberIds={allowedMemberIds}
          allowedClientIds={allowedClientIds}
          onDelete={
            dialog.onDelete
              ? async () => {
                  await dialog.onDelete?.();
                  void navigate(parentPath);
                }
              : undefined
          }
        />
      ) : null}
    </PageContent>
  );
}
