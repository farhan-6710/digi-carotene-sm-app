import { Pencil } from "lucide-react";

import { LeadFollowUpCell } from "@/features/crm/components/LeadFollowUpCell";
import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { LEAD_STATUS_LABELS } from "@/features/crm/constants/leadStatuses";
import {
  LEADS_BULK_ROW_GRID_CLASS,
  LEADS_ROW_GRID_CLASS,
} from "@/features/crm/constants/leadsDirectory";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { buildLeadDetailPath } from "@/features/crm/constants/routes";
import type { LeadsTableRowProps } from "@/features/crm/types/components";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function LeadsTableRow({
  lead,
  nextFollowUp,
  canEdit,
  canDelete = false,
  selected = false,
  onToggleSelect,
  isSavingFollowUp = false,
  onEditLead,
  onUpdateFollowUpStatus,
  onRescheduleFollowUp,
}: LeadsTableRowProps) {
  return (
    <DirectoryTableRow
      to={buildLeadDetailPath(lead.id)}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        canDelete ? LEADS_BULK_ROW_GRID_CLASS : LEADS_ROW_GRID_CLASS,
      )}
    >
      {canDelete && onToggleSelect ? (
        <DirectoryBulkCheckbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(lead.id)}
          ariaLabel={`Select ${lead.name}`}
        />
      ) : null}
      <div className="text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          NAME
        </span>
        {lead.name}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          COMPANY
        </span>
        {lead.company || <span className="text-muted-foreground/50">—</span>}
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          EMAIL
        </span>
        <span className="block truncate">
          {lead.email || <span className="text-muted-foreground/50">—</span>}
        </span>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PHONE
        </span>
        {lead.phone || <span className="text-muted-foreground/50">—</span>}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          INDUSTRY
        </span>
        {lead.industry || <span className="text-muted-foreground/50">—</span>}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          SCORE
        </span>
        {lead.lead_score}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          STATUS
        </span>
        {LEAD_STATUS_LABELS[lead.status]}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          SOURCE
        </span>
        {LEAD_SOURCE_LABELS[lead.lead_source]}
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          FOLLOW-UP
        </span>
        <LeadFollowUpCell
          followUp={nextFollowUp}
          canEdit={canEdit}
          isSaving={isSavingFollowUp}
          onUpdateStatus={onUpdateFollowUpStatus}
          onReschedule={onRescheduleFollowUp}
        />
      </div>

      <div className="flex justify-end gap-2 text-right">
        {canEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={(event) => {
              stopDirectoryRowNav(event);
              onEditLead(lead);
            }}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit Lead</span>
          </Button>
        ) : null}
      </div>
    </DirectoryTableRow>
  );
}
