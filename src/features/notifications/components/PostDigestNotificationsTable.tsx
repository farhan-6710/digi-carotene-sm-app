import { format } from "date-fns";
import { Loader2, X } from "lucide-react";

import { postDigestDirectoryConfig } from "@/features/notifications/constants/notificationTypes";
import type { PostDigestNotificationsTableProps } from "@/features/notifications/types/components";
import type { AppNotification } from "@/features/notifications/types/types";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

function PostDigestRow({
  notification,
  isDismissing,
  onDismiss,
}: {
  notification: AppNotification;
  isDismissing: boolean;
  onDismiss: (notificationId: string) => void;
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-4 px-6 py-4",
        postDigestDirectoryConfig.gridClass,
      )}
    >
      <p className="min-w-0 truncate text-sm font-medium text-foreground">
        {notification.title}
      </p>
      <p className="min-w-0 truncate text-sm text-muted-foreground">
        {notification.message}
      </p>
      <p className="text-sm text-muted-foreground">
        {format(new Date(notification.created_at), "MMM d, yyyy")}
      </p>
      <div className="flex items-center justify-end">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isDismissing}
          aria-label="Dismiss notification"
          onClick={() => onDismiss(notification.id)}
        >
          {isDismissing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <X className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export function PostDigestNotificationsTable({
  notifications,
  isLoading,
  dismissingId,
  onDismiss,
}: PostDigestNotificationsTableProps) {
  return (
    <DirectoryTable
      title={postDigestDirectoryConfig.title}
      description={postDigestDirectoryConfig.description}
      gridClass={postDigestDirectoryConfig.gridClass}
      columns={[...postDigestDirectoryConfig.columns]}
      emptyMessage={postDigestDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={notifications.length === 0}
    >
      {notifications.map((notification) => (
        <PostDigestRow
          key={notification.id}
          notification={notification}
          isDismissing={dismissingId === notification.id}
          onDismiss={onDismiss}
        />
      ))}
    </DirectoryTable>
  );
}
