import type {
  NOTIFICATION_STATUSES,
  NOTIFICATION_TYPES,
} from "@/features/notifications/constants/notificationTypes";

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export type AppNotification = {
  id: string;
  recipient_team_member_id: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  related_id: string | null;
  created_at: string;
  read_at: string | null;
};

export type CreateNotificationInput = {
  recipientTeamMemberId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  relatedId?: string | null;
};
