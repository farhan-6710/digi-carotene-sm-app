import { format } from "date-fns";
import { Loader2, X } from "lucide-react";

import { taskNotificationsDirectoryConfig } from "@/features/notifications/constants/notificationTypes";
import type { TaskNotificationsTableProps } from "@/features/notifications/types/components";
import {
  buildTaskDetailPath,
  TASKS_MANAGEMENT_PATH,
} from "@/features/tasks-management/constants/routes";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function TaskNotificationsTable({
  notifications,
  isLoading,
  dismissingId,
  onDismiss,
}: TaskNotificationsTableProps) {
  return (
    <DirectoryTable
      title={taskNotificationsDirectoryConfig.title}
      description={taskNotificationsDirectoryConfig.description}
      gridClass={taskNotificationsDirectoryConfig.gridClass}
      columns={[...taskNotificationsDirectoryConfig.columns]}
      emptyMessage={taskNotificationsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={notifications.length === 0}
    >
      {notifications.map((notification) => (
        <DirectoryTableRow
          key={notification.id}
          to={
            notification.related_id
              ? buildTaskDetailPath(notification.related_id)
              : TASKS_MANAGEMENT_PATH
          }
          className={cn(
            "grid items-center gap-4 px-6 py-4",
            taskNotificationsDirectoryConfig.gridClass,
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
              disabled={dismissingId === notification.id}
              aria-label="Dismiss notification"
              onClick={(event) => {
                stopDirectoryRowNav(event);
                onDismiss(notification.id);
              }}
            >
              {dismissingId === notification.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
            </Button>
          </div>
        </DirectoryTableRow>
      ))}
    </DirectoryTable>
  );
}
