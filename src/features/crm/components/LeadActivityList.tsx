import { Pencil } from "lucide-react";

import {
  LEAD_ACTIVITY_PRIORITY_LABELS,
  LEAD_ACTIVITY_STATUS_LABELS,
} from "@/features/crm/constants/leadActivityStatuses";
import { LEAD_MEETING_VENUE_LABELS } from "@/features/crm/constants/leadMeetingVenues";
import type { LeadCall, LeadMeeting, LeadTask } from "@/features/crm/types/types";
import { formatLeadDateTime } from "@/features/crm/utils/leadActivityDisplayUtils";
import { Button } from "@/shared/ui/button";

function taskMeta(task: LeadTask): string {
  return `${formatLeadDateTime(task.eta_date, task.eta_time)} · ${LEAD_ACTIVITY_PRIORITY_LABELS[task.priority]} · ${LEAD_ACTIVITY_STATUS_LABELS[task.status]}`;
}

function meetingMeta(meeting: LeadMeeting): string {
  return `${formatLeadDateTime(meeting.from_date, meeting.from_time)} → ${formatLeadDateTime(meeting.to_date, meeting.to_time)} · ${LEAD_MEETING_VENUE_LABELS[meeting.venue]}`;
}

function callMeta(call: LeadCall): string {
  return `${formatLeadDateTime(call.start_date, call.start_time)} · ${call.duration_minutes} min · ${LEAD_ACTIVITY_STATUS_LABELS[call.status]}`;
}

type LeadActivityListProps =
  | {
      kind: "task";
      items: LeadTask[];
      canEdit: boolean;
      onEdit: (item: LeadTask) => void;
    }
  | {
      kind: "meeting";
      items: LeadMeeting[];
      canEdit: boolean;
      onEdit: (item: LeadMeeting) => void;
    }
  | {
      kind: "call";
      items: LeadCall[];
      canEdit: boolean;
      onEdit: (item: LeadCall) => void;
    };

export function LeadActivityList(props: LeadActivityListProps) {
  const { items, canEdit } = props;

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        No records found
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const meta =
          props.kind === "task"
            ? taskMeta(item as LeadTask)
            : props.kind === "meeting"
              ? meetingMeta(item as LeadMeeting)
              : callMeta(item as LeadCall);

        return (
          <li
            key={item.id}
            className="flex items-start gap-2 py-2.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {meta}
              </p>
            </div>
            {canEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-muted-foreground"
                aria-label={`Edit ${props.kind}`}
                onClick={() => {
                  if (props.kind === "task") props.onEdit(item as LeadTask);
                  else if (props.kind === "meeting")
                    props.onEdit(item as LeadMeeting);
                  else props.onEdit(item as LeadCall);
                }}
              >
                <Pencil className="size-3.5" />
              </Button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
