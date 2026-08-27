import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";

import { LeadAddressCard } from "@/features/crm/components/LeadAddressCard";
import { LeadAttachmentsSection } from "@/features/crm/components/LeadAttachmentsSection";
import { LeadClosedActivitiesSection } from "@/features/crm/components/LeadClosedActivitiesSection";
import { LeadDialog } from "@/features/crm/components/LeadDialog";
import { LeadNotesSection } from "@/features/crm/components/LeadNotesSection";
import { LeadOpenActivitiesSection } from "@/features/crm/components/LeadOpenActivitiesSection";
import { LeadProfileCard } from "@/features/crm/components/LeadProfileCard";
import { LEADS_MANAGEMENT_PATH } from "@/features/crm/constants/routes";
import { useLeadDetailActions } from "@/features/crm/hooks/useLeadDetailActions";
import { useLeadDetailQuery } from "@/features/crm/hooks/useLeadDetailQuery";
import { useLeadDialog } from "@/features/crm/hooks/useLeadDialog";
import { isLeadActivityOpen } from "@/features/crm/utils/leadActivityFormUtils";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

function LeadDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={LEADS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to leads
      </Link>
    </Button>
  );
}

export function LeadDetailPage() {
  const { leadId = "" } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canUpdate = can("leads.update");
  const {
    lead,
    notes,
    attachments,
    tasks,
    meetings,
    calls,
    isLoading,
    error,
    setError,
    reload,
  } = useLeadDetailQuery(leadId);
  const { openEditDialog, dialog } = useLeadDialog({
    reload,
    setError,
  });
  const actions = useLeadDetailActions({
    leadId,
    reload,
    setError,
  });

  const openTasks = useMemo(
    () => tasks.filter((task) => isLeadActivityOpen(task.status)),
    [tasks],
  );
  const closedTasks = useMemo(
    () => tasks.filter((task) => !isLeadActivityOpen(task.status)),
    [tasks],
  );
  const openMeetings = useMemo(
    () => meetings.filter((meeting) => isLeadActivityOpen(meeting.status)),
    [meetings],
  );
  const closedMeetings = useMemo(
    () => meetings.filter((meeting) => !isLeadActivityOpen(meeting.status)),
    [meetings],
  );
  const openCalls = useMemo(
    () => calls.filter((call) => isLeadActivityOpen(call.status)),
    [calls],
  );
  const closedCalls = useMemo(
    () => calls.filter((call) => !isLeadActivityOpen(call.status)),
    [calls],
  );

  const activityHandlers = {
    isSaving: actions.isSavingActivity,
    onSaveTask: async (
      taskId: string | null,
      input: Parameters<typeof actions.addTask>[0],
    ) => {
      if (taskId) await actions.saveTask(taskId, input);
      else await actions.addTask(input);
    },
    onDeleteTask: actions.removeTask,
    onSaveMeeting: async (
      meetingId: string | null,
      input: Parameters<typeof actions.addMeeting>[0],
    ) => {
      if (meetingId) await actions.saveMeeting(meetingId, input);
      else await actions.addMeeting(input);
    },
    onDeleteMeeting: actions.removeMeeting,
    onSaveCall: async (
      callId: string | null,
      input: Parameters<typeof actions.addCall>[0],
    ) => {
      if (callId) await actions.saveCall(callId, input);
      else await actions.addCall(input);
    },
    onDeleteCall: actions.removeCall,
  };

  if (isLoading && !lead) {
    return <DetailPageLoading backButton={<LeadDetailBackButton />} />;
  }

  if (!lead) {
    return (
      <section className="space-y-4">
        <PageHeader
          heading="Lead"
          description="Lead details."
          backButton={<LeadDetailBackButton />}
        />
        <ErrorBanner message={error ?? "Lead not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={lead.name}
        description="Review lead details, notes, attachments, and activities."
        backButton={<LeadDetailBackButton />}
        actions={
          canUpdate ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => openEditDialog(lead)}
            >
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
          ) : null
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <LeadProfileCard lead={lead} />
        <LeadAddressCard
          address={lead.address}
          canEdit={canUpdate}
          isSaving={actions.isSavingAddress}
          onSave={actions.saveAddress}
        />
      </div>

      <LeadNotesSection
        notes={notes}
        canEdit={canUpdate}
        isSaving={actions.isSavingNote}
        onAdd={actions.addNote}
        onSave={actions.saveNote}
        onDelete={actions.removeNote}
      />

      <LeadAttachmentsSection
        attachments={attachments}
        canEdit={canUpdate}
        isSaving={actions.isSavingAttachment}
        onAdd={actions.addAttachment}
        onDelete={actions.removeAttachment}
      />

      <LeadOpenActivitiesSection
        tasks={openTasks}
        meetings={openMeetings}
        calls={openCalls}
        canEdit={canUpdate}
        {...activityHandlers}
      />

      <LeadClosedActivitiesSection
        tasks={closedTasks}
        meetings={closedMeetings}
        calls={closedCalls}
        canEdit={canUpdate}
        {...activityHandlers}
      />

      {canUpdate ? (
        <LeadDialog
          {...dialog}
          onDelete={
            dialog.onDelete
              ? async () => {
                  await dialog.onDelete?.();
                  void navigate(LEADS_MANAGEMENT_PATH);
                }
              : undefined
          }
        />
      ) : null}
    </PageContent>
  );
}
