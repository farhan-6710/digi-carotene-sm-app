import { useState } from "react";
import { ExternalLink, Link2, Plus, Trash2 } from "lucide-react";

import { LeadAttachmentDialog } from "@/features/crm/components/LeadAttachmentDialog";
import type { LeadAttachmentsSectionProps } from "@/features/crm/types/components";
import {
  EMPTY_LEAD_ATTACHMENT_FORM,
  type LeadAttachmentFormValues,
} from "@/features/crm/utils/leadActivityFormUtils";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";

export function LeadAttachmentsSection({
  attachments,
  canEdit,
  isSaving = false,
  onAdd,
  onDelete,
}: LeadAttachmentsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [values, setValues] = useState<LeadAttachmentFormValues>(
    EMPTY_LEAD_ATTACHMENT_FORM,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openAttach = () => {
    setValues(EMPTY_LEAD_ATTACHMENT_FORM);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      await onAdd({
        url: values.url,
        label: values.label.trim() || null,
      });
      setDialogOpen(false);
    } catch {
      // Caller toasts.
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Attachments
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Links stored with this lead.
          </p>
        </div>
        {canEdit ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={isSaving}
            onClick={openAttach}
          >
            <Plus className="mr-1.5 size-3.5" />
            Attach
          </Button>
        ) : null}
      </div>

      <div className="px-6 py-5">
        {attachments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No attachments
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <Link2
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
                  >
                    <span className="truncate">
                      {attachment.label?.trim() || attachment.url}
                    </span>
                    <ExternalLink className="size-3.5 shrink-0 opacity-60" />
                  </a>
                  {attachment.label?.trim() ? (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {attachment.url}
                    </p>
                  ) : null}
                </div>
                {canEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                    disabled={isSaving}
                    aria-label="Delete attachment"
                    onClick={() => setPendingDeleteId(attachment.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <LeadAttachmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isSaving={isSaving}
        values={values}
        onFieldChange={(field, value) =>
          setValues((current) => ({ ...current, [field]: value }))
        }
        onSave={() => void handleSave()}
      />

      <ConfirmationModal
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
        title="Delete attachment?"
        description="This removes the link from the lead. This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          if (!pendingDeleteId) return;
          try {
            await onDelete(pendingDeleteId);
            setPendingDeleteId(null);
          } catch {
            // Caller toasts.
          }
        }}
      />
    </div>
  );
}
