import type { LeadAttachmentFormValues } from "@/features/crm/utils/leadActivityFormUtils";
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

type LeadAttachmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving?: boolean;
  values: LeadAttachmentFormValues;
  onFieldChange: <K extends keyof LeadAttachmentFormValues>(
    field: K,
    value: LeadAttachmentFormValues[K],
  ) => void;
  onSave: () => void;
};

export function LeadAttachmentDialog({
  open,
  onOpenChange,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
}: LeadAttachmentDialogProps) {
  const canSave = values.url.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attach link</DialogTitle>
          <DialogDescription>
            Store a link with this lead (proposal, deck, sheet, etc.).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label className="block text-xs font-semibold text-muted-foreground">
            Link URL
            <input
              type="url"
              value={values.url}
              onChange={(event) => onFieldChange("url", event.target.value)}
              disabled={isSaving}
              placeholder="https://"
              className={cn(formFieldClassName, "mt-2")}
            />
          </label>
          <label className="block text-xs font-semibold text-muted-foreground">
            Label (optional)
            <input
              type="text"
              value={values.label}
              onChange={(event) => onFieldChange("label", event.target.value)}
              disabled={isSaving}
              placeholder="e.g. Proposal PDF"
              className={cn(formFieldClassName, "mt-2")}
            />
          </label>
        </div>

        <DialogFooter>
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
            Attach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
