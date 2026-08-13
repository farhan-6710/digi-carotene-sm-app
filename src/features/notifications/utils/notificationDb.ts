import type { AppNotification } from "@/features/notifications/types/types";
import type { NotificationType } from "@/features/notifications/types/types";
import type { NotificationStatus } from "@/features/notifications/types/types";

type NotificationDbRow = {
  id: string;
  recipient_team_member_id: string;
  notification_type: string;
  title: string;
  message: string;
  status: string;
  related_id: string | null;
  created_at: string;
  read_at: string | null;
};

export function mapDbRowToNotification(row: NotificationDbRow): AppNotification {
  return {
    id: row.id,
    recipient_team_member_id: row.recipient_team_member_id,
    notification_type: row.notification_type as NotificationType,
    title: row.title,
    message: row.message,
    status: row.status as NotificationStatus,
    related_id: row.related_id,
    created_at: row.created_at,
    read_at: row.read_at,
  };
}
