import { ChatHeaderButton } from "@/features/chat/components/ChatHeaderButton";
import { TeamNotificationsHeaderButton } from "@/features/notifications/components/TeamNotificationsHeaderButton";

/** Team portal header actions: chat + notifications. */
export function TeamHeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <ChatHeaderButton />
      <TeamNotificationsHeaderButton />
    </div>
  );
}
