import { useCallback, useState } from "react";

import type { LeadNote } from "@/features/crm/types/types";
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

  const saveAddress = useCallback(
    async (address: string) => {
      if (isSavingAddress || !leadId) return;
      setIsSavingAddress(true);
      setError(null);
      try {
        await updateLeadAddress(leadId, { address });
        showToast("success", "Address saved.");
        await reload();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save address.";
        setError(message);
        showToast("error", message);
        throw err;
      } finally {
        setIsSavingAddress(false);
      }
    },
    [isSavingAddress, leadId, reload, setError],
  );

  const addNote = useCallback(
    async (body: string) => {
      if (isSavingNote || !leadId) return;
      setIsSavingNote(true);
      setError(null);
      try {
        await createLeadNote(leadId, body);
        showToast("success", "Note added.");
        await reload();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save note.";
        setError(message);
        showToast("error", message);
        throw err;
      } finally {
        setIsSavingNote(false);
      }
    },
    [isSavingNote, leadId, reload, setError],
  );

  const saveNote = useCallback(
    async (note: LeadNote, body: string) => {
      if (isSavingNote) return;
      setIsSavingNote(true);
      setError(null);
      try {
        await updateLeadNote(note.id, body);
        showToast("success", "Note updated.");
        await reload();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update note.";
        setError(message);
        showToast("error", message);
        throw err;
      } finally {
        setIsSavingNote(false);
      }
    },
    [isSavingNote, reload, setError],
  );

  const removeNote = useCallback(
    async (noteId: string) => {
      if (isSavingNote) return;
      setIsSavingNote(true);
      setError(null);
      try {
        await deleteLeadNote(noteId);
        showToast("success", "Note deleted.");
        await reload();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete note.";
        setError(message);
        showToast("error", message);
        throw err;
      } finally {
        setIsSavingNote(false);
      }
    },
    [isSavingNote, reload, setError],
  );

  return {
    isSavingAddress,
    isSavingNote,
    saveAddress,
    addNote,
    saveNote,
    removeNote,
  };
}
