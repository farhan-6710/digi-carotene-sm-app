import { NOTIFICATIONS_UPDATED_EVENT } from "@/features/notifications/constants/notificationTypes";

export function notifyNotificationsUpdated(): void {
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}
