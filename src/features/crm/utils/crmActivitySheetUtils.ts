import { CRM_SHEET_ACTIVITY_KIND_LABELS } from "@/features/crm/constants/crmActivitySheet";
import {
  LEAD_ACTIVITY_PRIORITY_LABELS,
  LEAD_ACTIVITY_STATUS_LABELS,
} from "@/features/crm/constants/leadActivityStatuses";
import { LEAD_MEETING_VENUE_LABELS } from "@/features/crm/constants/leadMeetingVenues";
import type {
  CrmSheetActivity,
  Lead,
  LeadCall,
  LeadMeeting,
  LeadTask,
} from "@/features/crm/types/types";
import { formatLeadDateTime } from "@/features/crm/utils/leadActivityDisplayUtils";
import { isLeadActivityOpen } from "@/features/crm/utils/leadActivityFormUtils";

function leadNameById(leads: Lead[]): Map<string, string> {
  return new Map(leads.map((lead) => [lead.id, lead.name]));
}

function resolveLeadName(leads: Map<string, string>, leadId: string): string {
  return leads.get(leadId) ?? "Lead";
}

export function buildCrmSheetActivities(
  tasks: LeadTask[],
  meetings: LeadMeeting[],
  calls: LeadCall[],
  leads: Lead[],
): CrmSheetActivity[] {
  const names = leadNameById(leads);
  const rows: CrmSheetActivity[] = [];

  for (const task of tasks) {
    rows.push({
      id: `task-${task.id}`,
      kind: "task",
      title: task.title,
      leadId: task.lead_id,
      leadName: resolveLeadName(names, task.lead_id),
      status: task.status,
      meta: `${formatLeadDateTime(task.eta_date, task.eta_time)} · ${LEAD_ACTIVITY_PRIORITY_LABELS[task.priority]} · ${LEAD_ACTIVITY_STATUS_LABELS[task.status]}`,
    });
  }

  for (const meeting of meetings) {
    rows.push({
      id: `meeting-${meeting.id}`,
      kind: "meeting",
      title: meeting.title,
      leadId: meeting.lead_id,
      leadName: resolveLeadName(names, meeting.lead_id),
      status: meeting.status,
      meta: `${formatLeadDateTime(meeting.from_date, meeting.from_time)} · ${LEAD_MEETING_VENUE_LABELS[meeting.venue]} · ${LEAD_ACTIVITY_STATUS_LABELS[meeting.status]}`,
    });
  }

  for (const call of calls) {
    rows.push({
      id: `call-${call.id}`,
      kind: "call",
      title: call.title,
      leadId: call.lead_id,
      leadName: resolveLeadName(names, call.lead_id),
      status: call.status,
      meta: `${formatLeadDateTime(call.start_date, call.start_time)} · ${call.duration_minutes} min · ${LEAD_ACTIVITY_STATUS_LABELS[call.status]}`,
    });
  }

  return rows;
}

export function splitCrmSheetActivities(rows: CrmSheetActivity[]): {
  open: CrmSheetActivity[];
  closed: CrmSheetActivity[];
} {
  const open: CrmSheetActivity[] = [];
  const closed: CrmSheetActivity[] = [];
  for (const row of rows) {
    if (isLeadActivityOpen(row.status)) open.push(row);
    else closed.push(row);
  }
  return { open, closed };
}

export function crmActivityKindLabel(kind: CrmSheetActivity["kind"]): string {
  return CRM_SHEET_ACTIVITY_KIND_LABELS[kind];
}
