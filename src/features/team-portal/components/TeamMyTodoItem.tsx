import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  TEAM_TODO_STATUS_DOT_CLASS,
  TEAM_TODO_STATUS_LABELS,
} from "@/features/team-portal/constants/teamTodoStatuses";
import type { TeamTodo } from "@/features/team-portal/types/types";
import { formatTeamTodoEta } from "@/features/team-portal/utils/teamTodoDisplayUtils";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type TeamMyTodoItemProps = {
  todo: TeamTodo;
  isSaving?: boolean;
  onEdit: (todo: TeamTodo) => void;
  onDelete: (todoId: string) => Promise<void>;
};

export function TeamMyTodoItem({
  todo,
  isSaving = false,
  onEdit,
  onDelete,
}: TeamMyTodoItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canDelete = todo.status === "completed";

  return (
    <>
      <div className="flex items-start gap-3 px-1 py-3">
        <span
          className={cn(
            "mt-1.5 size-2 shrink-0 rounded-full",
            TEAM_TODO_STATUS_DOT_CLASS[todo.status],
          )}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-medium text-foreground">
              {todo.title}
            </p>
            <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {TEAM_TODO_STATUS_LABELS[todo.status]}
            </span>
          </div>
          {todo.description?.trim() ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {todo.description}
            </p>
          ) : null}
          <p className="mt-1.5 font-mono text-xs text-muted-foreground">
            {formatTeamTodoEta(todo.eta_date, todo.eta_time)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            aria-label="Edit to-do"
            disabled={isSaving}
            onClick={() => onEdit(todo)}
          >
            <Pencil className="size-3.5" />
          </Button>
          {canDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:bg-muted/60 hover:text-destructive"
              aria-label="Delete to-do"
              disabled={isSaving}
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete to-do?"
        description="This permanently removes the to-do. This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          try {
            await onDelete(todo.id);
            setConfirmOpen(false);
          } catch {
            // Caller toasts.
          }
        }}
      />
    </>
  );
}
