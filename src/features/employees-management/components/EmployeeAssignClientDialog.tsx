import { useState } from "react";

import { ClientCombobox } from "@/features/clients-management/components/ClientCombobox";
import type { EmployeeAssignClientDialogProps } from "@/features/employees-management/types/components";
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

export function EmployeeAssignClientDialog({
  open,
  onOpenChange,
  activeClientIds,
  isSaving,
  onAssign,
}: EmployeeAssignClientDialogProps) {
  const [selectedClientId, setSelectedClientId] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedClientId("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign client</DialogTitle>
          <DialogDescription>
            Choose a client to add to their active workload.
          </DialogDescription>
        </DialogHeader>

        <label className="block text-xs font-semibold text-muted-foreground">
          Client
          <div className="mt-2">
            <ClientCombobox
              value={selectedClientId}
              onChange={setSelectedClientId}
              activeClientIds={activeClientIds}
              disabled={isSaving}
              placeholder="e.g. Bloom Skincare"
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
            disabled={!selectedClientId || isSaving}
            onClick={async () => {
              await onAssign(selectedClientId);
              handleOpenChange(false);
            }}
          >
            {isSaving ? "Assigning..." : "Assign client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
