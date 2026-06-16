import { useState } from "react";

import { ProjectCombobox } from "@/features/projects-management/components/ProjectCombobox";
import type { TeamMemberAssignProjectDialogProps } from "@/features/team-management/types/components";
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

export function TeamMemberAssignProjectDialog({
  open,
  onOpenChange,
  activeProjectIds,
  isSaving,
  onAssign,
}: TeamMemberAssignProjectDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedProjectId("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign project</DialogTitle>
          <DialogDescription>
            Choose a project to add to their active workload.
          </DialogDescription>
        </DialogHeader>

        <label className="block text-xs font-semibold text-muted-foreground">
          Project
          <div className="mt-2">
            <ProjectCombobox
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              activeProjectIds={activeProjectIds}
              disabled={isSaving}
              placeholder="e.g. Summer Campaign (Bloom Skincare)"
              preload={open}
            />
          </div>
        </label>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="rounded-full"
            disabled={!selectedProjectId || isSaving}
            onClick={async () => {
              await onAssign(selectedProjectId);
              handleOpenChange(false);
            }}
          >
            {isSaving ? "Assigning..." : "Assign project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
