import { useEffect, useState } from "react";

import { ClientDialogBasicFields } from "@/features/clients-management/components/ClientDialogBasicFields";
import { ClientDialogSocialFields } from "@/features/clients-management/components/ClientDialogSocialFields";
import type { ClientDialogProps } from "@/features/clients-management/types/components";
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

export function ClientDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: ClientDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave = values.clientName.trim().length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>{isEditing ? "Edit Client" : "Add Client"}</DialogTitle>
            <DialogDescription>
              Set the client name, mobile number, and website address. Client
              name is the only required field.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            <ClientDialogBasicFields
              values={values}
              onFieldChange={onFieldChange}
              disabled={isSaving}
            />
            <ClientDialogSocialFields
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
                Remove Client
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
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove client?"
        description={`Remove "${values.clientName.trim()}" permanently? If a portal login is linked to this brand, they will lose portal access until you assign another client.`}
        confirmLabel="Remove client"
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
