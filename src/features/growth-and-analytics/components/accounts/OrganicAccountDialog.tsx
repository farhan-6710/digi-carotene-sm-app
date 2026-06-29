import { useEffect, useState } from "react";

import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";
import { formFieldClassName } from "@/shared/constants/formStyles";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { GrowthStaticComboBox } from "../GrowthStaticComboBox";
import { platformOptions } from "../../constants/accountsData";
import type { OrganicAccountDialogProps } from "../../types/components";
import type { GrowthPlatform } from "../../types/types";

export function OrganicAccountDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: OrganicAccountDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave =
    values.accountName.trim() !== "" && values.accountId.trim() !== "";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {isEditing ? "Edit Organic Account" : "Connect Organic Account"}
            </DialogTitle>
            <DialogDescription>
              Link an Instagram or Facebook account to pull organic insights from Meta.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            <GrowthStaticComboBox
              label="Platform"
              value={values.platform}
              options={platformOptions}
              onChange={(value) =>
                onFieldChange("platform", value as GrowthPlatform)
              }
              placeholder="Select platform"
            />

            <label className="block text-xs font-semibold text-muted-foreground">
              Account name
              <input
                value={values.accountName}
                onChange={(event) => onFieldChange("accountName", event.target.value)}
                placeholder="e.g. Armario Pro"
                className={formFieldClassName}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Account ID
              <input
                value={values.accountId}
                onChange={(event) => onFieldChange("accountId", event.target.value)}
                placeholder="e.g. 17841400000000001"
                className={formFieldClassName}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Access token
              <input
                type="password"
                value={values.accessToken}
                onChange={(event) => onFieldChange("accessToken", event.target.value)}
                placeholder={
                  isEditing
                    ? "Paste a new token to refresh from Meta"
                    : "Paste the page access token"
                }
                className={formFieldClassName}
              />
            </label>
          </div>

          <DialogFooter className="shrink-0 border-t border-border/60 pt-4">
            {isEditing && onDelete ? (
              <Button
                variant="destructive-outline"
                onClick={() => setIsConfirmOpen(true)}
                className="mr-auto"
                disabled={isSaving}
              >
                Remove Account
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
                  : "Connect Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove organic account?"
        description="This removes the account and its stored metrics from the dashboards."
        confirmLabel="Remove account"
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
