import { useEffect, useState } from "react";

import { ClientCombobox } from "@/features/clients-management/components/ClientCombobox";
import { ProjectManagerSelect } from "@/features/projects-management/components/ProjectManagerSelect";
import { ProjectTeamMembersSelect } from "@/features/projects-management/components/ProjectTeamMembersSelect";
import type { DevProjectDialogProps } from "@/features/development-projects/types/components";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { ActiveStatusSwitchField } from "@/shared/components/ActiveStatusSwitchField";
import { formFieldClassName } from "@/shared/constants/formStyles";
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
import { cn } from "@/shared/lib/utils";

export function DevProjectDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  formSeeds = null,
  onFieldChange,
  onSave,
  onDelete,
}: DevProjectDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
            <DialogTitle>
              {isEditing ? "Edit Development Project" : "Add Development Project"}
            </DialogTitle>
            <DialogDescription>
              Link a client, assign a manager, and capture stack / environment
              links for this build.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            <label className="block text-xs font-semibold text-muted-foreground">
              Project name
              <input
                value={values.projectName}
                onChange={(e) => onFieldChange("projectName", e.target.value)}
                className={cn(formFieldClassName, "mt-2")}
                placeholder="e.g. Client Portal Rebuild"
                disabled={isSaving}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Client
              <div className="mt-2">
                <ClientCombobox
                  value={values.clientId}
                  onChange={(clientId) => onFieldChange("clientId", clientId)}
                  disabled={isSaving}
                  placeholder="Select client"
                  preload={open}
                  seedClient={formSeeds?.client}
                />
              </div>
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Manager
              <div className="mt-2">
                <ProjectManagerSelect
                  value={values.managerId}
                  onChange={(managerId) => onFieldChange("managerId", managerId)}
                  disabled={isSaving}
                  preload={open}
                  seedManager={formSeeds?.manager}
                />
              </div>
            </label>

            <ProjectTeamMembersSelect
              value={values.teamMemberIds}
              onChange={(teamMemberIds) =>
                onFieldChange("teamMemberIds", teamMemberIds)
              }
              excludeMemberIds={values.managerId ? [values.managerId] : []}
              disabled={isSaving}
              preload={open}
              seedMembers={formSeeds?.teamMembers ?? []}
            />

            <label className="block text-xs font-semibold text-muted-foreground">
              Description
              <textarea
                value={values.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                className={cn(formFieldClassName, "mt-2 min-h-20 resize-y")}
                placeholder="What is this project about?"
                disabled={isSaving}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Tech stack
              <input
                value={values.techStack}
                onChange={(e) => onFieldChange("techStack", e.target.value)}
                className={cn(formFieldClassName, "mt-2")}
                placeholder="e.g. React, Supabase, Bun"
                disabled={isSaving}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Repo URL
              <input
                value={values.repoUrl}
                onChange={(e) => onFieldChange("repoUrl", e.target.value)}
                className={cn(formFieldClassName, "mt-2")}
                placeholder="https://github.com/…"
                disabled={isSaving}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Staging URL
              <input
                value={values.stagingUrl}
                onChange={(e) => onFieldChange("stagingUrl", e.target.value)}
                className={cn(formFieldClassName, "mt-2")}
                placeholder="https://staging.…"
                disabled={isSaving}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Production URL
              <input
                value={values.productionUrl}
                onChange={(e) => onFieldChange("productionUrl", e.target.value)}
                className={cn(formFieldClassName, "mt-2")}
                placeholder="https://…"
                disabled={isSaving}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-muted-foreground">
                Start date
                <input
                  type="date"
                  value={values.startDate}
                  onChange={(e) => onFieldChange("startDate", e.target.value)}
                  className={cn(formFieldClassName, "mt-2")}
                  disabled={isSaving}
                />
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                ETA date
                <input
                  type="date"
                  value={values.etaDate}
                  onChange={(e) => onFieldChange("etaDate", e.target.value)}
                  className={cn(formFieldClassName, "mt-2")}
                  disabled={isSaving}
                />
              </label>
            </div>

            {isEditing ? (
              <ActiveStatusSwitchField
                entityLabel="project"
                checked={values.isActive}
                onCheckedChange={(isActive) =>
                  onFieldChange("isActive", isActive)
                }
                disabled={isSaving}
              />
            ) : null}
          </div>

          <DialogFooter className="shrink-0 gap-2 sm:justify-between">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive-outline"
                disabled={isSaving}
                onClick={() => setIsConfirmOpen(true)}
              >
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSaving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={isSaving || !canSave}
                onClick={onSave}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete development project?"
        description="This cannot be undone."
        confirmLabel="Delete"
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
