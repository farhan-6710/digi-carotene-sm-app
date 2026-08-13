import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  AppNotification,
  CreateNotificationInput,
  NotificationType,
} from "@/features/notifications/types/types";
import { mapDbRowToNotification } from "@/features/notifications/utils/notificationDb";
import { notifyNotificationsUpdated } from "@/features/notifications/utils/notificationsEvents";

export async function createNotifications(
  inputs: CreateNotificationInput[],
): Promise<void> {
  if (inputs.length === 0) {
    return;
  }

  const rows = inputs.map((input) => ({
    recipient_team_member_id: input.recipientTeamMemberId,
    notification_type: input.notificationType,
    title: input.title,
    message: input.message,
    related_id: input.relatedId ?? null,
    status: "unread",
  }));

  const { error } = await supabase.from(DB.NOTIFICATIONS.TABLE).insert(rows);

  if (error) {
    throw new Error(error.message ?? "Failed to create notifications.");
  }

  notifyNotificationsUpdated();
}

export async function fetchUnreadNotifications(
  recipientTeamMemberId: string,
  notificationType?: NotificationType,
): Promise<AppNotification[]> {
  let query = supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .select(DB.NOTIFICATIONS.SELECT)
    .eq("recipient_team_member_id", recipientTeamMemberId)
    .eq("status", "unread")
    .order("created_at", { ascending: false });

  if (notificationType) {
    query = query.eq("notification_type", notificationType);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapDbRowToNotification(row));
}

export async function countUnreadNotifications(
  recipientTeamMemberId: string,
  notificationType?: NotificationType,
): Promise<number> {
  let query = supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .select("id", { count: "exact", head: true })
    .eq("recipient_team_member_id", recipientTeamMemberId)
    .eq("status", "unread");

  if (notificationType) {
    query = query.eq("notification_type", notificationType);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function markNotificationRead(
  notificationId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .update({
      status: "read",
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("status", "unread");

  if (error) {
    throw new Error(error.message ?? "Failed to mark notification as read.");
  }

  notifyNotificationsUpdated();
}

export async function markNotificationsReadByRelatedId(
  relatedId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .update({
      status: "read",
      read_at: new Date().toISOString(),
    })
    .eq("related_id", relatedId)
    .eq("status", "unread");

  if (error) {
    throw new Error(error.message ?? "Failed to mark notifications as read.");
  }

  notifyNotificationsUpdated();
}
