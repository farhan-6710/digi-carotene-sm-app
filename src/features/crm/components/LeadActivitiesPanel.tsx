import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

import { LeadActivityColumns } from "@/features/crm/components/LeadActivityColumns";
import { LeadCallDialog } from "@/features/crm/components/LeadCallDialog";
import { LeadMeetingDialog } from "@/features/crm/components/LeadMeetingDialog";
import { LeadTaskDialog } from "@/features/crm/components/LeadTaskDialog";
import type { LeadActivitiesSectionProps } from "@/features/crm/types/components";
import type { LeadCall, LeadMeeting, LeadTask } from "@/features/crm/types/types";
import {
  EMPTY_LEAD_CALL_FORM,
  EMPTY_LEAD_MEETING_FORM,
  EMPTY_LEAD_TASK_FORM,
  leadCallToFormValues,
  leadMeetingToFormValues,
  leadTaskToFormValues,
  type LeadCallFormValues,
  type LeadMeetingFormValues,
  type LeadTaskFormValues,
} from "@/features/crm/utils/leadActivityFormUtils";
import { toRepositoryDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type DialogKind = "task" | "meeting" | "call" | null;

type LeadActivitiesPanelProps = LeadActivitiesSectionProps & {
  title: string;
  description: string;
};

export function LeadActivitiesPanel({
  title,
  description,
  tasks,
  meetings,
  calls,
  canEdit,
  isSaving = false,
  showAddNew = false,
  onSaveTask,
  onDeleteTask,
  onSaveMeeting,
  onDeleteMeeting,
  onSaveCall,
  onDeleteCall,
}: LeadActivitiesPanelProps) {
  const [dialogKind, setDialogKind] = useState<DialogKind>(null);
  const [editingTask, setEditingTask] = useState<LeadTask | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<LeadMeeting | null>(
    null,
  );
  const [editingCall, setEditingCall] = useState<LeadCall | null>(null);
  const [taskValues, setTaskValues] =
    useState<LeadTaskFormValues>(EMPTY_LEAD_TASK_FORM);
  const [meetingValues, setMeetingValues] = useState<LeadMeetingFormValues>(
    EMPTY_LEAD_MEETING_FORM,
  );
  const [callValues, setCallValues] =
    useState<LeadCallFormValues>(EMPTY_LEAD_CALL_FORM);

  const openAdd = (kind: Exclude<DialogKind, null>) => {
    setEditingTask(null);
    setEditingMeeting(null);
    setEditingCall(null);
    setTaskValues(EMPTY_LEAD_TASK_FORM);
    setMeetingValues(EMPTY_LEAD_MEETING_FORM);
    setCallValues(EMPTY_LEAD_CALL_FORM);
    setDialogKind(kind);
  };

  const closeDialog = () => setDialogKind(null);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {canEdit && showAddNew ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={isSaving}
              >
                <Plus className="mr-1.5 size-3.5" />
                Add New
                <ChevronDown className="ml-1.5 size-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => openAdd("task")}>
                Task
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openAdd("meeting")}>
                Meeting
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openAdd("call")}>
                Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <div className="px-6 py-5">
        <LeadActivityColumns
          tasks={tasks}
          meetings={meetings}
          calls={calls}
          canEdit={canEdit}
          onEditTask={(task) => {
            setEditingTask(task);
            setTaskValues(leadTaskToFormValues(task));
            setDialogKind("task");
          }}
          onEditMeeting={(meeting) => {
            setEditingMeeting(meeting);
            setMeetingValues(leadMeetingToFormValues(meeting));
            setDialogKind("meeting");
          }}
          onEditCall={(call) => {
            setEditingCall(call);
            setCallValues(leadCallToFormValues(call));
            setDialogKind("call");
          }}
        />
      </div>

      <LeadTaskDialog
        open={dialogKind === "task"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        isEditing={Boolean(editingTask)}
        isSaving={isSaving}
        values={taskValues}
        onFieldChange={(field, value) =>
          setTaskValues((current) => ({ ...current, [field]: value }))
        }
        onSave={() => {
          void (async () => {
            try {
              await onSaveTask(editingTask?.id ?? null, {
                title: taskValues.title,
                description: taskValues.description || null,
                priority: taskValues.priority,
                status: taskValues.status,
              });
              closeDialog();
            } catch {
              // Caller toasts.
            }
          })();
        }}
        onDelete={
          editingTask
            ? async () => {
                await onDeleteTask(editingTask.id);
                closeDialog();
              }
            : undefined
        }
      />

      <LeadMeetingDialog
        open={dialogKind === "meeting"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        isEditing={Boolean(editingMeeting)}
        isSaving={isSaving}
        values={meetingValues}
        onFieldChange={(field, value) =>
          setMeetingValues((current) => ({ ...current, [field]: value }))
        }
        onSave={() => {
          void (async () => {
            const from = toRepositoryDateTime(meetingValues.from);
            const to = toRepositoryDateTime(meetingValues.to);
            if (!from || !to) return;
            try {
              await onSaveMeeting(editingMeeting?.id ?? null, {
                title: meetingValues.title,
                description: meetingValues.description || null,
                status: meetingValues.status,
                fromDate: from.date,
                fromTime: from.time,
                toDate: to.date,
                toTime: to.time,
                venue: meetingValues.venue,
              });
              closeDialog();
            } catch {
              // Caller toasts.
            }
          })();
        }}
        onDelete={
          editingMeeting
            ? async () => {
                await onDeleteMeeting(editingMeeting.id);
                closeDialog();
              }
            : undefined
        }
      />

      <LeadCallDialog
        open={dialogKind === "call"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        isEditing={Boolean(editingCall)}
        isSaving={isSaving}
        values={callValues}
        onFieldChange={(field, value) =>
          setCallValues((current) => ({ ...current, [field]: value }))
        }
        onSave={() => {
          void (async () => {
            const start = toRepositoryDateTime(callValues.start);
            if (!start) return;
            try {
              await onSaveCall(editingCall?.id ?? null, {
                title: callValues.title,
                description: callValues.description || null,
                status: callValues.status,
                startDate: start.date,
                startTime: start.time,
                durationMinutes: Number(callValues.durationMinutes),
              });
              closeDialog();
            } catch {
              // Caller toasts.
            }
          })();
        }}
        onDelete={
          editingCall
            ? async () => {
                await onDeleteCall(editingCall.id);
                closeDialog();
              }
            : undefined
        }
      />
    </div>
  );
}
