import { useState } from "react";
import { Trash2 } from "lucide-react";

import { ConfirmationModal } from "@/shared/ConfirmationModal";
import type { DirectoryBulkDeleteBarProps } from "@/shared/types/components";
import { formatBulkDeleteMessage } from "@/shared/utils/directoryBulkDeleteUtils";
import { Button } from "@/shared/ui/button";

export function DirectoryBulkDeleteBar({
  selectedCount,
  singularLabel,
  pluralLabel,
  isDeleting = false,
  onClear,
  onConfirmDelete,
}: DirectoryBulkDeleteBarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (selectedCount <= 0) return null;

  return (
    <>
      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
        <span className="text-xs font-medium text-muted-foreground">
          {selectedCount} selected
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-full"
          disabled={isDeleting}
          onClick={onClear}
        >
          Clear
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-8 rounded-full"
          disabled={isDeleting}
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete selected?"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        loading={isDeleting}
        onConfirm={async () => {
          await onConfirmDelete();
          setConfirmOpen(false);
        }}
      >
        <p className="text-sm font-medium text-destructive">
          {formatBulkDeleteMessage(selectedCount, singularLabel, pluralLabel)}
        </p>
      </ConfirmationModal>
    </>
  );
}
