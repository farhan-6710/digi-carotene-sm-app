import { useState } from "react";

import { PostDialogFormFields } from "@/features/posts-management/components/PostDialogFormFields";
import type { PostDialogProps } from "@/features/posts-management/types/components";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

export function PostDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  statusOptions,
  values,
  patchValues,
  onSave,
  onDelete,
}: PostDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const canSave =
    values.clientName.trim() &&
    values.toBePostedOn?.time.trim() &&
    values.toBePostedOn.day &&
    values.toBePostedOn.month &&
    values.toBePostedOn.year;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>{isEditing ? "Edit Post" : "Add Post"}</DialogTitle>
            <DialogDescription>
              Set the client name, post title, social platforms, planned publish
              time, status, and actual publish time.
            </DialogDescription>
          </DialogHeader>

          <PostDialogFormFields
            values={values}
            statusOptions={statusOptions}
            disabled={isSaving}
            patchValues={patchValues}
          />

          <DialogFooter className="shrink-0 border-t border-border/60 pt-4">
            {isEditing && onDelete ? (
              <Button
                variant="destructive"
                onClick={() => setIsConfirmOpen(true)}
                className="mr-auto"
                disabled={isSaving}
              >
                Remove Post
              </Button>
            ) : null}
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={onSave}
              disabled={!canSave || isSaving}
              className="rounded-full"
            >
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove post?</DialogTitle>
            <DialogDescription>
              This removes the post from the current day. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.();
                setIsConfirmOpen(false);
              }}
              disabled={isSaving}
            >
              Remove Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
