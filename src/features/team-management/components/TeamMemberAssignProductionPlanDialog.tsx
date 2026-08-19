import { useState } from "react";

import { ProductionPlanMultiSelect } from "@/features/production-planner/components/ProductionPlanMultiSelect";
import type { TeamMemberAssignProductionPlanDialogProps } from "@/features/team-management/types/components";
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

export function TeamMemberAssignProductionPlanDialog({
  open,
  onOpenChange,
  activePlanIds,
  isSaving,
  onAssign,
}: TeamMemberAssignProductionPlanDialogProps) {
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedPlanIds([]);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign plans</DialogTitle>
          <DialogDescription>
            Choose one or more production plans to add to their active workload.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <span className="block text-xs font-semibold text-muted-foreground">
            Production plans
          </span>
          <ProductionPlanMultiSelect
            value={selectedPlanIds}
            onChange={setSelectedPlanIds}
            excludePlanIds={activePlanIds}
            disabled={isSaving}
            placeholder="e.g. August shoot (Bloom Skincare)"
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
            disabled={selectedPlanIds.length === 0 || isSaving}
            onClick={async () => {
              await onAssign(selectedPlanIds);
              handleOpenChange(false);
            }}
          >
            {isSaving
              ? "Assigning..."
              : selectedPlanIds.length > 1
                ? `Assign ${selectedPlanIds.length} plans`
                : "Assign plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
