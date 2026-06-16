import { useEffect, useState } from "react";

import { TeamMemberDialogFormFields } from "@/features/team-management/components/TeamMemberDialogFormFields";
import type { TeamMemberDialogProps } from "@/features/team-management/types/components";
import { validateTeamMemberForm } from "@/features/team-management/utils/teamMemberFormUtils";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
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

export function TeamMemberDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: TeamMemberDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave = validateTeamMemberForm(values) === null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {isEditing ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
            <DialogDescription>
              Enter name, email, mobile number, and role. Name and email are
              required.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-1 pr-1">
            <TeamMemberDialogFormFields
              values={values}
              onFieldChange={onFieldChange}
              disabled={isSaving}
            />
          </div>

          <DialogFooter className="shrink-0 border-t border-border/60 pt-4">
            {isEditing && onDelete ? (
              <Button
                variant="destructive"
                onClick={() => setIsConfirmOpen(true)}
                className="mr-auto"
                disabled={isSaving}
              >
                Remove Team Member
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
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Team Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove Team Member?"
        description={`Remove "${values.memberName.trim()}" permanently? This action cannot be undone.`}
        confirmLabel="Remove"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          if (!onDelete) {
            return;
          }
          await onDelete();
          setIsConfirmOpen(false);
        }}
      />
    </>
  );
}
