import { useState } from "react";
import { Plus } from "lucide-react";

import { LeadFollowUpBadge } from "@/features/crm/components/LeadFollowUpBadge";
import { LeadFollowUpDialog } from "@/features/crm/components/LeadFollowUpDialog";
import { LEAD_FOLLOW_UP_STATUS_LABELS } from "@/features/crm/constants/leadFollowUpStatuses";
import type { LeadFollowUpsSectionProps } from "@/features/crm/types/components";
import type { LeadFollowUp } from "@/features/crm/types/types";
import { formatLeadDateTime } from "@/features/crm/utils/leadActivityDisplayUtils";
import {
  EMPTY_LEAD_FOLLOW_UP_FORM,
  leadFollowUpFormToInput,
  leadFollowUpToFormValues,
  type LeadFollowUpFormValues,
} from "@/features/crm/utils/leadFollowUpFormUtils";
import {
  isFollowUpOverdue,
  sortFollowUpsChronologically,
} from "@/features/crm/utils/leadFollowUpScheduleUtils";
import { Button } from "@/shared/ui/button";

export function LeadFollowUpsSection({
  followUps,
  canEdit,
  isSaving = false,
  onSave,
  onDelete,
}: LeadFollowUpsSectionProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeadFollowUp | null>(null);
  const [values, setValues] = useState<LeadFollowUpFormValues>(
    EMPTY_LEAD_FOLLOW_UP_FORM,
  );

  const rows = sortFollowUpsChronologically(followUps);

  const openAdd = () => {
    setEditing(null);
    setValues(EMPTY_LEAD_FOLLOW_UP_FORM);
    setOpen(true);
  };

  const openEdit = (row: LeadFollowUp) => {
    setEditing(row);
    setValues(leadFollowUpToFormValues(row));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
    setValues(EMPTY_LEAD_FOLLOW_UP_FORM);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Follow-ups
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Track call-backs. Mark no response before you drop a lead.
          </p>
        </div>
        {canEdit ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={openAdd}
          >
            <Plus className="mr-1.5 size-3.5" />
            Add
          </Button>
        ) : null}
      </div>

      <div className="px-6 py-5">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No follow-ups yet.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((row) => {
              const overdue = isFollowUpOverdue(row);
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    disabled={!canEdit || isSaving}
                    onClick={() => openEdit(row)}
                    className="flex w-full items-start justify-between gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/40 disabled:cursor-default disabled:hover:bg-muted/20"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {formatLeadDateTime(
                          row.follow_up_date,
                          row.follow_up_time,
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {LEAD_FOLLOW_UP_STATUS_LABELS[row.status]}
                      </p>
                      {row.note?.trim() ? (
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {row.note.trim()}
                        </p>
                      ) : null}
                    </div>
                    <div className="shrink-0">
                      {overdue ? (
                        <LeadFollowUpBadge kind="overdue" />
                      ) : row.status === "pending" ? (
                        <LeadFollowUpBadge kind="upcoming" />
                      ) : (
                        <LeadFollowUpBadge kind={row.status} />
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {canEdit ? (
        <LeadFollowUpDialog
          open={open}
          onOpenChange={(next) => {
            if (!next) close();
            else setOpen(true);
          }}
          isEditing={Boolean(editing)}
          isSaving={isSaving}
          values={values}
          onFieldChange={(field, value) =>
            setValues((current) => ({ ...current, [field]: value }))
          }
          onSave={() => {
            void (async () => {
              const input = leadFollowUpFormToInput(values);
              if (!input) return;
              try {
                await onSave(editing?.id ?? null, input);
                close();
              } catch {
                // Caller toasts.
              }
            })();
          }}
          onDelete={
            editing
              ? async () => {
                  await onDelete(editing.id);
                  close();
                }
              : undefined
          }
        />
      ) : null}
    </div>
  );
}
