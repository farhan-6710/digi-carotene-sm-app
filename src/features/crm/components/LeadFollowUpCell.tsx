import { useState } from "react";
import { Check, MoreHorizontal, PhoneOff, CalendarClock } from "lucide-react";

import { LeadFollowUpBadge } from "@/features/crm/components/LeadFollowUpBadge";
import { LeadFollowUpDialog } from "@/features/crm/components/LeadFollowUpDialog";
import type { LeadFollowUpCellProps } from "@/features/crm/types/components";
import { formatLeadDateTime } from "@/features/crm/utils/leadActivityDisplayUtils";
import {
  EMPTY_LEAD_FOLLOW_UP_FORM,
  leadFollowUpFormToInput,
  leadFollowUpToFormValues,
  type LeadFollowUpFormValues,
} from "@/features/crm/utils/leadFollowUpFormUtils";
import {
  isFollowUpOverdue,
  isFollowUpUpcoming,
} from "@/features/crm/utils/leadFollowUpScheduleUtils";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function LeadFollowUpCell({
  followUp,
  canEdit,
  isSaving = false,
  onUpdateStatus,
  onReschedule,
}: LeadFollowUpCellProps) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [values, setValues] = useState<LeadFollowUpFormValues>(
    EMPTY_LEAD_FOLLOW_UP_FORM,
  );

  if (!followUp) {
    return <span className="text-muted-foreground/50">—</span>;
  }

  const overdue = isFollowUpOverdue(followUp);
  const upcoming = isFollowUpUpcoming(followUp);

  const openReschedule = () => {
    setValues(leadFollowUpToFormValues(followUp));
    setRescheduleOpen(true);
  };

  return (
    <div className="min-w-0 space-y-1.5" onClick={stopDirectoryRowNav}>
      <p className="truncate text-sm text-foreground">
        {formatLeadDateTime(followUp.follow_up_date, followUp.follow_up_time)}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        {overdue ? (
          <LeadFollowUpBadge kind="overdue" />
        ) : upcoming ? (
          <LeadFollowUpBadge kind="upcoming" />
        ) : (
          <LeadFollowUpBadge kind={followUp.status} />
        )}
        {canEdit && overdue ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={isSaving}
                aria-label="Update follow-up"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              <DropdownMenuItem
                disabled={isSaving}
                onSelect={() => void onUpdateStatus(followUp.id, "done")}
              >
                <Check className="size-3.5" />
                Mark done
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isSaving}
                onSelect={() =>
                  void onUpdateStatus(followUp.id, "didnt_respond")
                }
              >
                <PhoneOff className="size-3.5" />
                No response
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isSaving}
                onSelect={openReschedule}
              >
                <CalendarClock className="size-3.5" />
                Reschedule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      {canEdit ? (
        <LeadFollowUpDialog
          open={rescheduleOpen}
          onOpenChange={setRescheduleOpen}
          isEditing
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
                await onReschedule(followUp.id, input);
                setRescheduleOpen(false);
              } catch {
                // Caller toasts.
              }
            })();
          }}
        />
      ) : null}
    </div>
  );
}
