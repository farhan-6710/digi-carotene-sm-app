import { ChatHeaderButton } from "@/features/chat/components/ChatHeaderButton";
import { TeamNotificationsHeaderButton } from "@/features/notifications/components/TeamNotificationsHeaderButton";
import { TeamTodosHeaderButton } from "@/features/team-portal/components/TeamTodosHeaderButton";

/** Team portal header actions: to-dos + chat + notifications. */
export function TeamHeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <TeamTodosHeaderButton />
      <ChatHeaderButton />
      <TeamNotificationsHeaderButton />
    </div>
  );
}
