import { useState } from "react";

import { ProjectMultiSelect } from "@/features/projects-management/components/ProjectMultiSelect";
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
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedProjectIds([]);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign projects</DialogTitle>
          <DialogDescription>
            Choose one or more projects to add to their active workload.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <span className="block text-xs font-semibold text-muted-foreground">
            Projects
          </span>
          <ProjectMultiSelect
            value={selectedProjectIds}
            onChange={setSelectedProjectIds}
            excludeProjectIds={activeProjectIds}
            disabled={isSaving}
            placeholder="e.g. Summer Campaign (Bloom Skincare)"
            preload={open}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="rounded-full"
            disabled={selectedProjectIds.length === 0 || isSaving}
            onClick={async () => {
              await onAssign(selectedProjectIds);
              handleOpenChange(false);
            }}
          >
            {isSaving
              ? "Assigning..."
              : selectedProjectIds.length > 1
                ? `Assign ${selectedProjectIds.length} projects`
                : "Assign project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
