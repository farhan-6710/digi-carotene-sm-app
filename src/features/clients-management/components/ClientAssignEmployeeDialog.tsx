import { useState } from "react";

import type { ClientAssignEmployeeDialogProps } from "@/features/clients-management/types/components";
import { EmployeeCombobox } from "@/features/employees-management/components/EmployeeCombobox";
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

export function ClientAssignEmployeeDialog({
  open,
  onOpenChange,
  activeMemberIds,
  isSaving,
  onAssign,
}: ClientAssignEmployeeDialogProps) {
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedMemberId("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Team Member</DialogTitle>
          <DialogDescription>
            Choose someone to add to this client&apos;s active workload.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <EmployeeCombobox
              value={selectedMemberId}
              onChange={setSelectedMemberId}
              activeEmployeeIds={activeMemberIds}
              disabled={isSaving}
              placeholder="e.g. Jane Smith"
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
            disabled={!selectedMemberId || isSaving}
            onClick={async () => {
              await onAssign(selectedMemberId);
              handleOpenChange(false);
            }}
          >
            {isSaving ? "Assigning..." : "Assign Team Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
