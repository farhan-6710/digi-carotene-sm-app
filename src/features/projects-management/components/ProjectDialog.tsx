import { useEffect, useState } from "react";

import { ClientCombobox } from "@/features/clients-management/components/ClientCombobox";
import { ProjectDialogBasicFields } from "@/features/projects-management/components/ProjectDialogBasicFields";
import { ProjectDialogSocialFields } from "@/features/projects-management/components/ProjectDialogSocialFields";
import { ProjectManagerSelect } from "@/features/projects-management/components/ProjectManagerSelect";
import { ProjectTeamMembersSelect } from "@/features/projects-management/components/ProjectTeamMembersSelect";
import type { ProjectDialogProps } from "@/features/projects-management/types/components";
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

export function ProjectDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onClientChange,
  onManagerChange,
  onTeamMemberIdsChange,
  onSave,
  onDelete,
}: ProjectDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave =
    values.projectName.trim().length > 0 &&
    values.clientId.length > 0 &&
    values.managerId.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>{isEditing ? "Edit Project" : "Add Project"}</DialogTitle>
            <DialogDescription>
              Link a client, set social profile URLs, assign a manager, and add
              optional team members. Posts are created against projects.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            <ProjectDialogBasicFields
              values={values}
              onFieldChange={onFieldChange}
              disabled={isSaving}
            />

            <label className="block text-xs font-semibold text-muted-foreground">
              Client
              <div className="mt-2">
                <ClientCombobox
                  value={values.clientId}
                  onChange={onClientChange}
                  disabled={isSaving}
                  placeholder="e.g. Bloom Skincare"
                  preload={open}
                />
              </div>
            </label>

            <ProjectDialogSocialFields
              values={values}
              onFieldChange={onFieldChange}
              disabled={isSaving}
            />

            <label className="block text-xs font-semibold text-muted-foreground">
              Manager
              <div className="mt-2">
                <ProjectManagerSelect
                  value={values.managerId}
                  onChange={onManagerChange}
                  disabled={isSaving}
                />
              </div>
            </label>

            <ProjectTeamMembersSelect
              value={values.teamMemberIds}
              onChange={onTeamMemberIdsChange}
              excludeMemberIds={values.managerId ? [values.managerId] : []}
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
                Remove Project
              </Button>
            ) : null}
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={onSave} disabled={!canSave || isSaving}>
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove project?"
        description="This permanently deletes the project. Posts linked to it must be removed first."
        confirmLabel="Remove project"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          await onDelete?.();
          setIsConfirmOpen(false);
        }}
      />
    </>
  );
}
