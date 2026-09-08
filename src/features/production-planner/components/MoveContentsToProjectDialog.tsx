import { useEffect, useMemo, useState } from "react";

import type { MoveContentsToProjectDialogProps } from "@/features/production-planner/types/components";
import { Button } from "@/shared/ui/button";
import { ComboBox } from "@/shared/ui/ComboBox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

export function MoveContentsToProjectDialog({
  open,
  onOpenChange,
  selectedCount,
  projects,
  isLoadingProjects,
  isMoving,
  onConfirm,
}: MoveContentsToProjectDialogProps) {
  const [projectId, setProjectId] = useState("");

  const options = useMemo(
    () =>
      projects.map((project) => ({
        value: project.id,
        label: project.label,
      })),
    [projects],
  );

  useEffect(() => {
    if (!open) {
      setProjectId("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Move to project</DialogTitle>
          <DialogDescription>
            Create {selectedCount} post{selectedCount === 1 ? "" : "s"} on the
            postings calendar under one of this client&apos;s SM projects.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            SM project
          </p>
          <ComboBox
            value={projectId}
            onChange={setProjectId}
            options={options}
            isLoading={isLoadingProjects}
            disabled={isMoving || (!isLoadingProjects && projects.length === 0)}
            placeholder="Select an SM project"
            listTitle="Select SM project"
            emptyMessage="No SM projects found for this client."
            mode="value"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isMoving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!projectId || isMoving || projects.length === 0}
            onClick={() => onConfirm(projectId)}
          >
            {isMoving ? "Moving…" : "Move to calendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
