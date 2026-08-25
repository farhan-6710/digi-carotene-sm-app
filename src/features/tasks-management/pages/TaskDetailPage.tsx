import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { SubtasksSection } from "@/features/tasks-management/components/SubtasksSection";
import { TaskChat } from "@/features/tasks-management/components/TaskChat";
import { TaskDetailSummary } from "@/features/tasks-management/components/TaskDetailSummary";
import {
  buildSubtaskDetailPath,
  TASKS_MANAGEMENT_PATH,
} from "@/features/tasks-management/constants/routes";
import { useTaskChat } from "@/features/tasks-management/hooks/useTaskChat";
import { useTaskDetailQuery } from "@/features/tasks-management/hooks/useTaskDetailQuery";
import { useSubtasksQuery } from "@/features/tasks-management/hooks/useSubtasksQuery";
import { buildTaskChatParticipants } from "@/features/tasks-management/utils/taskChatMentionUtils";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function TaskDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={TASKS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to tasks
      </Link>
    </Button>
  );
}

export function TaskDetailPage() {
  const { taskId = "" } = useParams();
  const { teamMemberId } = useAuth();
  const { task, messages, adminMembers, isLoading, error, setError, reload } =
    useTaskDetailQuery(taskId);
  const { subtasks } = useSubtasksQuery(taskId);
  const { draft, setDraft, isSending, sendMessage } = useTaskChat({
    taskId,
    reload,
    setError,
  });

  const chatParticipants = useMemo(
    () =>
      task ? buildTaskChatParticipants(task, { admins: adminMembers }) : [],
    [adminMembers, task],
  );
  const chatSubtasks = useMemo(
    () => subtasks.map((subtask) => ({ id: subtask.id, title: subtask.title })),
    [subtasks],
  );

  if (isLoading && !task) {
    return <DetailPageLoading backButton={<TaskDetailBackButton />} />;
  }

  if (!task) {
    return (
      <section className="space-y-4">
        <PageHeader
          heading="Task"
          description="Task details and chat."
          backButton={<TaskDetailBackButton />}
        />
        <ErrorBanner message={error ?? "Task not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={task.title}
        description="Review this task and chat with everyone involved."
        backButton={<TaskDetailBackButton />}
      />
      {error ? <ErrorBanner message={error} /> : null}
      <div className="grid items-start gap-4 lg:grid-cols-2 lg:items-stretch">
        <TaskDetailSummary task={task} />
        <TaskChat
          messages={messages}
          currentTeamMemberId={teamMemberId}
          chatParticipants={chatParticipants}
          subtasks={chatSubtasks}
          draft={draft}
          onDraftChange={setDraft}
          onSend={() => void sendMessage()}
          onRefresh={() => void reload()}
          isSending={isSending}
          isRefreshing={isLoading}
        />
      </div>
      <SubtasksSection
        parentTask={task}
        buildDetailPath={(subtaskId) =>
          buildSubtaskDetailPath(task.id, subtaskId)
        }
      />
    </PageContent>
  );
}
