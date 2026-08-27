import { useCallback, useState } from "react";

import type {
  CreateLeadAttachmentInput,
  CreateLeadCallInput,
  CreateLeadMeetingInput,
  CreateLeadTaskInput,
  LeadNote,
  UpdateLeadCallInput,
  UpdateLeadMeetingInput,
  UpdateLeadTaskInput,
} from "@/features/crm/types/types";
import {
  createLeadAttachment,
  createLeadCall,
  createLeadMeeting,
  createLeadTask,
  deleteLeadAttachment,
  deleteLeadCall,
  deleteLeadMeeting,
  deleteLeadTask,
  updateLeadCall,
  updateLeadMeeting,
  updateLeadTask,
} from "@/services/leadActivitiesService";
import {
  createLeadNote,
  deleteLeadNote,
  updateLeadAddress,
  updateLeadNote,
} from "@/services/leadsService";
import { showToast } from "@/shared/utils/showToast";

type UseLeadDetailActionsOptions = {
  leadId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useLeadDetailActions({
  leadId,
  reload,
  setError,
}: UseLeadDetailActionsOptions) {
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isSavingAttachment, setIsSavingAttachment] = useState(false);
  const [isSavingActivity, setIsSavingActivity] = useState(false);

  const runMutation = useCallback(
    async (
      action: () => Promise<unknown>,
      successMessage: string,
      failureFallback: string,
      setBusy: (busy: boolean) => void,
      busy: boolean,
    ) => {
      if (busy || !leadId) return;
      setBusy(true);
      setError(null);
      try {
        await action();
        showToast("success", successMessage);
        await reload();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : failureFallback;
        setError(message);
        showToast("error", message);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [leadId, reload, setError],
  );

  const saveAddress = useCallback(
    async (address: string) => {
      await runMutation(
        () => updateLeadAddress(leadId, { address }),
        "Address saved.",
        "Failed to save address.",
        setIsSavingAddress,
        isSavingAddress,
      );
    },
    [isSavingAddress, leadId, runMutation],
  );

  const addNote = useCallback(
    async (body: string) => {
      await runMutation(
        () => createLeadNote(leadId, body),
        "Note added.",
        "Failed to save note.",
        setIsSavingNote,
        isSavingNote,
      );
    },
    [isSavingNote, leadId, runMutation],
  );

  const saveNote = useCallback(
    async (note: LeadNote, body: string) => {
      await runMutation(
        () => updateLeadNote(note.id, body),
        "Note updated.",
        "Failed to update note.",
        setIsSavingNote,
        isSavingNote,
      );
    },
    [isSavingNote, runMutation],
  );

  const removeNote = useCallback(
    async (noteId: string) => {
      await runMutation(
        () => deleteLeadNote(noteId),
        "Note deleted.",
        "Failed to delete note.",
        setIsSavingNote,
        isSavingNote,
      );
    },
    [isSavingNote, runMutation],
  );

  const addAttachment = useCallback(
    async (input: CreateLeadAttachmentInput) => {
      await runMutation(
        () => createLeadAttachment(leadId, input),
        "Attachment added.",
        "Failed to add attachment.",
        setIsSavingAttachment,
        isSavingAttachment,
      );
    },
    [isSavingAttachment, leadId, runMutation],
  );

  const removeAttachment = useCallback(
    async (attachmentId: string) => {
      await runMutation(
        () => deleteLeadAttachment(attachmentId),
        "Attachment deleted.",
        "Failed to delete attachment.",
        setIsSavingAttachment,
        isSavingAttachment,
      );
    },
    [isSavingAttachment, runMutation],
  );

  const addTask = useCallback(
    async (input: CreateLeadTaskInput) => {
      await runMutation(
        () => createLeadTask(leadId, input),
        "Task created.",
        "Failed to create task.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, leadId, runMutation],
  );

  const saveTask = useCallback(
    async (taskId: string, input: UpdateLeadTaskInput) => {
      await runMutation(
        () => updateLeadTask(taskId, input),
        "Task updated.",
        "Failed to update task.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, runMutation],
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      await runMutation(
        () => deleteLeadTask(taskId),
        "Task deleted.",
        "Failed to delete task.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, runMutation],
  );

  const addMeeting = useCallback(
    async (input: CreateLeadMeetingInput) => {
      await runMutation(
        () => createLeadMeeting(leadId, input),
        "Meeting created.",
        "Failed to create meeting.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, leadId, runMutation],
  );

  const saveMeeting = useCallback(
    async (meetingId: string, input: UpdateLeadMeetingInput) => {
      await runMutation(
        () => updateLeadMeeting(meetingId, input),
        "Meeting updated.",
        "Failed to update meeting.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, runMutation],
  );

  const removeMeeting = useCallback(
    async (meetingId: string) => {
      await runMutation(
        () => deleteLeadMeeting(meetingId),
        "Meeting deleted.",
        "Failed to delete meeting.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, runMutation],
  );

  const addCall = useCallback(
    async (input: CreateLeadCallInput) => {
      await runMutation(
        () => createLeadCall(leadId, input),
        "Call created.",
        "Failed to create call.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, leadId, runMutation],
  );

  const saveCall = useCallback(
    async (callId: string, input: UpdateLeadCallInput) => {
      await runMutation(
        () => updateLeadCall(callId, input),
        "Call updated.",
        "Failed to update call.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, runMutation],
  );

  const removeCall = useCallback(
    async (callId: string) => {
      await runMutation(
        () => deleteLeadCall(callId),
        "Call deleted.",
        "Failed to delete call.",
        setIsSavingActivity,
        isSavingActivity,
      );
    },
    [isSavingActivity, runMutation],
  );

  return {
    isSavingAddress,
    isSavingNote,
    isSavingAttachment,
    isSavingActivity,
    saveAddress,
    addNote,
    saveNote,
    removeNote,
    addAttachment,
    removeAttachment,
    addTask,
    saveTask,
    removeTask,
    addMeeting,
    saveMeeting,
    removeMeeting,
    addCall,
    saveCall,
    removeCall,
  };
}
