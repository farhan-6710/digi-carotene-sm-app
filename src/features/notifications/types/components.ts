import type { AppNotification } from "@/features/notifications/types/types";

export type PostDigestNotificationsTableProps = {
  notifications: AppNotification[];
  isLoading: boolean;
  dismissingId: string | null;
  onDismiss: (notificationId: string) => void;
};

export type TaskNotificationsTableProps = {
  notifications: AppNotification[];
  isLoading: boolean;
  dismissingId: string | null;
  onDismiss: (notificationId: string) => void;
};
