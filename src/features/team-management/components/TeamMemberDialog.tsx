import { useEffect, useState } from "react";

import { TeamMemberDialogFormFields } from "@/features/team-management/components/TeamMemberDialogFormFields";
import type { TeamMemberDialogProps } from "@/features/team-management/types/components";
import { validateTeamMemberForm } from "@/features/team-management/utils/teamMemberFormUtils";
import { isTeamMemberStillLinkedError } from "@/services/teamMembersService";
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
  const [isForceConfirmOpen, setIsForceConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
      setIsForceConfirmOpen(false);
    }
  }, [open]);

  const canSave = validateTeamMemberForm(values) === null;
  const memberName = values.memberName.trim() || "this team member";

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
                variant="destructive-outline"
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
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Team Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove Team Member?"
        description={`Remove "${memberName}" permanently? This action cannot be undone.`}
        confirmLabel="Remove"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          if (!onDelete) return;
          try {
            await onDelete();
            setIsConfirmOpen(false);
          } catch (error) {
            if (isTeamMemberStillLinkedError(error)) {
              setIsConfirmOpen(false);
              setIsForceConfirmOpen(true);
            }
          }
        }}
      />

      <ConfirmationModal
        open={isForceConfirmOpen}
        onOpenChange={setIsForceConfirmOpen}
        title="End work and remove?"
        description={`"${memberName}" is still linked to projects, tasks, or plans. End those assignments, hand off ownership, and remove this team member?`}
        confirmLabel="End work and remove"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          if (!onDelete) return;
          await onDelete({ force: true });
          setIsForceConfirmOpen(false);
        }}
      >
        <p className="text-sm font-medium text-destructive">
          Active projects they manage will be deactivated. Their tasks will be
          marked completed. Plans and seats will be ended or reassigned.
        </p>
      </ConfirmationModal>
    </>
  );
}
