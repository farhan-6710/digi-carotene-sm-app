import { useCallback, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProjectChat } from "@/features/chat/hooks/useProjectChat";
import type { ProjectMessage } from "@/features/chat/types/projectMessage";
import {
  buildProjectChatParticipants,
  canUseProjectChat,
} from "@/features/chat/utils/projectChatAccess";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { TaskChat } from "@/features/tasks-management/components/TaskChat";
import type { TaskMessage } from "@/features/tasks-management/types/types";
import type { TaskChatParticipant } from "@/features/tasks-management/utils/taskChatMentionUtils";
import { fetchProjectMessages } from "@/services/projectMessagesService";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { useFetch } from "@/shared/hooks/useFetch";

function toTaskMessage(message: ProjectMessage): TaskMessage {
  return {
    id: message.id,
    task_id: message.sm_project_id,
    author_team_member_id: message.author_team_member_id,
    author_client_id: message.author_client_id,
    body: message.body,
    mentioned_team_member_ids: message.mentioned_team_member_ids,
    mentioned_client_ids: message.mentioned_client_ids,
    created_at: message.created_at,
    author: message.author,
    author_client: message.author_client,
  };
}

function toTaskParticipants(
  participants: ReturnType<typeof buildProjectChatParticipants>,
): TaskChatParticipant[] {
  return participants.map((participant) => ({
    id: participant.id,
    member_name: participant.member_name,
    roles: [],
    kind: participant.kind,
  }));
}

type ProjectChatSectionProps = {
  project: ProjectListItem;
  teamMembers: Array<{ id: string; member_name: string }>;
};

export function ProjectChatSection({
  project,
  teamMembers,
}: ProjectChatSectionProps) {
  const { teamMemberId, clientId, teamRole } = useAuth();
  const [chatError, setChatError] = useState<string | null>(null);

  const allowed = canUseProjectChat({
    project,
    teamMemberId,
    clientId,
    teamRole,
  });

  const load = useCallback(() => {
    if (!allowed) return Promise.resolve([] as ProjectMessage[]);
    return fetchProjectMessages(project.id);
  }, [allowed, project.id]);

  const { data: messages, isLoading, reload } = useFetch(load, []);

  const chatParticipants = useMemo(
    () =>
      buildProjectChatParticipants({
        project,
        teamMembers,
        excludeId: teamMemberId ?? clientId,
      }),
    [clientId, project, teamMemberId, teamMembers],
  );

  const taskParticipants = useMemo(
    () => toTaskParticipants(chatParticipants),
    [chatParticipants],
  );

  const chat = useProjectChat({
    smProjectId: project.id,
    chatParticipants,
    reload,
    setError: setChatError,
  });

  if (!allowed) return null;

  return (
    <section className="space-y-3">
      {chatError ? <ErrorBanner message={chatError} /> : null}
      <TaskChat
        title="Project chat"
        description="Message the client, manager, and project team. Use @ to mention someone. Refresh for new replies."
        placeholder="Write a message… @ people"
        emptyPeopleMessage="No matching people on this project."
        enableSubtaskMentions={false}
        messages={messages.map(toTaskMessage)}
        currentTeamMemberId={teamMemberId}
        currentClientId={clientId}
        chatParticipants={taskParticipants}
        draft={chat.draft}
        onDraftChange={chat.setDraft}
        onSend={() => void chat.sendMessage()}
        onRefresh={() => void reload()}
        isSending={chat.isSending}
        isRefreshing={isLoading}
        editingMessageId={chat.editingMessageId}
        onEditMessage={(message) => {
          const original = messages.find((row) => row.id === message.id);
          if (original) chat.startEdit(original);
        }}
        onCancelEdit={chat.cancelEdit}
        onDeleteMessage={chat.requestDelete}
        deleteConfirmOpen={chat.deleteConfirmOpen}
        onDeleteConfirmOpenChange={chat.onDeleteConfirmOpenChange}
        onConfirmDelete={() => void chat.confirmDelete()}
        isDeleting={chat.isDeleting}
      />
    </section>
  );
}
